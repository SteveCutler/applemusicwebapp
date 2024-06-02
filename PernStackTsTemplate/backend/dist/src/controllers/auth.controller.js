import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import bcryptjs from 'bcryptjs';
import generateToken from '../utils/generateToken.js';
export const signup = async (req, res) => {
    try {
        console.log(req.body);
        const { fullName, username, password, confirmPassword, email } = req.body;
        if (!fullName || !username || !password || !confirmPassword || !email) {
            return res.status(400).json({ error: 'Please fill in all fields' });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords don't match" });
        }
        const user = await prisma.user.findUnique({ where: { username } });
        if (user) {
            return res.status(400).json({ error: 'Username already exists' });
        }
        // ENCRYPT PASSWORD
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);
        // PLACEHOLDER AVATAR GENERATOR https://avatar-placeholder.iran.liara.run/
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;
        const newUser = await prisma.user.create({
            data: {
                fullName,
                username,
                password: hashedPassword,
                email,
            },
        });
        if (newUser) {
            // if new user generate token
            generateToken(newUser.id, res);
            res.status(201).json({
                id: newUser.id,
                fullName: newUser.fullName,
                username: newUser.username,
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
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await prisma.user.findUnique({ where: { username } });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        const isPasswordCorrect = await bcryptjs.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        generateToken(user.id, res);
        res.status(200).json({
            id: user.id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
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
            fullName: user.fullName,
            username: user.username,
            email: user.email,
        });
    }
    catch (error) {
        console.log('Error in logout controller', error.message);
        res.status(500).json({ error: 'Internal state error' });
    }
};
