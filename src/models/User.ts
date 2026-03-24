import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN'
}

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    role: UserRole;
    isActive: boolean;
    matchPassword(enteredPassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.USER },
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true
});

UserSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password as string, salt);
    next();
});

UserSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password as string);
};

// Override the toJSON method to prevent password from being returned
UserSchema.set('toJSON', {
    transform: (doc, ret, options) => {
        delete (ret as any).password;
        delete (ret as any).__v;
        return ret;
    }
});

export default mongoose.model<IUser>('User', UserSchema);
