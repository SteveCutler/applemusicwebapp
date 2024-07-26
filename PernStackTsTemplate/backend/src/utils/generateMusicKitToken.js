import jwt from 'jsonwebtoken'

import dotenv from 'dotenv'

dotenv.config()

const payload = {
    iss: process.env.TEAM_ID, // Your 10-character Apple Developer Team ID
    iat: Math.floor(Date.now() / 1000), // The issued at time, in seconds since epoch
    exp: Math.floor(Date.now() / 1000) + 180 * 24 * 60 * 60, // The expiration time, 6 months from now
    origin: [
        'https://musfrontend.vercel.app',
        'https://www.musmus.app',
        'http://localhost:5173',
        'https://mus-backend-b262ef3b1b65.herokuapp.com',
    ], // List of allowed origins
}

// Create the JWT developer token using the private key from the environment variable
const token = jwt.sign(
    payload,
    process.env.MUSICKIT_AUTHKEY?.replace(/\\n/g, '\n'), // Replace escaped newlines in the private key
    {
        algorithm: 'ES256',
        keyid: process.env.KEY_ID, // Your 10-character Key ID from the MusicKit key
    }
)
console.log('token =', token)
