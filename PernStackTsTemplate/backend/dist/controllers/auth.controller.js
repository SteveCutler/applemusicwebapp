import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import bcryptjs from 'bcryptjs';
import generateToken from '../utils/generateToken.js';
import { v4 as uuidv4 } from 'uuid';
console.log('EMAIL:', process.env.EMAIL);
console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD);
//EMAIL VERIFICASTION FUNCTIONS
export const signup = async (req, res) => {
    try {
        const { password, confirmPassword, email } = req.body;
        if (!password || !confirmPassword || !email) {
            return res.status(400).json({ error: 'Please fill in all fields' });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords don't match" });
        }
        const user = await prisma.user.findUnique({ where: { email } });
        if (user) {
            return res.status(400).json({ error: 'User already exists' });
        }
        // ENCRYPT PASSWORD
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);
        const verificationToken = uuidv4();
        const newUser = await prisma.user.create({
            data: {
                password: hashedPassword,
                email,
                verified: false,
                verificationToken,
            },
        });
        if (newUser) {
            // if new user generate token
            generateToken(newUser.id, res);
            res.status(201).json({
                id: newUser.id,
                email: newUser.email,
            });
        }
        else {
            res.status(400).json({ error: 'Invalid user data' });
        }
    }
    catch (error) {
        console.log('Error in signup controller', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
export const verifyEmail = async (req, res) => {
    const { token } = req.params;
    const user = await prisma.user.findFirst({
        where: { verificationToken: token, verified: false },
    });
    if (!user) {
        return res.status(400).json({ error: 'Invalid or expired token' });
    }
    await prisma.user.update({
        where: { id: user.id },
        data: {
            verified: true,
            verificationToken: null, // Clear the verification token
        },
    });
    res.status(200).json({ message: 'Email verified successfully' });
};
export const updateUserSettings = async (req, res) => {
    const userId = req.user.id; // Assuming you have user authentication and user ID is available in req.user
    const { settings } = req.body;
    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { settings },
        });
        res.status(200).json({
            message: 'Settings updated successfully',
            user: updatedUser,
        });
    }
    catch (error) {
        console.error('Error updating settings:', error);
        res.status(500).json({ error: 'Failed to update settings' });
    }
};
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        const isPasswordCorrect = await bcryptjs.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        const appleMusicToken = user.appleMusicToken;
        console.log('user token =', appleMusicToken);
        generateToken(user.id, res);
        res.status(200).json({
            id: user.id,
            email: user.email,
            appleMusicToken: appleMusicToken,
        });
    }
    catch (error) {
        console.log('Error in login controller', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
export const logout = async (req, res) => {
    try {
        res.cookie('jwt', '', { maxAge: 0 });
        res.status(200).json({ message: 'Logged out successfully' });
    }
    catch (error) {
        console.log('Error in logout controller', error.message);
        res.status(500).json({ error: 'Internal state error' });
    }
};
export const getMe = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({
            id: user.id,
            email: user.email,
        });
    }
    catch (error) {
        console.log('Error in logout controller', error.message);
        res.status(500).json({ error: 'Internal state error' });
    }
};
