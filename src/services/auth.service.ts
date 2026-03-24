import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

export const generateToken = (id: string, role: string): string => {
    const options: jwt.SignOptions = {
        expiresIn: (process.env.JWT_EXPIRES_IN || '30d') as any,
    };
    return jwt.sign({ id, role }, process.env.JWT_SECRET as string, options);
};

export const registerUser = async (userData: Partial<IUser>) => {
    const userExists = await User.findOne({ email: userData.email });
    if (userExists) {
        throw new Error('User already exists');
    }

    const user = await User.create(userData);
    const token = generateToken(user._id as unknown as string, user.role);

    return { user, token };
};

export const loginUser = async (email: string, password: string) => {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
        throw new Error('Invalid email or password');
    }

    const token = generateToken(user._id as unknown as string, user.role);

    return { user, token };
};
