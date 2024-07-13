"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const podcast_controller_js_1 = require("../controllers/podcast.controller.js");
const protectRoute_js_1 = __importDefault(require("../middleware/protectRoute.js"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const router = express_1.default.Router();
// https://mus-backend-b262ef3b1b65.herokuapp.com/api/podcast/episodesFetch/${ids}
router.post('/episodes/', podcast_controller_js_1.getEpisodesByFeedId);
// https://mus-backend-b262ef3b1b65.herokuapp.com/api/podcast/subcribe
router.post('/subscribe', protectRoute_js_1.default, podcast_controller_js_1.subscribePodcast);
// https://mus-backend-b262ef3b1b65.herokuapp.com/api/podcast/subcribe
router.post('/remove-sub', protectRoute_js_1.default, podcast_controller_js_1.removeSub);
// // https://mus-backend-b262ef3b1b65.herokuapp.com/api/podcast/episodes/:podcastId
// router.get('/episodes/:podcastId', protectRoute, fetchEpisodes)
// https://mus-backend-b262ef3b1b65.herokuapp.com/api/podcast/track-progress
router.post('/track-progress', protectRoute_js_1.default, podcast_controller_js_1.trackProgress);
// // https://mus-backend-b262ef3b1b65.herokuapp.com/api/podcast/recent-episodes
// router.get('/recent-episodes', protectRoute, fetchRecentEpisodes)
// https://mus-backend-b262ef3b1b65.herokuapp.com/api/podcast/get-subs
router.post('/get-subs', protectRoute_js_1.default, podcast_controller_js_1.getSubs);
exports.default = router;
