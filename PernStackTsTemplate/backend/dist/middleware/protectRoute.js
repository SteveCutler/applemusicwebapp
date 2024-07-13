"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res
                .status(401)
                .json({ error: 'Unauthorized - no token provided' });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res
                .status(401)
                .json({ error: 'Unauthorized - Invalid Token' });
        }
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                username: true,
                fullName: true,
                email: true,
            },
        });
        if (!user) {
            return res
                .status(401)
                .json({ error: 'Unauthorized - User not found' });
        }
        req.user = user;
        next();
    }
    catch (error) {
        console.log('Error in protectRoute middleware', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.default = protectRoute;
