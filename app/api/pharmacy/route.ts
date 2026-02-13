import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Pharmacy from '@/models/Pharmacy';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        let pharmacies;

        if (session.user.role === 'admin') {
            // Admin can see all pharmacies
            pharmacies = await Pharmacy.find().populate('ownerId', 'name email');
        } else if (session.user.role === 'pharmacist') {
            // Pharmacist can only see their own pharmacy
            pharmacies = await Pharmacy.find({ ownerId: session.user.id });
        } else {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        return NextResponse.json({ pharmacies }, { status: 200 });
    } catch (error) {
        console.error('Error fetching pharmacies:', error);
        return NextResponse.json(
            { message: 'Error fetching pharmacies' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'pharmacist') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { name, address, latitude, longitude, contactNumber } = await request.json();

        if (!name || !address || !latitude || !longitude || !contactNumber) {
            return NextResponse.json(
                { message: 'Please provide all required fields' },
                { status: 400 }
            );
        }

        await dbConnect();

        // Check if pharmacist already has a pharmacy
        const existingPharmacy = await Pharmacy.findOne({ ownerId: session.user.id });
        if (existingPharmacy) {
            return NextResponse.json(
                { message: 'You already have a pharmacy registered' },
                { status: 400 }
            );
        }

        const pharmacy = await Pharmacy.create({
            name,
            address,
            latitude,
            longitude,
            contactNumber,
            ownerId: session.user.id,
        });

        return NextResponse.json(
            { message: 'Pharmacy created successfully', pharmacy },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating pharmacy:', error);
        return NextResponse.json(
            { message: 'Error creating pharmacy' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const pharmacyId = searchParams.get('id');

        if (!pharmacyId) {
            return NextResponse.json(
                { message: 'Pharmacy ID is required' },
                { status: 400 }
            );
        }

        await dbConnect();

        const pharmacy = await Pharmacy.findByIdAndDelete(pharmacyId);

        if (!pharmacy) {
            return NextResponse.json(
                { message: 'Pharmacy not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: 'Pharmacy deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting pharmacy:', error);
        return NextResponse.json(
            { message: 'Error deleting pharmacy' },
            { status: 500 }
        );
    }
}
