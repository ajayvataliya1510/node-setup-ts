import { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

export const configureSecurity = (app: Express) => {
    // Set fundamental security headers
    app.use(helmet());

    // Enable Cross-Origin Resource Sharing
    app.use(cors({
        origin: '*',
        credentials: true,
    }));

    // Rate Limiting to prevent brute-force attacks
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
        message: 'Too many requests from this IP, please try again after 15 minutes'
    });

    app.use('/api', limiter);
};
