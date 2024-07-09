import express from 'express';
import { saveToken, getToken, fetchAndSaveAlbumsHandler, fetchAndSaveSongsHandler, fetchAndSaveRatingsHandler, fetchAndSaveAlbumRatingsHandler, addSongsToRatingsHandler, getRatings, getLibrary, updateAlbumArtwork, } from '../controllers/apple.controller.js';
import protectRoute from '../middleware/protectRoute.js';
import axios from 'axios';
const app = express();
app.use(express.json());
const router = express.Router();
// http://localhost:5000/api/apple/save-token
router.post('/save-token', protectRoute, saveToken);
// http://localhost:5000/api/apple/update-album-artwork
router.post('/update-album-artwork', protectRoute, updateAlbumArtwork);
// http://localhost:5000/api/apple/get-token
router.post('/get-token', protectRoute, getToken);
// http://localhost:5000/api/apple/fetch-albums
router.post('/fetch-albums', protectRoute, fetchAndSaveAlbumsHandler);
// http://localhost:5000/api/apple/fetch-songs
router.post('/fetch-songs', protectRoute, fetchAndSaveSongsHandler);
// http://localhost:5000/api/apple/fetch-song-ratings
router.post('/fetch-song-ratings', protectRoute, fetchAndSaveRatingsHandler);
// http://localhost:5000/api/apple/fetch-album-ratings
router.post('/fetch-album-ratings', protectRoute, fetchAndSaveAlbumRatingsHandler);
// http://localhost:5000/api/apple/add-songs-to-ratings
router.post('/add-songs-to-ratings', protectRoute, addSongsToRatingsHandler);
// http://localhost:5000/api/apple/get-ratings
router.post('/get-ratings', protectRoute, getRatings);
// http://localhost:5000/api/apple/get-library
router.post('/get-library', protectRoute, getLibrary);
//Resolve URL redirect
router.get('/resolve-url', async (req, res) => {
    const url = req.query.url;
    if (typeof url !== 'string') {
        return res.status(400).send('Invalid URL');
    }
    try {
        const response = await axios.head(url, { maxRedirects: 10 });
        res.json({ finalUrl: response.request.res.responseUrl });
    }
    catch (error) {
        console.error('Error resolving URL:', error);
        res.status(500).send('Error resolving URL');
    }
});
export default router;
