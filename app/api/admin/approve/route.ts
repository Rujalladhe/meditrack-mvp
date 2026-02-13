import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const pharmacists = await User.find({ role: 'pharmacist' }).select('-password');

        return NextResponse.json({ pharmacists }, { status: 200 });
    } catch (error) {
        console.error('Error fetching pharmacists:', error);
        return NextResponse.json(
            { message: 'Error fetching pharmacists' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { userId, isApproved } = await request.json();

        await dbConnect();

        const user = await User.findByIdAndUpdate(
            userId,
            { isApproved },
            { new: true }
        ).select('-password');

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(
            { message: 'User approval status updated', user },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error updating approval:', error);
        return NextResponse.json(
            { message: 'Error updating approval status' },
            { status: 500 }
        );
    }
}
