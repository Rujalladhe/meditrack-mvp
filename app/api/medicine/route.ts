import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Medicine from '@/models/Medicine';
import Pharmacy from '@/models/Pharmacy';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        let medicines;

        if (session.user.role === 'pharmacist') {
            // Get pharmacist's pharmacy
            const pharmacy = await Pharmacy.findOne({ ownerId: session.user.id });

            if (!pharmacy) {
                return NextResponse.json({ medicines: [] }, { status: 200 });
            }

            // Get medicines for this pharmacy
            medicines = await Medicine.find({ pharmacyId: pharmacy._id }).populate('pharmacyId', 'name');
        } else {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        return NextResponse.json({ medicines }, { status: 200 });
    } catch (error) {
        console.error('Error fetching medicines:', error);
        return NextResponse.json(
            { message: 'Error fetching medicines' },
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

        const { name, brandName, price, quantity, expiryDate, gender, ageGroup, discount } = await request.json();

        if (!name || !brandName || price === undefined || quantity === undefined || !expiryDate || !ageGroup) {
            return NextResponse.json(
                { message: 'Please provide all required fields' },
                { status: 400 }
            );
        }

        await dbConnect();

        // Get pharmacist's pharmacy
        const pharmacy = await Pharmacy.findOne({ ownerId: session.user.id });

        if (!pharmacy) {
            return NextResponse.json(
                { message: 'Please create a pharmacy first' },
                { status: 400 }
            );
        }

        const medicine = await Medicine.create({
            name,
            brandName,
            price,
            quantity,
            expiryDate,
            gender: gender || 'unisex',
            ageGroup,
            discount: discount || 0,
            pharmacyId: pharmacy._id,
        });

        return NextResponse.json(
            { message: 'Medicine added successfully', medicine },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error adding medicine:', error);
        return NextResponse.json(
            { message: 'Error adding medicine' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'pharmacist') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { id, ...updateData } = await request.json();

        if (!id) {
            return NextResponse.json(
                { message: 'Medicine ID is required' },
                { status: 400 }
            );
        }

        await dbConnect();

        // Get pharmacist's pharmacy
        const pharmacy = await Pharmacy.findOne({ ownerId: session.user.id });

        if (!pharmacy) {
            return NextResponse.json(
                { message: 'Pharmacy not found' },
                { status: 404 }
            );
        }

        // Verify medicine belongs to this pharmacy
        const medicine = await Medicine.findOne({ _id: id, pharmacyId: pharmacy._id });

        if (!medicine) {
            return NextResponse.json(
                { message: 'Medicine not found or unauthorized' },
                { status: 404 }
            );
        }

        const updatedMedicine = await Medicine.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        return NextResponse.json(
            { message: 'Medicine updated successfully', medicine: updatedMedicine },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error updating medicine:', error);
        return NextResponse.json(
            { message: 'Error updating medicine' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'pharmacist') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const medicineId = searchParams.get('id');

        if (!medicineId) {
            return NextResponse.json(
                { message: 'Medicine ID is required' },
                { status: 400 }
            );
        }

        await dbConnect();

        // Get pharmacist's pharmacy
        const pharmacy = await Pharmacy.findOne({ ownerId: session.user.id });

        if (!pharmacy) {
            return NextResponse.json(
                { message: 'Pharmacy not found' },
                { status: 404 }
            );
        }

        // Verify medicine belongs to this pharmacy
        const medicine = await Medicine.findOneAndDelete({
            _id: medicineId,
            pharmacyId: pharmacy._id
        });

        if (!medicine) {
            return NextResponse.json(
                { message: 'Medicine not found or unauthorized' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: 'Medicine deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting medicine:', error);
        return NextResponse.json(
            { message: 'Error deleting medicine' },
            { status: 500 }
        );
    }
}
