import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

import bcryptjs from 'bcryptjs'

export const saveToken = async (req: Request, res: Response) => {
    // console.log(req.body)
    const { userId, userToken, tokenExpiryDate } = req.body

    try {
        await prisma.user.update({
            where: { id: userId },
            data: {
                appleMusicToken: userToken,
                tokenExpiryDate,
            },
        })
        res.status(201).send('Token save succesfully!')
    } catch (error) {
        console.error('Error saving token:', error)
        res.status(500).send('Error updating token')
    }
}

export const getToken = async (req: Request, res: Response) => {
    const { userId } = req.body

    try {
        const result = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                appleMusicToken: true,
                tokenExpiryDate: true,
            },
        })
        if (result && result != null) {
            console.log('result:', result)
            res.status(200).json(result)
        } else {
            res.status(404).json({ message: 'token not found' })
        }
    } catch (error) {
        console.error('Error saving token:', error)
        res.status(500).send('Error updating token')
    }
}
