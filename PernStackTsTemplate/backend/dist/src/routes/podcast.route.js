import express from 'express';
import { subscribePodcast, fetchEpisodes, trackProgress, fetchRecentEpisodes, getSubs, } from '../controllers/podcast.controller.js';
import protectRoute from '../middleware/protectRoute.js';
const app = express();
app.use(express.json());
const router = express.Router();
// http://localhost:5000/api/podcast/subcribe
router.post('/subscribe', protectRoute, subscribePodcast);
// http://localhost:5000/api/podcast/episodes/:podcastId
router.get('/episodes/:podcastId', protectRoute, fetchEpisodes);
// http://localhost:5000/api/podcast/track-progress
router.post('/track-progress', protectRoute, trackProgress);
// http://localhost:5000/api/podcast/recent-episodes
router.get('/recent-episodes', protectRoute, fetchRecentEpisodes);
// http://localhost:5000/api/podcast/get-subs
router.post('/get-subs', protectRoute, getSubs);
export default router;
