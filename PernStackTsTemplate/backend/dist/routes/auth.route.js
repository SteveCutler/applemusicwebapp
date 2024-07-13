"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_js_1 = require("../controllers/auth.controller.js");
const protectRoute_js_1 = __importDefault(require("../middleware/protectRoute.js"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const router = express_1.default.Router();
// https://mus-backend-b262ef3b1b65.herokuapp.com/api/auth/login
router.post('/login', auth_controller_js_1.login);
// https://mus-backend-b262ef3b1b65.herokuapp.com/api/auth/logout
router.post('/logout', auth_controller_js_1.logout);
// https://mus-backend-b262ef3b1b65.herokuapp.com/api/auth/signup
router.post('/signup', auth_controller_js_1.signup);
// https://mus-backend-b262ef3b1b65.herokuapp.com/api/auth/signup
router.get('/me', protectRoute_js_1.default, auth_controller_js_1.getMe);
exports.default = router;
