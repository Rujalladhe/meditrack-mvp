import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/login');
    }

    console.log('Dashboard Redirect Debug:', {
        email: session.user?.email,
        role: session.user?.role
    });

    // Redirect based on role
    const role = session.user?.role;

    if (role === 'admin') {
        redirect('/dashboard/admin');
    } else if (role === 'pharmacist') {
        redirect('/dashboard/pharmacist');
    } else {
        redirect('/dashboard/user');
    }
}
