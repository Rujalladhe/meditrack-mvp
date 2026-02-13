import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                console.log('--- Auth Attempt ---');
                if (!credentials?.email || !credentials?.password) {
                    console.log('Login failed: Missing email or password');
                    throw new Error('Please provide email and password');
                }

                try {
                    await dbConnect();
                } catch (err) {
                    console.error('DB Connection error during auth:', err);
                    throw new Error('Internal server error');
                }

                const user = await User.findOne({ email: credentials.email.toLowerCase() });
                console.log(`User lookup for ${credentials.email}:`, user ? 'Found' : 'Not Found');

                if (!user) {
                    throw new Error('Invalid email or password');
                }

                const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
                console.log(`Password valid: ${isPasswordValid}`);

                if (!isPasswordValid) {
                    throw new Error('Invalid email or password');
                }

                // Check if pharmacist is approved
                if (user.role === 'pharmacist' && !user.isApproved) {
                    console.log(`Pharmacist ${user.email} is not approved`);
                    throw new Error('Your account is pending approval from admin');
                }

                console.log(`Login successful for ${user.email} (Role: ${user.role})`);
                return {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    isApproved: user.isApproved,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.id = user.id;
                token.isApproved = user.isApproved;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.role = token.role as string;
                session.user.id = token.id as string;
                session.user.isApproved = token.isApproved as boolean;
            }
            return session;
        },
    },
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
};
