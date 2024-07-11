import express from 'express'
import {
    subscribePodcast,
    fetchEpisodes,
    trackProgress,
    fetchRecentEpisodes,
    getSubs,
    removeSub,
} from '../controllers/podcast.controller.js'
import protectRoute from '../middleware/protectRoute.js'

const app = express()
app.use(express.json())

const router = express.Router()

// https://mus-backend-b262ef3b1b65.herokuapp.com/api/podcast/subcribe
router.post('/subscribe', protectRoute, subscribePodcast)
// https://mus-backend-b262ef3b1b65.herokuapp.com/api/podcast/subcribe
router.post('/remove-sub', protectRoute, removeSub)
// https://mus-backend-b262ef3b1b65.herokuapp.com/api/podcast/episodes/:podcastId
router.get('/episodes/:podcastId', protectRoute, fetchEpisodes)
// https://mus-backend-b262ef3b1b65.herokuapp.com/api/podcast/track-progress
router.post('/track-progress', protectRoute, trackProgress)
// https://mus-backend-b262ef3b1b65.herokuapp.com/api/podcast/recent-episodes
router.get('/recent-episodes', protectRoute, fetchRecentEpisodes)
// https://mus-backend-b262ef3b1b65.herokuapp.com/api/podcast/get-subs
router.post('/get-subs', protectRoute, getSubs)

export default router
