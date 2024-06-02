import express from 'express'
import { login, logout, signup } from '../controllers/auth.controller.js'

const router = express.Router()

// http://localhost:5000/api/auth/login
router.post('/login', login)

// http://localhost:5000/api/auth/logout
router.post('/logout', logout)

// http://localhost:5000/api/auth/signup
router.post('/signup', signup)

export default router
