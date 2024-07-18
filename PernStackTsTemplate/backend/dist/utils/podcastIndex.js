import axios from 'axios';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();
const apiKey = process.env.PODCASTINDEX_KEY;
const apiSecret = process.env.PODCASTINDEX_SECRET;
// console.log('apiKey', process.env.PODCASTINDEX_KEY)
// console.log('apiSecret', process.env.PODCASTINDEX_SECRET)
const generateAuthHeaders = () => {
    if (!apiKey || !apiSecret) {
        throw new Error('API key and secret must be defined in the environment variables.');
    }
    const apiHeaderTime = Math.floor(Date.now() / 1000);
    const hash = crypto
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
export const fetchPodcastDataFromIndex = async (podcastIndexId) => {
    try {
        const headers = generateAuthHeaders();
        console.log('headers:', headers);
        const response = await axios.get(`https://api.podcastindex.org/api/1.0/podcasts/byfeedid?id=${podcastIndexId}&pretty`, { headers });
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
export const fetchRecentEpisodes = async (feedId) => {
    try {
        const headers = generateAuthHeaders();
        const number = feedId.split(',').length;
        const response = await axios.get(`https://api.podcastindex.org/api/1.0/episodes/byfeedid?id=${feedId}`, {
            headers,
            params: {
                fulltext: true,
                max: 400,
            },
        });
        const podcasts = await response.data;
        return podcasts;
    }
    catch (error) {
        console.error('Error fetching podcast episodes from PodcastIndex:', error);
        throw new Error('Failed to fetch podcast episode data');
    }
};
export const searchPodcastIndex = async (term) => {
    try {
        const headers = generateAuthHeaders();
        const response = await axios.get(`https://api.podcastindex.org/api/1.0/search/byterm`, {
            headers,
            params: {
                q: term,
            },
        });
        const podcasts = await response.data;
        return podcasts;
    }
    catch (error) {
        console.error('Error fetching podcast episodes from PodcastIndex:', error);
        throw new Error('Failed to fetch podcast episode data');
    }
};
export const podcastEpisodeById = async (id) => {
    try {
        const headers = generateAuthHeaders();
        const response = await axios.get(`https://api.podcastindex.org/api/1.0/episodes/byid?id=${id}&pretty`, {
            headers,
        });
        const podcast = await response.data;
        return podcast;
    }
    catch (error) {
        console.error('Error fetching podcast episode from PodcastIndex:', error);
        throw new Error('Failed to fetch podcast episode episode data');
    }
};
export const podcastByFeedId = async (id) => {
    try {
        const headers = generateAuthHeaders();
        const response = await axios.get(`https://api.podcastindex.org/api/1.0/podcasts/byfeedid?id=${id}&pretty`, {
            headers,
        });
        const podcast = await response.data;
        return podcast;
    }
    catch (error) {
        console.error('Error fetching podcast from PodcastIndex:', error);
        throw new Error('Failed to fetch podcast data');
    }
};
export const podcastByFeedUrl = async (feedUrl) => {
    try {
        const headers = generateAuthHeaders();
        const response = await axios.get(`https://api.podcastindex.org/api/1.0/podcasts/byfeedurl?url=${encodeURIComponent(feedUrl)}`, {
            headers,
        });
        const podcastData = await response.data;
        const podcast = podcastData.feed;
        // Check if podcast.id is undefined
        if (!podcast.id) {
            console.error('Podcast ID is undefined');
            return null; // or throw new Error('Podcast ID is undefined')
        }
        return {
            podcastIndexId: String(podcast.id),
            rssFeedUrl: podcast.url,
            title: podcast.title,
            description: podcast.description,
            artworkUrl: podcast.image,
            categories: podcast.categories || [],
        };
    }
    catch (error) {
        console.error('Error fetching podcast from PodcastIndex:', error);
        throw new Error('Failed to fetch podcast data');
    }
};
