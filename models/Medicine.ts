import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IMedicine extends Document {
    name: string;
    brandName: string;
    genericName: string;
    category: string;
    price: number;
    quantity: number;
    expiryDate: Date;
    gender: 'male' | 'female' | 'unisex';
    ageGroup: string;
    discount: number;
    pharmacyId: mongoose.Types.ObjectId;
    
    // Medical Information
    symptoms: string[];
    dosage: string;
    sideEffects: string[];
    precautions: string[];
    whenToUse: string;
    whenNotToUse: string;
    timingInstructions: string;
    
    createdAt: Date;
}

const MedicineSchema: Schema = new Schema({
    name: {
        type: String,
        required: [true, 'Please provide medicine name'],
    },
    brandName: {
        type: String,
        required: [true, 'Please provide brand name'],
    },
    genericName: {
        type: String,
        default: '',
    },
    category: {
        type: String,
        default: 'General',
    },
    price: {
        type: Number,
        required: [true, 'Please provide price'],
        min: 0,
    },
    quantity: {
        type: Number,
        required: [true, 'Please provide quantity'],
        min: 0,
    },
    expiryDate: {
        type: Date,
        required: [true, 'Please provide expiry date'],
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'unisex'],
        default: 'unisex',
    },
    ageGroup: {
        type: String,
        required: [true, 'Please provide age group'],
    },
    discount: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    },
    pharmacyId: {
        type: Schema.Types.ObjectId,
        ref: 'Pharmacy',
        required: true,
    },
    
    // Medical Information
    symptoms: {
        type: [String],
        default: [],
    },
    dosage: {
        type: String,
        default: '',
    },
    sideEffects: {
        type: [String],
        default: [],
    },
    precautions: {
        type: [String],
        default: [],
    },
    whenToUse: {
        type: String,
        default: '',
    },
    whenNotToUse: {
        type: String,
        default: '',
    },
    timingInstructions: {
        type: String,
        default: '',
    },
    
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Medicine: Model<IMedicine> = mongoose.models.Medicine || mongoose.model<IMedicine>('Medicine', MedicineSchema);

export default Medicine;
