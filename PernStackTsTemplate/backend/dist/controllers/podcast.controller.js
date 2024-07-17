import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { fetchPodcastDataFromIndex, fetchRecentEpisodes, searchPodcastIndex, podcastEpisodeById, podcastByFeedId, podcastByFeedUrl, } from '../utils/podcastIndex.js';
export const subscribePodcast = async (req, res) => {
    try {
        const { podcastIndexId } = req.body;
        const userId = req.user.id;
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
export const addImportedPodcastSubs = async (podcasts, userId) => {
    try {
        const upsertPodcastPromises = podcasts.map(async (podcast) => {
            const podcastData = await prisma.podcast.upsert({
                where: { podcastIndexId: podcast.podcastIndexId },
                update: {
                    rssFeedUrl: podcast.rssFeedUrl,
                    title: podcast.title,
                    description: podcast.description,
                    artworkUrl: podcast.artworkUrl,
                    categories: podcast.categories,
                },
                create: {
                    podcastIndexId: podcast.podcastIndexId,
                    rssFeedUrl: podcast.rssFeedUrl,
                    title: podcast.title,
                    description: podcast.description,
                    artworkUrl: podcast.artworkUrl,
                    categories: podcast.categories,
                },
            });
            // Check if the subscription exists
            const subscriptionExists = await prisma.subscription.findUnique({
                where: {
                    userId_podcastId: {
                        userId,
                        podcastId: podcastData.id,
                    },
                },
            });
            // Create subscription if it doesn't exist
            if (!subscriptionExists) {
                await prisma.subscription.create({
                    data: {
                        userId,
                        podcastId: podcastData.id,
                    },
                });
            }
            return podcastData;
        });
        const podcastsData = await Promise.all(upsertPodcastPromises);
        return podcastsData;
    }
    catch (error) {
        console.error('Error subscribing to podcasts:', error);
        throw new Error('Failed to subscribe to podcasts');
    }
};
export const removeSub = async (req, res) => {
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
// Fetch episodes of a podcast
export const fetchEpisodes = async (req, res) => {
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
export const trackProgress = async (req, res) => {
    try {
        const { episodeId, progress, userId } = req.body;
        console.log('episodeId', episodeId, 'progress', progress, 'userId', userId);
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
export const retrieveProgress = async (req, res) => {
    try {
        const { userId } = req.body;
        const listenedEpisodes = await prisma.listenedEpisode.findMany({
            where: {
                userId,
            },
            select: {
                episodeId: true,
                progress: true,
                completed: true,
            },
        });
        res.status(200).json(listenedEpisodes);
    }
    catch (error) {
        console.error('Error retrieving progress:', error);
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
            artwork: sub.podcast.artworkUrl,
        }));
        res.status(200).json(subs);
    }
    catch (error) {
        console.error('Error fetching subscribed podcast IDs:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
// Controller to get episodes by feed ID
export const getRecentEpisodes = async (req, res) => {
    const feedId = req.params.feedId;
    console.log('feedId', feedId);
    try {
        const podcastData = await fetchRecentEpisodes(feedId);
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
export const search = async (req, res) => {
    const { term } = req.body;
    console.log('search term', term);
    try {
        const podcastData = await searchPodcastIndex(term);
        res.status(200).json({
            data: podcastData,
        });
    }
    catch (error) {
        console.error('Error fetching episodes:', error);
        res.status(500).json({ error: 'Failed to fetch episodes' });
    }
};
export const getEpisodeById = async (req, res) => {
    const id = req.params.id;
    console.log('pocast episode id', id);
    try {
        const podcastData = await podcastEpisodeById(id);
        res.status(200).json({
            data: podcastData,
        });
    }
    catch (error) {
        console.error('Error fetching episodes:', error);
        res.status(500).json({ error: 'Failed to fetch episodes' });
    }
};
export const getPodcastById = async (req, res) => {
    const feedId = req.params.feedId;
    console.log('pocast episode id', feedId);
    try {
        const podcastData = await podcastByFeedId(feedId);
        res.status(200).json({
            data: podcastData,
        });
    }
    catch (error) {
        console.error('Error fetching episodes:', error);
        res.status(500).json({ error: 'Failed to fetch episodes' });
    }
};
export const getPodcastByUrl = async (req, res) => {
    const { urls, userId } = req.body;
    console.log('urls', urls, 'userId', userId);
    try {
        const podcastPromises = urls.map(async (url) => {
            try {
                const podcastData = await podcastByFeedUrl(url);
                return {
                    success: true,
                    data: podcastData,
                };
            }
            catch (error) {
                console.error('Error fetching episodes:', error);
                return {
                    success: false,
                    error: `Failed to fetch podcast data for URL: ${url}`,
                };
            }
        });
        const podcastResults = await Promise.all(podcastPromises);
        const successfulPodcasts = podcastResults
            .filter(result => result.success)
            .map(result => result.data);
        const failedPodcasts = podcastResults
            .filter(result => !result.success)
            .map(result => result.error);
        const validPodcasts = successfulPodcasts.filter(podcast => podcast !== null);
        console.log('retrieved podcasts', successfulPodcasts);
        await addImportedPodcastSubs(validPodcasts, userId);
        res.status(200).json({
            success: true,
            data: successfulPodcasts,
            errors: failedPodcasts,
        });
    }
    catch (error) {
        console.error('Error fetching podcasts:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch podcasts',
        });
    }
};
