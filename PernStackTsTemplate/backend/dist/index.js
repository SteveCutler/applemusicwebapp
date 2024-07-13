"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_route_js_1 = __importDefault(require("../src/routes/auth.route.js"));
const apple_route_js_1 = __importDefault(require("../src/routes/apple.route.js"));
const podcast_route_js_1 = __importDefault(require("../src/routes/podcast.route.js"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json()); // for parsing application/json
const allowedOrigins = [
    'http://localhost:5173',
    'https://mus-b2sxm6mp2-steve-cutlers-projects.vercel.app',
    'https://musfrontend.vercel.app',
    'https://mus-backend-b262ef3b1b65.herokuapp.com',
];
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 204,
};
app.use((0, cors_1.default)(corsOptions));
app.use('/api/auth', auth_route_js_1.default);
app.use('/api/apple', apple_route_js_1.default);
app.use('/api/podcast', podcast_route_js_1.default);
app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
