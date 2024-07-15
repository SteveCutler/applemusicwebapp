import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import {
    fetchPodcastDataFromIndex,
    fetchRecentEpisodes,
    searchPodcastIndex,
    podcastEpisodeById,
    podcastByFeedId,
} from '../utils/podcastIndex.js'
import crypto from 'crypto'
import axios from 'axios'

// Subscribe to a podcast

interface podcastEpisode {
    dateCrawled: number
    datePublished: number
    datePublishedPretty: string
    description: string
    duration: number
    enclosureLength: number
    enclosureType: string
    enclosureUrl: string
    episodeType: string
    explicit: number
    feedDead: number
    feedDuplicateOf: number
    feedId: number
    feedImage: string
    feedItunesId: number
    feedLanguage: string
    feedUrl: string
    guid: string
    id: number
    image: string
    link: string
    podcastGuid: string
    season: number
    title: string
}

export const subscribePodcast = async (req: Request, res: Response) => {
    try {
        const { podcastIndexId } = req.body
        const userId = req.user.id

        console.log('podcastIndexId:', podcastIndexId) // Add this line
        console.log('userId:', userId) // Add this line

        const podcastData = await fetchPodcastDataFromIndex(podcastIndexId)

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
        })

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
        })

        res.status(201).json(subscription)
    } catch (error) {
        console.error('Error subscribing to podcast:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}
export const removeSub = async (req: Request, res: Response) => {
    try {
        const { podcastIndexId } = req.body
        const userId = req.user.id

        console.log('podcastIndexId:', podcastIndexId) // Add this line
        console.log('userId:', userId) // Add this line

        const podcast = await prisma.podcast.findUnique({
            where: { podcastIndexId },
        })

        if (!podcast) {
            return res.status(404).json({ error: 'Podcast not found' })
        }

        // Delete the subscription for the user and podcast
        const deletedSubscription = await prisma.subscription.deleteMany({
            where: {
                userId,
                podcastId: podcast.id,
            },
        })

        if (deletedSubscription.count === 0) {
            return res.status(404).json({ error: 'Subscription not found' })
        }

        res.status(200).json({ message: 'Subscription deleted successfully' })
    } catch (error) {
        console.error('Error removing subscription:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

// Fetch episodes of a podcast
export const fetchEpisodes = async (req: Request, res: Response) => {
    console.log('fetching episodes')
    try {
        const { podcastId } = req.params
        const episodes = await prisma.episode.findMany({
            where: { podcastId },
        })

        res.status(200).json(episodes)
    } catch (error) {
        console.error('Error fetching episodes:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

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
export const trackProgress = async (req: Request, res: Response) => {
    try {
        const { episodeId, progress } = req.body
        const userId = req.user.id

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
        })

        res.status(200).json(listenedEpisode)
    } catch (error) {
        console.error('Error tracking progress:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

// Get subscribed podcast index IDs
export const getSubs = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id

        const subscriptions = await prisma.subscription.findMany({
            where: { userId },
            include: {
                podcast: true,
            },
        })

        const subs = subscriptions.map(sub => ({
            title: sub.podcast.title,
            id: sub.podcast.podcastIndexId,
            artwork: sub.podcast.artworkUrl,
        }))

        res.status(200).json(subs)
    } catch (error) {
        console.error('Error fetching subscribed podcast IDs:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

// Controller to get episodes by feed ID
export const getRecentEpisodes = async (req: Request, res: Response) => {
    const feedId = req.params.feedId
    console.log('feedId', feedId)
    try {
        const podcastData = await fetchRecentEpisodes(feedId)

        res.status(200).json({
            message: 'latest podcast episodes',
            data: podcastData,
        })
    } catch (error) {
        console.error('Error fetching episodes:', error)
        res.status(500).json({ error: 'Failed to fetch episodes' })
    }
}
export const search = async (req: Request, res: Response) => {
    const { term } = req.body
    console.log('search term', term)
    try {
        const podcastData = await searchPodcastIndex(term)

        res.status(200).json({
            data: podcastData,
        })
    } catch (error) {
        console.error('Error fetching episodes:', error)
        res.status(500).json({ error: 'Failed to fetch episodes' })
    }
}
export const getEpisodeById = async (req: Request, res: Response) => {
    const id = req.params.id
    console.log('pocast episode id', id)
    try {
        const podcastData = await podcastEpisodeById(id)

        res.status(200).json({
            data: podcastData,
        })
    } catch (error) {
        console.error('Error fetching episodes:', error)
        res.status(500).json({ error: 'Failed to fetch episodes' })
    }
}
export const getPodcastById = async (req: Request, res: Response) => {
    const feedId = req.params.feedId
    console.log('pocast episode id', feedId)
    try {
        const podcastData = await podcastByFeedId(feedId)

        res.status(200).json({
            data: podcastData,
        })
    } catch (error) {
        console.error('Error fetching episodes:', error)
        res.status(500).json({ error: 'Failed to fetch episodes' })
    }
}
