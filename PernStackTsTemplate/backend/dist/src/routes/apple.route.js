import express from 'express';
import { saveToken, getToken, getLibrary, } from '../controllers/apple.controller.js';
import protectRoute from '../middleware/protectRoute.js';
const app = express();
app.use(express.json());
const router = express.Router();
// http://localhost:5000/api/apple/save-token
router.post('/save-token', protectRoute, saveToken);
// http://localhost:5000/api/apple/get-token
router.post('/get-token', protectRoute, getToken);
// http://localhost:5000/api/apple/get-token
router.post('/get-library', protectRoute, getLibrary);
export default router;
