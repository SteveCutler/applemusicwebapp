import jwt from 'jsonwebtoken'
import { Response } from 'express'

const generateToken = (userId: String, res: Response) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET!, {
        expiresIn: '15d',
    })

    res.cookie('jwt', token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, // in ms
        httpOnly: true,
        secure: true, // Ensure this is true if you're using HTTPS
        sameSite: 'None' as any,
    })

    return token
}

export default generateToken
