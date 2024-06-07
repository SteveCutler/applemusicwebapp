import jwt from 'jsonwebtoken'

import dotenv from 'dotenv'

dotenv.config()

// Create the JWT developer token using the private key from the environment variable
const token = jwt.sign(
    {},
    process.env.MUSICKIT_AUTHKEY?.replace(/\\n/g, '\n'),
    {
        algorithm: 'ES256',
        expiresIn: '180d', // 6 months
        issuer: process.env.TEAM_ID, // Your 10-character Apple Developer Team ID
        keyid: process.env.KEY_ID, // Your 10-character Key ID from the MusicKit key
    }
)

console.log('Developer Token:', token)
