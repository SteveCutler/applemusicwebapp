"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEpisodesByFeedId = exports.getSubs = exports.trackProgress = exports.fetchEpisodes = exports.removeSub = exports.subscribePodcast = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const podcastIndex_js_1 = require("../utils/podcastIndex.js");
const subscribePodcast = async (req, res) => {
    try {
        const { podcastIndexId } = req.body;
        const userId = req.user.id;
        console.log('podcastIndexId:', podcastIndexId); // Add this line
        console.log('userId:', userId); // Add this line
        const podcastData = await (0, podcastIndex_js_1.fetchPodcastDataFromIndex)(podcastIndexId);
        const podcast = await prisma.podcast.upsert({
            where: { podcastIndexId },
            update: {
                rssFeedUrl: podcastData.rssFeedUrl,
                title: podcastData.title,
                description: podcastData.description,
                artworkUrl: podcastData.artworkUrl,
                categories: podcastData.categories,
            },
            create: {
                podcastIndexId,
                rssFeedUrl: podcastData.rssFeedUrl,
                title: podcastData.title,
                description: podcastData.description,
                artworkUrl: podcastData.artworkUrl,
                categories: podcastData.categories,
            },
        });
        // for (const episode of podcastData.episodes) {
        //     await prisma.episode.upsert({
        //         where: { audioUrl: episode.audioUrl },
        //         update: episode,
        //         create: {
        //             ...episode,
        //             podcastId: podcast.id,
        //         },
        //     })
        // }
        const subscription = await prisma.subscription.create({
            data: {
                userId,
                podcastId: podcast.id,
            },
        });
        res.status(201).json(subscription);
    }
    catch (error) {
        console.error('Error subscribing to podcast:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.subscribePodcast = subscribePodcast;
const removeSub = async (req, res) => {
    try {
        const { podcastIndexId } = req.body;
        const userId = req.user.id;
        console.log('podcastIndexId:', podcastIndexId); // Add this line
        console.log('userId:', userId); // Add this line
        const podcast = await prisma.podcast.findUnique({
            where: { podcastIndexId },
        });
        if (!podcast) {
            return res.status(404).json({ error: 'Podcast not found' });
        }
        // Delete the subscription for the user and podcast
        const deletedSubscription = await prisma.subscription.deleteMany({
            where: {
                userId,
                podcastId: podcast.id,
            },
        });
        if (deletedSubscription.count === 0) {
            return res.status(404).json({ error: 'Subscription not found' });
        }
        res.status(200).json({ message: 'Subscription deleted successfully' });
    }
    catch (error) {
        console.error('Error removing subscription:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.removeSub = removeSub;
// Fetch episodes of a podcast
const fetchEpisodes = async (req, res) => {
    console.log('fetching episodes');
    try {
        const { podcastId } = req.params;
        const episodes = await prisma.episode.findMany({
            where: { podcastId },
        });
        res.status(200).json(episodes);
    }
    catch (error) {
        console.error('Error fetching episodes:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.fetchEpisodes = fetchEpisodes;
// export const fetchRecentEpisodes = async (req: Request, res: Response) => {
//     try {
//         const userId = req.user.id
//         const subscriptions = await prisma.subscription.findMany({
//             where: { userId },
//             include: {
//                 podcast: {
//                     include: {
//                         episodes: {
//                             orderBy: { releaseDate: 'desc' },
//                             take: 10, // Adjust the number of recent episodes to fetch
//                         },
//                     },
//                 },
//             },
//         })
//         const recentEpisodes = subscriptions.flatMap(
//             sub => sub.podcast.episodes
//         )
//         res.status(200).json(recentEpisodes)
//     } catch (error) {
//         console.error('Error fetching recent episodes:', error)
//         res.status(500).json({ error: 'Internal Server Error' })
//     }
// }
// Track listening progress
const trackProgress = async (req, res) => {
    try {
        const { episodeId, progress } = req.body;
        const userId = req.user.id;
        const listenedEpisode = await prisma.listenedEpisode.upsert({
            where: {
                userId_episodeId: {
                    userId,
                    episodeId,
                },
            },
            update: { progress },
            create: {
                userId,
                episodeId,
                progress,
            },
        });
        res.status(200).json(listenedEpisode);
    }
    catch (error) {
        console.error('Error tracking progress:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.trackProgress = trackProgress;
// Get subscribed podcast index IDs
const getSubs = async (req, res) => {
    try {
        const userId = req.user.id;
        const subscriptions = await prisma.subscription.findMany({
            where: { userId },
            include: {
                podcast: true,
            },
        });
        const subs = subscriptions.map(sub => ({
            title: sub.podcast.title,
            id: sub.podcast.podcastIndexId,
            image: sub.podcast.artworkUrl,
        }));
        res.status(200).json(subs);
    }
    catch (error) {
        console.error('Error fetching subscribed podcast IDs:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.getSubs = getSubs;
// Controller to get episodes by feed ID
const getEpisodesByFeedId = async (req, res) => {
    console.log('retrieving episode');
    const feedId = req.params.feedId;
    console.log('feedId', feedId);
    try {
        // const key = process.env.PODCASTINDEX_KEY
        // const secret = process.env.PODCASTINDEX_SECRET
        // if (!key || !secret) {
        //     console.error('Podcast Index API key or secret is not set')
        //     return
        // }
        // const headerTime = Math.floor(Date.now() / 1000)
        // const hashInput = key + secret + headerTime
        // const hash = crypto.createHash('sha1').update(hashInput).digest('hex')
        const podcastData = await (0, podcastIndex_js_1.fetchRecentEpisodes)(feedId);
        console.log(podcastData);
        res.status(200).json({
            message: 'latest podcast episodes',
            data: podcastData,
        });
    }
    catch (error) {
        console.error('Error fetching episodes:', error);
        res.status(500).json({ error: 'Failed to fetch episodes' });
    }
};
exports.getEpisodesByFeedId = getEpisodesByFeedId;
module.exports = {
    getEpisodesByFeedId: exports.getEpisodesByFeedId,
};
