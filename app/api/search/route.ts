import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Medicine from '@/models/Medicine';
import Pharmacy from '@/models/Pharmacy';
import { calculateDistance } from '@/lib/distance';

export async function POST(request: NextRequest) {
    try {
        // Guard: fail fast with a clear message if env vars missing
        if (!process.env.MONGODB_URI) {
            console.error('MONGODB_URI is not set in environment variables');
            return NextResponse.json({ message: 'Server configuration error: MONGODB_URI missing' }, { status: 500 });
        }

        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { medicineName, userLatitude, userLongitude, sortBy } = await request.json();

        if (!userLatitude || !userLongitude) {
            return NextResponse.json(
                { message: 'Please provide location' },
                { status: 400 }
            );
        }

        await dbConnect();

        // Build query
        const query: any = { quantity: { $gt: 0 } };
        if (medicineName && medicineName.trim()) {
            query.name = { $regex: medicineName, $options: 'i' };
        }

        // Find medicines and populate pharmacy
        const medicines = await Medicine.find(query)
            .limit(50)
            .populate('pharmacyId');

        // Filter out any with missing/null pharmacy refs, then map
        const results = medicines
            .filter((medicine: any) => medicine.pharmacyId && medicine.pharmacyId.latitude != null)
            .map((medicine: any) => {
                const pharmacy = medicine.pharmacyId;
                const distance = calculateDistance(
                    userLatitude,
                    userLongitude,
                    pharmacy.latitude,
                    pharmacy.longitude
                );

                return {
                    medicineId: medicine._id,
                    medicineName: medicine.name,
                    brandName: medicine.brandName,
                    price: medicine.price,
                    quantity: medicine.quantity,
                    discount: medicine.discount,
                    expiryDate: medicine.expiryDate,
                    gender: medicine.gender,
                    ageGroup: medicine.ageGroup,
                    pharmacy: {
                        id: pharmacy._id,
                        name: pharmacy.name,
                        address: pharmacy.address,
                        latitude: pharmacy.latitude,
                        longitude: pharmacy.longitude,
                        contactNumber: pharmacy.contactNumber,
                    },
                    distance,
                    finalPrice: medicine.price - (medicine.price * medicine.discount) / 100,
                };
            });

        // Sort results
        let sortedResults = [...results];

        switch (sortBy) {
            case 'price':
                sortedResults.sort((a, b) => a.finalPrice - b.finalPrice);
                break;
            case 'discount':
                sortedResults.sort((a, b) => b.discount - a.discount);
                break;
            case 'distance':
            default:
                sortedResults.sort((a, b) => a.distance - b.distance);
                break;
        }

        return NextResponse.json(
            {
                results: sortedResults,
                count: sortedResults.length,
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Search API error:', error?.message || error);
        return NextResponse.json(
            { message: 'Error searching medicines', detail: error?.message },
            { status: 500 }
        );
    }
}
