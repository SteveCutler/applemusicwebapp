import express from 'express'
import cookieParser from 'cookie-parser'
import authRoutes from '../src/routes/auth.route.js'
import appleRoutes from '../src/routes/apple.route.js'
import cors from 'cors'

import dotenv from 'dotenv'
dotenv.config()

const app = express()
app.use(cookieParser())
app.use(express.json()) // for parsing application/json
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
}
app.use(cors(corsOptions))

app.use('/api/auth', authRoutes)
app.use('/api/apple', appleRoutes)

app.listen(5000, () => {
    console.log('Server is running on port 5000')
})
