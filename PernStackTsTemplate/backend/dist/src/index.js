import express from 'express'
import cookieParser from 'cookie-parser'
import authRoutes from '../src/routes/auth.route.js'
import appleRoutes from '../src/routes/apple.route.js'
import podcastRoutes from '../src/routes/podcast.route.js'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()

const app = express()
app.use(cookieParser())
app.use(express.json()) // for parsing application/json

const corsOptions = {
    origin:
        process.env.NODE_ENV === 'production'
            ? [
                  'http://localhost:5173',
                  'https://musfrontend.vercel.app',
                  'https://mus-backend-b262ef3b1b65.herokuapp.com',
              ]
            : [
                  'http://localhost:5173',
                  'https://musfrontend.vercel.app',
                  'https://mus-backend-b262ef3b1b65.herokuapp.com',
              ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
}
app.use(cors(corsOptions))

app.use('/api/auth', authRoutes)
app.use('/api/apple', appleRoutes)
app.use('/api/podcast', podcastRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
