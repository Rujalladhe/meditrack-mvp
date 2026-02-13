import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'pharmacist' | 'user';
    isApproved: boolean;
    createdAt: Date;
}

const UserSchema: Schema = new Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
    },
    role: {
        type: String,
        enum: ['admin', 'pharmacist', 'user'],
        default: 'user',
    },
    isApproved: {
        type: Boolean,
        default: function (this: IUser) {
            return this.role !== 'pharmacist';
        },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
