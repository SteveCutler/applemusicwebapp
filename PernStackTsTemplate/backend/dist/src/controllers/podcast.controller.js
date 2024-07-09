import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { fetchPodcastDataFromIndex } from '../utils/podcastIndex.js';
export const subscribePodcast = async (req, res) => {
    try {
        const { podcastIndexId } = req.body;
        const userId = req.user.id;
        console.log('podcastIndexId:', podcastIndexId); // Add this line
        console.log('userId:', userId); // Add this line
        const podcastData = await fetchPodcastDataFromIndex(podcastIndexId);
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
// Fetch episodes of a podcast
export const fetchEpisodes = async (req, res) => {
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
export const fetchRecentEpisodes = async (req, res) => {
    try {
        const userId = req.user.id;
        const subscriptions = await prisma.subscription.findMany({
            where: { userId },
            include: {
                podcast: {
                    include: {
                        episodes: {
                            orderBy: { releaseDate: 'desc' },
                            take: 10, // Adjust the number of recent episodes to fetch
                        },
                    },
                },
            },
        });
        const recentEpisodes = subscriptions.flatMap(sub => sub.podcast.episodes);
        res.status(200).json(recentEpisodes);
    }
    catch (error) {
        console.error('Error fetching recent episodes:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
// Track listening progress
export const trackProgress = async (req, res) => {
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
// Get subscribed podcast index IDs
export const getSubs = async (req, res) => {
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
