import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IPharmacy extends Document {
    name: string;
    ownerId: mongoose.Types.ObjectId;
    address: string;
    latitude: number;
    longitude: number;
    contactNumber: string;
    createdAt: Date;
}

const PharmacySchema: Schema = new Schema({
    name: {
        type: String,
        required: [true, 'Please provide a pharmacy name'],
    },
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    address: {
        type: String,
        required: [true, 'Please provide an address'],
    },
    latitude: {
        type: Number,
        required: [true, 'Please provide latitude'],
    },
    longitude: {
        type: Number,
        required: [true, 'Please provide longitude'],
    },
    contactNumber: {
        type: String,
        required: [true, 'Please provide a contact number'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Pharmacy: Model<IPharmacy> = mongoose.models.Pharmacy || mongoose.model<IPharmacy>('Pharmacy', PharmacySchema);

export default Pharmacy;
