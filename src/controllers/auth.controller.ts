import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { user, token } = await authService.registerUser(req.body);

        res.status(201).json({
            success: true,
            data: { user, token }
        });
    } catch (error: any) {
        if (error.message === 'User already exists') {
            return res.status(400).json({ success: false, message: error.message });
        }
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const { user, token } = await authService.loginUser(email, password);

        res.status(200).json({
            success: true,
            data: { user, token }
        });
    } catch (error: any) {
        if (error.message === 'Invalid email or password') {
            return res.status(401).json({ success: false, message: error.message });
        }
        next(error);
    }
};
