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
import GradientAnimation from '../Homepage/GradientAnimation'
import SkeletonDropdownDisplay from './SkeletonDropdownDisplay'
import SkeletonItem from '../Homepage/SkeletonItem'
import RecentlyAddedToLib from './RecentlyAddedToLib'

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

type RecentlyAddedItem = AlbumType | playlist | StationType | Song

interface Song {
    id: string
    href?: string
    type: string
    attributes: {
        id?: string
        name: string
        trackNumber: number
        artistName: string
        albumName: string
        durationInMillis: number
        playParams: {
            catalogId: string
        }
        artwork?: {
            bgColor: string
            url: string
        }
    }
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
interface Album {
    id: string
    albumId: string
    name: string
    artistName: string
    artworkUrl: string
    trackCount: number
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
        setPersonalizedPlaylists,
        recentlyAddedToLib,
        backendToken,
        setRecommendations,
        moreLikeRecommendations,
        appleMusicToken,
        progressLoaded,
        podcastProgress,
        fetchPodcastProgress,
        stationsForYou,
        setRecentlyAddedToLib,
        isAuthorized,
    } = useStore(state => ({
        progressLoaded: state.progressLoaded,
        isAuthorized: state.isAuthorized,
        setRecentlyAddedToLib: state.setRecentlyAddedToLib,
        recentlyAddedToLib: state.recentlyAddedToLib,
        podcastProgress: state.podcastProgress,
        fetchPodcastProgress: state.fetchPodcastProgress,
        podSubs: state.podSubs,
        setPersonalizedPlaylists: state.setPersonalizedPlaylists,
        setPodSubs: state.setPodSubs,
        setRecentEps: state.setRecentEps,
        setRecommendations: state.setRecommendations,
        queueToggle: state.queueToggle,
        musicKitInstance: state.musicKitInstance,
        recentEps: state.recentEps,
        backendToken: state.backendToken,
        appleMusicToken: state.appleMusicToken,

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
    const [loadingPodcasts, setLoadingPodcasts] = useState(true)
    const [loadingRecent, setLoadingRecent] = useState(true)
    const [loadingRecentEps, setLoadingRecentEps] = useState(true)
    const [loadingProgress, setLoadingProgress] = useState(true)
    const [loadingRecommendations, setLoadingRecommendations] = useState(true)

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
            return '< 1h'
        }
    }

    // useEffect(() => {
    //     const recent: RecentlyAddedItem[] = []

    //     const fetchRecentlyAddedToLib = async (url: string) => {
    //         if (musicKitInstance) {
    //             try {
    //                 // console.log(music)

    //                 const queryParameters = {
    //                     l: 'en-us',
    //                     limit: 10,
    //                     headers: {
    //                         Authorization: `Bearer ${import.meta.env.VITE_MUSICKIT_DEVELOPER_TOKEN}`,
    //                         'Music-User-Token': appleMusicToken,
    //                     },
    //                 }
    //                 const res = await musicKitInstance.api.music(
    //                     url,
    //                     queryParameters
    //                 )

    //                 // if (res.status !== 200) {

    //                 // }

    //                 const data: RecentlyAddedItem[] = await res.data.data
    //                 recent.push(...data)
    //                 // console.log('recent', recent)

    //                 if (res.data.next && recent.length <= 20) {
    //                     await fetchRecentlyAddedToLib(res.data.next)
    //                 } else {
    //                     setRecentlyAddedToLib(recent)
    //                     setLoadingRecent(false)
    //                 }
    //             } catch (error: any) {
    //                 console.error(error)
    //                 setLoadingRecent(false)
    //             }
    //         }
    //     }

    //     if (!musicKitInstance || !appleMusicToken) {
    //         authorizeMusicKit()
    //     }
    //     if (musicKitInstance && appleMusicToken && !recentlyAddedToLib) {
    //         fetchRecentlyAddedToLib('/v1/me/library/recently-added')
    //     } else {
    //         setLoadingRecent(false)
    //     }
    // }, [musicKitInstance, appleMusicToken, isAuthorized, recentlyAddedToLib, ,])

    useEffect(() => {
        const fetchRecommendations = async () => {
            if (musicKitInstance) {
                try {
                    const queryParameters = {
                        l: 'en-us',
                        limit: 20,
                    }
                    const res = await musicKitInstance.api.music(
                        '/v1/me/recommendations/',
                        queryParameters
                    )

                    const data = await res.data.data
                    // console.log('loading recommendations: ', data)

                    setPersonalizedPlaylists(data[0])

                    const newList = [
                        data[1],
                        data[6],
                        data[0],
                        data[11],
                        data[10],
                        data[12],
                        data[8],
                        data[9],
                        data[7],
                        data[2],
                        data[4],
                        data[5],
                        data[13],

                        data[3],
                    ]

                    setRecommendations(newList)
                    setLoadingRecommendations(false)
                } catch (error: any) {
                    console.error(error)
                    setLoadingRecommendations(false)
                    // setError(error)
                }
            }
        }

        if (!recommendations && musicKitInstance && appleMusicToken) {
            fetchRecommendations()
        } else {
            setLoadingRecommendations(false)
        }
    }, [musicKitInstance, appleMusicToken, isAuthorized, recommendations])

    useEffect(() => {
        const getRecentEps = async () => {
            if (podSubs) {
                const ids = podSubs.map(pod => pod.id).join()
                // console.log('ids', ids)
                // const id = podSubs[0].id.toString()
                // console.log('id', id.toString())

                try {
                    const response = await fetch(
                        `https://mus-backend-b262ef3b1b65.herokuapp.com/api/podcast/get-episodes/${ids}`,
                        {
                            method: 'POST',
                            headers: {
                                'Content-type': 'application/json',
                            },

                            credentials: 'include',
                        }
                    )

                    let eps = await response.json()
                    const epsData = eps.data.items
                    const filteredEps: podcastEpisode[] = []
                    const feedIdSet: Set<string> = new Set()

                    epsData.forEach(ep => {
                        if (!feedIdSet.has(ep.feedId)) {
                            feedIdSet.add(ep.feedId)
                            filteredEps.push(ep)
                        }
                    })

                    // console.log('eps data', filteredEps)
                    const recent = filteredEps
                        .map((ep: podcastEpisode) => {
                            const oneWeekInSeconds = 604800
                            const currentTime = Math.floor(Date.now() / 1000)
                            const timeDifference =
                                currentTime - ep.datePublished

                            if (timeDifference < oneWeekInSeconds) {
                                return {
                                    ...ep,
                                    released: getTimeDifference(
                                        ep.datePublished
                                    ),
                                    timeSinceRelease: timeDifference,
                                }
                            }
                            return null
                        })
                        .filter(ep => ep !== null)

                    const sortedEps: podcastEpisode[] = recent.sort(
                        (a, b) => a.timeSinceRelease - b.timeSinceRelease
                    )
                    // console.log('sorted eps', sortedEps)
                    // Filter out null values
                    // console.log('sorted', sortedEps)

                    setRecentEps(sortedEps)
                    setLoadingRecentEps(false)
                } catch (error) {
                    console.error(error)
                    setLoadingPodcasts(false)
                }
            }
        }

        const getSubs = async () => {
            const userId = backendToken
            try {
                const response = await fetch(
                    'https://mus-backend-b262ef3b1b65.herokuapp.com/api/podcast/get-subs',

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
                // setLoadingPodcasts(false)
            } catch (error) {
                console.error('Error subscribing to podcast:', error)
                setLoadingPodcasts(false)
                toast.error('Error retrieving podcasts..')
            }
        }

        if (!podSubs) {
            getSubs()
        } else {
            // setLoadingPodcasts(false)
        }

        if (!recentEps && podSubs) {
            getRecentEps()
        } else {
            setLoadingRecentEps(false)
        }

        if (!podcastProgress && !podSubs) {
            fetchPodcastProgress()
        } else {
            setLoadingProgress(false)
        }

        if (podcastProgress && podSubs && recentEps) {
            setLoadingPodcasts(false)
        }
    }, [podcastProgress, podSubs, recentEps])

    // console.log('recently added to lib: ', recentlyAddedToLib)

    // const { recommendations } = recently()

    return (
        <div
            className={`h-100vh flex-col flex-grow ${darkMode ? 'text-slate-200' : 'text-slate-800'}  relative z-10 flex justify-center `}
        >
            {/* {loadingPodcasts && (
                <DropdownDisplay
                    
                    podcast={true}
                    object={recentEps}
                    sliceNumber={sliceNumber}
                />
            )} */}
            {/* <SkeletonDropdownDisplay sliceNumber={sliceNumber} /> */}

            {/* {loadingRecent ? (
                <SkeletonDropdownDisplay sliceNumber={sliceNumber} />
            ) : (
                !loadingRecent &&
                recentlyAddedToLib.length >= 1 && (
                    <DropdownDisplay
                        object={recentlyAddedToLib.slice(0, 15)}
                        sliceNumber={sliceNumber}
                        noTitle={true}
                        title={'Recently Added to Library'}
                    />
                )
            )} */}
            <RecentlyAddedToLib />
            {loadingPodcasts ? (
                <SkeletonDropdownDisplay sliceNumber={sliceNumber} />
            ) : !loadingPodcasts && recentEps && podSubs ? (
                <DropdownDisplay
                    podcast={true}
                    object={recentEps}
                    sliceNumber={sliceNumber}
                />
            ) : (
                !loadingPodcasts && (!recentEps || !podSubs) && null
            )}

            {loadingRecommendations ? (
                <div className=" flex w-full flex-wrap px-2 justify-center gap-y-10 mx-auto gap-1">
                    {Array.from({ length: sliceNumber * 2 }).map((_, index) => (
                        <SkeletonItem
                            key={index}
                            width={` ${
                                queueToggle
                                    ? 'w-full md:w-5/12 lg:w-3/12 xl:w-3/12'
                                    : 'w-full md:w-5/12 lg:w-3/12 xl:w-2/12 2xl:w-2/12'
                            } `}
                        />
                    ))}
                </div>
            ) : // <SkeletonDropdownDisplay sliceNumber={sliceNumber} />
            recommendations ? (
                recommendations.map((reco, index) => (
                    <RecommendationDisplay
                        key={index}
                        reco={reco}
                        sliceNumber={sliceNumber}
                    />
                ))
            ) : null}
        </div>
    )
}

export default AppleDashboard
