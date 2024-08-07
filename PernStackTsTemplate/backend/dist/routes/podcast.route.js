import express from 'express';
import { subscribePodcast, trackProgress, 
// fetchRecentEpisodes,
search, getSubs, removeSub, getRecentEpisodes, getEpisodeById, retrieveProgress, getPodcastById, getPodcastByUrl, } from '../controllers/podcast.controller.js';
import protectRoute from '../middleware/protectRoute.js';
const app = express();
app.use(express.json());
const router = express.Router();
// https://mus-backend-b262ef3b1b65.herokuapp.com/api/podcast/episodesFetch/${ids}
router.post('/get-episodes/:feedId', protectRoute, getRecentEpisodes);
// https://mus-backend-b262ef3b1b65.herokuapp.com/api/podcast/subcribe
router.post('/subscribe', protectRoute, subscribePodcast);
// https://mus-backend-b262ef3b1b65.herokuapp.com/api/podcast/subcribe
router.post('/remove-sub', protectRoute, removeSub);
// // https://mus-backend-b262ef3b1b65.herokuapp.com/api/podcast/episode/:id
router.get('/episode/:id', protectRoute, getEpisodeById);
// // https://mus-backend-b262ef3b1b65.herokuapp.com/api/podcast/episode/:id
router.get('/get-podcast/:feedId', protectRoute, getPodcastById);
// // https://mus-backend-b262ef3b1b65.herokuapp.com/api/podcast/podcast-by-url
router.post('/podcast-by-url/', protectRoute, getPodcastByUrl);
// https://mus-backend-b262ef3b1b65.herokuapp.com/api/podcast/track-progress
router.post('/save-progress', protectRoute, trackProgress);
// https://mus-backend-b262ef3b1b65.herokuapp.com/api/podcast/track-progress
router.post('/get-progress', protectRoute, retrieveProgress);
// // https://mus-backend-b262ef3b1b65.herokuapp.com/api/podcast/search
router.post('/search', protectRoute, search);
// https://mus-backend-b262ef3b1b65.herokuapp.com/api/podcast/get-subs
router.post('/get-subs', protectRoute, getSubs);
export default router;
