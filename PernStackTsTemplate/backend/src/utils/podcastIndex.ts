import axios from 'axios'
import crypto from 'crypto'
import dotenv from 'dotenv'

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
interface podcastInfo {
    artwork: string
    author: string
    categories: {
        [key: number]: string
    }
    contentType: string
    crawlErrors: number
    dead: number
    description: string
    episodeCount: number
    explicit: boolean
    generator: string
    id: number
    image: string
    imageUrlHash: number
    inPollingQueue: number
    itunesId: number
    language: string
    lastCrawlTime: number
    lastGoodHttpStatusTime: number
    lastHttpStatus: number
    lastParseTime: number
    lastUpdateTime: number
    link: string
    locked: number
    medium: string
    newestItemPubdate: number
    originalUrl: string
    ownerName: string
    parseErrors: number
    podcastGuid: string
    priority: number
    title: string
    type: number
    url: string
}

dotenv.config()

const apiKey = process.env.PODCASTINDEX_KEY as string
const apiSecret = process.env.PODCASTINDEX_SECRET as string
console.log('apiKey', process.env.PODCASTINDEX_KEY)
console.log('apiSecret', process.env.PODCASTINDEX_SECRET)

const generateAuthHeaders = () => {
    if (!apiKey || !apiSecret) {
        throw new Error(
            'API key and secret must be defined in the environment variables.'
        )
    }

    const apiHeaderTime = Math.floor(Date.now() / 1000)

    const hash = crypto
        .createHash('sha1')
        .update(apiKey + apiSecret + apiHeaderTime)
        .digest('hex')

    return {
        'User-Agent': 'MusAppleMusicDashboard/1.0',
        'X-Auth-Key': apiKey,
        'X-Auth-Date': apiHeaderTime,
        Authorization: hash,
    }
}

export const fetchPodcastDataFromIndex = async (podcastIndexId: string) => {
    try {
        const headers = generateAuthHeaders()
        console.log('headers:', headers)

        const response = await axios.get(
            `https://api.podcastindex.org/api/1.0/podcasts/byfeedid?id=${podcastIndexId}&pretty`,
            { headers }
        )

        // const episodeResponse = await axios.get(
        //     `https://api.podcastindex.org/api/1.0/episodes/byfeedid?id=${podcastIndexId}&pretty`,
        //     { headers }
        // )

        const podcast: podcastInfo = await response.data.feed
        console.log('podcast: ', podcast)
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
        }
    } catch (error) {
        console.error('Error fetching podcast data from PodcastIndex:', error)
        throw new Error('Failed to fetch podcast data')
    }
}
export const fetchRecentEpisodes = async (feedId: string) => {
    try {
        const headers = generateAuthHeaders()
        console.log('headers:', headers)

        const response = await axios.get(
            `https://api.podcastindex.org/api/1.0/episodes/byfeedid?id=${feedId}`,
            {
                headers,
                params: {
                    fulltext: true,
                },
            }
        )

        // const episodeResponse = await axios.get(
        //     `https://api.podcastindex.org/api/1.0/episodes/byfeedid?id=${podcastIndexId}&pretty`,
        //     { headers }
        // )

        const podcasts: podcastInfo[] = await response.data.feed
        console.log('podcast: ', podcasts)
        // const podcastEpisodes: podcastEpisode[] =
        //     await episodeResponse.data.items
        // console.log('podcast episodes: ', podcastEpisodes)

        return {
            podcasts,
        }
    } catch (error) {
        console.error(
            'Error fetching podcast episodes from PodcastIndex:',
            error
        )
        throw new Error('Failed to fetch podcast episode data')
    }
}
