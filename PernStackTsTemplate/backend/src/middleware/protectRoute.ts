import jwt, { JwtPayload } from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

import { Request, Response, NextFunction } from 'express'

interface DecodedToken extends JwtPayload {
    userId: string
}

declare global {
    namespace Express {
        export interface Request {
            user: {
                id: string
            }
        }
    }
}
const protectRoute = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.cookies.jwt
        console.log('token', token)

        if (!token) {
            return res
                .status(401)
                .json({ error: 'Unauthorized - no token provided' })
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET!
        ) as DecodedToken

        if (!decoded) {
            return res
                .status(401)
                .json({ error: 'Unauthorized - Invalid Token' })
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                email: true,
            },
        })

        if (!user) {
            return res
                .status(401)
                .json({ error: 'Unauthorized - User not found' })
        }

        req.user = user

        next()
    } catch (error: any) {
        console.log('Error in protectRoute middleware', error.message)
        res.status(500).json({ error: 'Internal server error' })
    }
}

export default protectRoute
