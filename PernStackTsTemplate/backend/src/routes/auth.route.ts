import express from 'express'
import {
    login,
    logout,
    signup,
    getMe,
    verifyEmail,
    updateUserSettings,
} from '../controllers/auth.controller.js'
import protectRoute from '../middleware/protectRoute.js'

const app = express()
app.use(express.json())

const router = express.Router()

// https://mus-backend-b262ef3b1b65.herokuapp.com/api/auth/login
router.post('/login', login)

// https://mus-backend-b262ef3b1b65.herokuapp.com/api/auth/logout
router.post('/logout', logout)

// https://mus-backend-b262ef3b1b65.herokuapp.com/api/auth/signup
router.post('/signup', signup)

// https://mus-backend-b262ef3b1b65.herokuapp.com/api/auth/signup
router.get('/me', protectRoute, getMe)

// Email verification route
router.get('/verify-email/:token', verifyEmail)

// User settings update route (protected)
router.put('/settings', protectRoute, updateUserSettings)

export default router
