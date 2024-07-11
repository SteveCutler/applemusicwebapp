import { useState, useEffect } from 'react'
import useMusicKit from './LoadMusickit'
// import { useMusickitContext } from '../../context/MusickitContext'
import AlbumItem from '../Homepage/AlbumItem'
import DisplayRow from '../Homepage/DisplayRow'
import fetchHeavyRotation from './FetchHeavyRotation'
import FetchRecentlyPlayed from './FetchRecentlyPlayed'
import FetchRecommendations from './FetchRecommendations'
import { useStore } from '../../store/store'
import FetchRecentlyAddedToLib from './FetchRecentlyAddedToLib'
import { FaCaretDown, FaCaretUp } from 'react-icons/fa'
import PlaylistItem from '../Homepage/PlaylistItem'
import StationItem from '../Homepage/StationItem'
import SongItem from '../Homepage/SongItem'
import ArtistItem from '../Homepage/ArtistItem'
import { useMediaQuery } from 'react-responsive'
import RecommendationDisplay from './RecommendationDisplay'
import FetchHeavyRotation from './FetchHeavyRotation'
import DropdownDisplay from './DropdownDisplay'
import axios from 'axios'
import toast from 'react-hot-toast'
import CryptoJS from 'crypto-js'

type AlbumType = {
    attributes: {
        artistName: string
        artwork?: {
            height: number
            width: number
            url: string
        }
        dateAdded: string
        genreNames: Array<string>
        name: string
        releasedDate: string
        trackCount: number
    }
    id: string
    type: string
}

type playlist = {
    attributes: {
        artwork?: {
            bgColor: string
            url: string
        }
        description?: string
        curatorName?: string
        canEdit: boolean
        playlistType?: string
        dataAdded: string
        isPublic: boolean
        lastModifiedDate: string
        name: string
    }
    href: string
    id: string
    type: string
}

interface RecommendationType {
    attributes: {
        title: {
            stringForDisplay: string
            contentIds?: string[]
        }
    }
    relationships: {
        contents: {
            data: Array<playlist | AlbumType | StationType>
        }
    }
}

interface StationType {
    attributes: {
        artwork: {
            bgColor: string
            url: string
        }
        mediaKind: string
        name: string
        url: string
        playParams: {
            format: string
            id: string
            kind: string
            stationHash: string
        }
    }
    id: String
    type: string
}

type AttributeObject = {
    artistName: String
    artwork: ArtworkObject
    dateAdded: String
    genreNames: Array<String>
    name: String
    releasedDate: String
    trackCount: Number
}

type ArtworkObject = {
    height: Number
    width: Number
    url: String
}

type podcastInfo = {
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
    released?: string
    timeSinceRelease?: number
    showTitle?: string
}

const AppleDashboard = () => {
    const {
        musicKitInstance,
        authorizeMusicKit,
        darkMode,
        queueToggle,
        heavyRotation,
        themedRecommendations,
        setHeavyRotation,
        recommendations,
        recentlyPlayedAlbums,
        personalizedPlaylists,
        recentlyPlayed,
        podSubs,
        setPodSubs,
        recentEps,
        setRecentEps,
        recentlyAddedToLib,
        backendToken,

        moreLikeRecommendations,
        appleMusicToken,
        stationsForYou,
    } = useStore(state => ({
        podSubs: state.podSubs,
        setPodSubs: state.setPodSubs,
        setRecentEps: state.setRecentEps,
        queueToggle: state.queueToggle,
        musicKitInstance: state.musicKitInstance,
        recentEps: state.recentEps,
        backendToken: state.backendToken,
        appleMusicToken: state.appleMusicToken,
        recentlyAddedToLib: state.recentlyAddedToLib,
        darkMode: state.darkMode,
        moreLikeRecommendations: state.moreLikeRecommendations,
        themedRecommendations: state.themedRecommendations,
        personalizedPlaylists: state.personalizedPlaylists,
        recommendations: state.recommendations,
        authorizeMusicKit: state.authorizeMusicKit,
        heavyRotation: state.heavyRotation,
        recentlyPlayedAlbums: state.recentlyPlayedAlbums,
        setHeavyRotation: state.setHeavyRotation,
        recentlyPlayed: state.recentlyPlayed,
        stationsForYou: state.stationsForYou,
    }))

    const [moreAddedToLib, setMoreAddedToLib] = useState(false)
    const [moreRecentlyPlayed, setMoreRecentlyPlayed] = useState(false)
    const [moreMoreLike, setMoreMoreLike] = useState(false)
    const [moreStations, setMoreStations] = useState(false)
    const [moreThemed, setMoreThemed] = useState(false)
    const [moreHeavyRotation, setMoreHeavyRotation] = useState(false)
    const [moreMadeForYou, setMoreMadeForYou] = useState(false)

    const style = { fontSize: '1.5rem' }

    const constructImageUrl = (url: String, size: Number) => {
        return url
            .replace('{w}', size.toString())
            .replace('{h}', size.toString())
    }
    const [moreLikeAlbumImage, setMoreLikeAlbumImage] = useState<string | null>(
        null
    )
    // const [heavyRotation, setHeavyRotation] = useState<Array<AlbumType> | null>(
    //     null
    // )
    // console.log('more like recommendations: ', moreLikeRecommendations)

    const shuffle = (array: Array<RecommendationType>) => {
        console.log('array', array)
        const newArray = array.sort(() => Math.random() - 0.5)
        return newArray
    }
    // if (recommendations) {
    //     console.log('shuffled', shuffle(recommendations))
    // }

    function isWithinLastWeek(datePublished: number) {
        const currentTime = Math.floor(Date.now() / 1000) // Current time in Unix timestamp

        return currentTime - datePublished
    }

    const isMedium = useMediaQuery({ query: '(min-width: 768px)' })
    const isLarge = useMediaQuery({ query: '(min-width: 1024px)' })
    const isXLarge = useMediaQuery({ query: '(min-width: 1280px)' })
    const is2XLarge = useMediaQuery({ query: '(min-width: 1536px)' })

    let sliceNumber

    if (is2XLarge) {
        sliceNumber = queueToggle ? 9 : 11 // For 2xl screens and larger
    } else if (isXLarge) {
        sliceNumber = queueToggle ? 3 : 5 // For 2xl screens and larger
    } else if (isLarge) {
        sliceNumber = 3 // For xl screens and larger
    } else if (isMedium) {
        sliceNumber = 4 // For md screens and larger
    } else {
        sliceNumber = 2 // For small screens
    }

    function getTimeDifference(datePublished: number) {
        const currentTime = Math.floor(Date.now() / 1000) // Current time in Unix timestamp
        const timeDifference = currentTime - datePublished

        // Convert difference to human-readable format
        const hours = Math.floor(timeDifference / 3600)
        const days = Math.floor(timeDifference / 86400)

        if (days > 0) {
            return `${days}d`
        } else if (hours > 0) {
            return `${hours}h`
        } else {
            return '<1h>'
        }
    }

    const fetchMostRecentEp = async (id: string, title: string) => {
        try {
            const headerTime = Math.floor(Date.now() / 1000)
            const key = import.meta.env.VITE_PODCASTINDEX_KEY
            const secret = import.meta.env.VITE_PODCASTINDEX_SECRET

            // Ensure concatenation is correct
            const hashInput = key + secret + headerTime
            const hash = CryptoJS.SHA1(hashInput).toString(CryptoJS.enc.Hex)

            const episodesResponse = await axios.get(
                `https://api.podcastindex.org/api/1.0/episodes/byfeedid?id=${id}&pretty`,
                {
                    headers: {
                        'User-Agent': 'AppleMusicDashboard/1.0',
                        'X-Auth-Key': key,
                        'X-Auth-Date': headerTime,
                        Authorization: hash,
                    },
                    params: {
                        fulltext: true,
                        max: 10,
                    },
                }
            )
            console.log('api test', episodesResponse)
            const episode: podcastEpisode = episodesResponse.data.items[0]

            const time = isWithinLastWeek(episode.datePublished)
            const oneWeekInSeconds = 604800
            if (time < oneWeekInSeconds) {
                const newEpisode = {
                    ...episode,
                    released: getTimeDifference(episode.datePublished),
                    timeSinceRelease: time,
                    showTitle: title,
                }
                return newEpisode
            } else {
                return null
            }

            // return episodes[0]
        } catch (error: any) {
            console.error('podcast fetch error', error)
        }
    }

    useEffect(() => {
        const getRecentEps = async () => {
            if (podSubs) {
                let eps = await Promise.all(
                    podSubs.map(pod => fetchMostRecentEp(pod.id, pod.title))
                )
                const recentEps = eps.filter(
                    ep => ep !== null && ep !== undefined
                )
                const sortedEps: podcastEpisode[] = recentEps.sort(
                    (a, b) => a.timeSinceRelease - b.timeSinceRelease
                )
                console.log('sorted eps', sortedEps)
                // Filter out null values

                setRecentEps(sortedEps)
            }
        }

        const getSubs = async () => {
            const userId = backendToken
            try {
                const response = await fetch(
                    'http://localhost:5000/api/podcast/get-subs',

                    {
                        method: 'POST',
                        headers: {
                            'Content-type': 'application/json',
                        },
                        body: JSON.stringify({
                            userId,
                        }),
                        credentials: 'include',
                    }
                )

                const data = await response.json()

                setPodSubs(data)
            } catch (error) {
                console.error('Error subscribing to podcast:', error)

                toast.error('Error retrieving podcasts..')
            }
        }
        // if (!podSubs) {
        //     getSubs()
        // }
        // if (!recentEps && podSubs) {
        //     getRecentEps()
        // }

        if (!musicKitInstance) {
            authorizeMusicKit()
        }
    }, [podSubs, musicKitInstance])

    // console.log('recommendations: ', recommendations)

    // const { recommendations } = FetchRecommendations()

    return (
        <div
            className={`h-100vh flex-col flex-grow ${darkMode ? 'text-slate-200' : 'text-slate-800'}  relative z-10 flex justify-center `}
        >
            {recentEps && (
                <DropdownDisplay
                    podcast={true}
                    object={recentEps}
                    sliceNumber={sliceNumber}
                />
            )}
            {recommendations &&
                recommendations.map((reco, index) => (
                    <RecommendationDisplay
                        key={index}
                        reco={reco}
                        sliceNumber={sliceNumber}
                    />
                ))}
        </div>
    )
}

export default AppleDashboard
