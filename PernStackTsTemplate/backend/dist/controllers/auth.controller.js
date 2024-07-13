"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.logout = exports.login = exports.signup = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generateToken_js_1 = __importDefault(require("../utils/generateToken.js"));
const signup = async (req, res) => {
    try {
        const { fullName, username, password, confirmPassword, email } = req.body;
        if (!fullName || !username || !password || !confirmPassword || !email) {
            return res.status(400).json({ error: 'Please fill in all fields' });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords don't match" });
        }
        const user = await prisma.user.findUnique({ where: { email } });
        if (user) {
            return res.status(400).json({ error: 'Username already exists' });
        }
        // ENCRYPT PASSWORD
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
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
            (0, generateToken_js_1.default)(newUser.id, res);
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
exports.signup = signup;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        const isPasswordCorrect = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        const appleMusicToken = user.appleMusicToken;
        console.log('user token =', appleMusicToken);
        (0, generateToken_js_1.default)(user.id, res);
        res.status(200).json({
            id: user.id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            appleMusicToken: appleMusicToken,
        });
    }
    catch (error) {
        console.log('Error in login controller', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.login = login;
const logout = async (req, res) => {
    try {
        res.cookie('jwt', '', { maxAge: 0 });
        res.status(200).json({ message: 'Logged out successfully' });
    }
    catch (error) {
        console.log('Error in logout controller', error.message);
        res.status(500).json({ error: 'Internal state error' });
    }
};
exports.logout = logout;
const getMe = async (req, res) => {
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
exports.getMe = getMe;
