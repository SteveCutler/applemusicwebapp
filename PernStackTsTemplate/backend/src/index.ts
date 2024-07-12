import express from 'express'
import cookieParser from 'cookie-parser'
import authRoutes from '../src/routes/auth.route.js'
import appleRoutes from '../src/routes/apple.route.js'
import podcastRoutes from '../src/routes/podcast.route.js'
import cors, { CorsOptions } from 'cors'

import dotenv from 'dotenv'
dotenv.config()

const app = express()
app.use(cookieParser())
app.use(express.json()) // for parsing application/json

const allowedOrigins = [
    'http://localhost:5173',
    'https://mus-b2sxm6mp2-steve-cutlers-projects.vercel.app',
    'https://musfrontend.vercel.app',
    'https://mus-backend-b262ef3b1b65.herokuapp.com',
]

const corsOptions: CorsOptions = {
    origin: (
        origin: string | undefined,
        callback: (err: Error | null, allow?: boolean) => void
    ) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true,
    optionsSuccessStatus: 204,
}

app.use(cors(corsOptions))

app.use('/api/auth', authRoutes)
app.use('/api/apple', appleRoutes)
app.use('/api/podcast', podcastRoutes)

app.listen(5000, () => {
    console.log('Server is running on port 5000')
})
