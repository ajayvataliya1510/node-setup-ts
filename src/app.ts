import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { configureSecurity } from './middlewares/security.middleware';
import { errorHandler } from './middlewares/error.middleware';

// Initialize context
dotenv.config();
const app = express();

// Database
connectDB();

// Middlewares
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(morgan('dev'));

// Security Middlewares (Helmet, CORS, Rate Limiting)
configureSecurity(app);

import routes from './routes';

// Routes mounting
app.use('/api/v1', routes);

app.get('/health', (req, res) => {
    res.status(200).json({ success: true, message: 'Server is healthy' });
});

// Error Handling Middleware (must be last)
app.use(errorHandler);

export default app;
