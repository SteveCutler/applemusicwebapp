import express from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.route.js';
import appleRoutes from './routes/apple.route.js';
import podcastRoutes from './routes/podcast.route.js';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
app.use(cookieParser());
app.use(express.json()); // for parsing application/json
const allowedOrigins = [
    'http://localhost:5173',
    'https://www.musmus.app',
    'https://mus-b2sxm6mp2-steve-cutlers-projects.vercel.app',
    'https://musfrontend.vercel.app',
    'https://mus-backend-b262ef3b1b65.herokuapp.com',
];
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
app.use('/api/auth', authRoutes);
app.use('/api/apple', appleRoutes);
app.use('/api/podcast', podcastRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
