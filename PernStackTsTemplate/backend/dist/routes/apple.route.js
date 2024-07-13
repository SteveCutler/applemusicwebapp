"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const apple_controller_js_1 = require("../controllers/apple.controller.js");
const protectRoute_js_1 = __importDefault(require("../middleware/protectRoute.js"));
const axios_1 = __importDefault(require("axios"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const router = express_1.default.Router();
// https://mus-backend-b262ef3b1b65.herokuapp.com/api/apple/save-token
router.post('/save-token', protectRoute_js_1.default, apple_controller_js_1.saveToken);
// https://mus-backend-b262ef3b1b65.herokuapp.com/api/apple/update-album-artwork
router.post('/update-album-artwork', protectRoute_js_1.default, apple_controller_js_1.updateAlbumArtwork);
// https://mus-backend-b262ef3b1b65.herokuapp.com/api/apple/get-token
router.post('/get-token', protectRoute_js_1.default, apple_controller_js_1.getToken);
// https://mus-backend-b262ef3b1b65.herokuapp.com/api/apple/fetch-albums
router.post('/fetch-albums', protectRoute_js_1.default, apple_controller_js_1.fetchAndSaveAlbumsHandler);
// https://mus-backend-b262ef3b1b65.herokuapp.com/api/apple/fetch-songs
router.post('/fetch-songs', protectRoute_js_1.default, apple_controller_js_1.fetchAndSaveSongsHandler);
// https://mus-backend-b262ef3b1b65.herokuapp.com/api/apple/fetch-song-ratings
router.post('/fetch-song-ratings', protectRoute_js_1.default, apple_controller_js_1.fetchAndSaveRatingsHandler);
// https://mus-backend-b262ef3b1b65.herokuapp.com/api/apple/fetch-album-ratings
router.post('/fetch-album-ratings', protectRoute_js_1.default, apple_controller_js_1.fetchAndSaveAlbumRatingsHandler);
// https://mus-backend-b262ef3b1b65.herokuapp.com/api/apple/add-songs-to-ratings
router.post('/add-songs-to-ratings', protectRoute_js_1.default, apple_controller_js_1.addSongsToRatingsHandler);
// https://mus-backend-b262ef3b1b65.herokuapp.com/api/apple/get-ratings
router.post('/get-ratings', protectRoute_js_1.default, apple_controller_js_1.getRatings);
// https://mus-backend-b262ef3b1b65.herokuapp.com/api/apple/get-library
router.post('/get-library', protectRoute_js_1.default, apple_controller_js_1.getLibrary);
//Resolve URL redirect
router.get('/resolve-url', async (req, res) => {
    const url = req.query.url;
    if (typeof url !== 'string') {
        return res.status(400).send('Invalid URL');
    }
    try {
        const response = await axios_1.default.head(url, { maxRedirects: 10 });
        res.json({ finalUrl: response.request.res.responseUrl });
    }
    catch (error) {
        console.error('Error resolving URL:', error);
        res.status(500).send('Error resolving URL');
    }
});
exports.default = router;
