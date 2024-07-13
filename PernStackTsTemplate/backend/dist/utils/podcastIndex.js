"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchRecentEpisodes = exports.fetchPodcastDataFromIndex = void 0;
const axios_1 = __importDefault(require("axios"));
const crypto_1 = __importDefault(require("crypto"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const apiKey = process.env.PODCASTINDEX_KEY;
const apiSecret = process.env.PODCASTINDEX_SECRET;
console.log('apiKey', process.env.PODCASTINDEX_KEY);
console.log('apiSecret', process.env.PODCASTINDEX_SECRET);
const generateAuthHeaders = () => {
    if (!apiKey || !apiSecret) {
        throw new Error('API key and secret must be defined in the environment variables.');
    }
    const apiHeaderTime = Math.floor(Date.now() / 1000);
    const hash = crypto_1.default
        .createHash('sha1')
        .update(apiKey + apiSecret + apiHeaderTime)
        .digest('hex');
    return {
        'User-Agent': 'MusAppleMusicDashboard/1.0',
        'X-Auth-Key': apiKey,
        'X-Auth-Date': apiHeaderTime,
        Authorization: hash,
    };
};
const fetchPodcastDataFromIndex = async (podcastIndexId) => {
    try {
        const headers = generateAuthHeaders();
        console.log('headers:', headers);
        const response = await axios_1.default.get(`https://api.podcastindex.org/api/1.0/podcasts/byfeedid?id=${podcastIndexId}&pretty`, { headers });
        // const episodeResponse = await axios.get(
        //     `https://api.podcastindex.org/api/1.0/episodes/byfeedid?id=${podcastIndexId}&pretty`,
        //     { headers }
        // )
        const podcast = await response.data.feed;
        console.log('podcast: ', podcast);
        // const podcastEpisodes: podcastEpisode[] =
        //     await episodeResponse.data.items
        // console.log('podcast episodes: ', podcastEpisodes)
        return {
            rssFeedUrl: podcast.url,
            title: podcast.title,
            description: podcast.description,
            artworkUrl: podcast.image,
            categories: podcast.categories,
            // episodes: podcastEpisodes.map((item: podcastEpisode) => ({
            //     title: item.title,
            //     description: item.description,
            //     audioUrl: item.enclosureUrl,
            //     releaseDate: new Date(item.datePublished * 1000), // Convert timestamp to Date
            // }))
            // ,
        };
    }
    catch (error) {
        console.error('Error fetching podcast data from PodcastIndex:', error);
        throw new Error('Failed to fetch podcast data');
    }
};
exports.fetchPodcastDataFromIndex = fetchPodcastDataFromIndex;
const fetchRecentEpisodes = async (feedId) => {
    try {
        const headers = generateAuthHeaders();
        console.log('headers:', headers);
        const response = await axios_1.default.get(`https://api.podcastindex.org/api/1.0/episodes/byfeedid?id=${feedId}`, {
            headers,
            params: {
                fulltext: true,
            },
        });
        // const episodeResponse = await axios.get(
        //     `https://api.podcastindex.org/api/1.0/episodes/byfeedid?id=${podcastIndexId}&pretty`,
        //     { headers }
        // )
        const podcasts = await response.data.feed;
        console.log('podcast: ', podcasts);
        // const podcastEpisodes: podcastEpisode[] =
        //     await episodeResponse.data.items
        // console.log('podcast episodes: ', podcastEpisodes)
        return {
            podcasts,
        };
    }
    catch (error) {
        console.error('Error fetching podcast episodes from PodcastIndex:', error);
        throw new Error('Failed to fetch podcast episode data');
    }
};
exports.fetchRecentEpisodes = fetchRecentEpisodes;
