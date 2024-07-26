import React, { useEffect, useState } from 'react'
import { useStore } from '../store/store'
import toast from 'react-hot-toast'
import PodcastItem from '../components/Homepage/PodcastItem'
import axios from 'axios'
import CryptoJS from 'crypto-js'
import PodcastEpisode from './PodcastEpisode'
import PodcastEpisodeItem from '../components/Homepage/PodcastEpisodeItem'
import DropdownDisplay from '../components/Apple/DropdownDisplay'
import { useMediaQuery } from 'react-responsive'
import ImportPodcasts from '../components/Homepage/ImportPodcasts'
import SkeletonDropdownDisplay from '../components/Apple/SkeletonDropdownDisplay'
import { FaArrowAltCircleRight } from 'react-icons/fa'

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

const Podcasts = () => {
    const {
        darkMode,
        backendToken,
        podSubs,
        recentEps,
        setRecentEps,
        queueToggle,
        setPodSubs,
        progressLoaded,
        fetchPodcastProgress,
    } = useStore(state => ({
        darkMode: state.darkMode,
        progressLoaded: state.progressLoaded,
        fetchPodcastProgress: state.fetchPodcastProgress,
        recentEps: state.recentEps,
        setRecentEps: state.setRecentEps,
        queueToggle: state.queueToggle,
        podSubs: state.podSubs,
        setPodSubs: state.setPodSubs,
        backendToken: state.backendToken,
    }))

    const [loadingSubs, setLoadingSubs] = useState(true)
    const [loadingRecent, setLoadingRecent] = useState(true)
    const [loadingProgress, setLoadingProgress] = useState(true)
    const [searching, setSearching] = useState(false)
    const [searchTerm, setSearchTerm] = useState<string | null>(null)
    const [searchResults, setSearchResults] = useState<podcastInfo[] | null>(
        null
    )

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
    function isWithinLastWeek(datePublished: number) {
        const currentTime = Math.floor(Date.now() / 1000) // Current time in Unix timestamp
        const oneWeekInSeconds = 604800 // One week in seconds

        // Check if the date is within the last week

        return currentTime - datePublished
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
            return '<1h'
        }
    }

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchTerm) {
                try {
                    // const term = searchTerm

                    const podcastResponse = await fetch(
                        'https://mus-backend-b262ef3b1b65.herokuapp.com/api/podcast/search',
                        {
                            method: 'POST',
                            headers: {
                                'Content-type': 'application/json',
                            },
                            body: JSON.stringify({
                                term: searchTerm,
                            }),
                            credentials: 'include',
                        }
                    )
                    const podcastData = await podcastResponse.json()

                    const podcasts: podcastInfo[] = podcastData.data.feeds
                    // const data = await podcastResponse.data
                    console.log('podcast response', podcasts)
                    if (podcasts.length == 0) {
                        setSearchResults(null)
                        setSearching(false)
                    } else {
                        const filteredPodcast = podcasts.filter(
                            podcast =>
                                // podcast.priority > 0 &&
                                // podcast.dead == 0 &&
                                podcast.parseErrors == 0 &&
                                podcast.locked == 0 &&
                                podcast.crawlErrors == 0 &&
                                podcast.episodeCount >= 1
                        )

                        const sortedFilteredPodcasts = filteredPodcast.sort(
                            (a, b) => b.priority - a.priority
                        )

                        setSearching(false)
                        setSearchResults(sortedFilteredPodcasts)
                    }

                    // console.log('search data:', searchResults)
                } catch (error: any) {
                    setSearching(false)
                    console.error(error)
                }
            }
        }, 300) // 500ms debounce
        if (searchTerm === '') {
            setSearchResults(null)
            setSearching(false)
        }

        return () => clearTimeout(delayDebounceFn)
    }, [searchTerm])

    useEffect(() => {
        const getRecentEps = async () => {
            if (podSubs && podSubs.length >= 1) {
                const ids = podSubs.map(pod => pod.id).join()
                console.log('ids', ids)

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
                    console.log('eps data', epsData)
                    const filteredEps: podcastEpisode[] = []

                    console.log('filtered eps', filteredEps, 'podSubs', podSubs)

                    const feedIdSet: Set<string> = new Set()

                    epsData.forEach(ep => {
                        if (!feedIdSet.has(ep.feedId)) {
                            feedIdSet.add(ep.feedId)
                            filteredEps.push(ep)
                        }
                    })

                    podSubs.forEach

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
                    console.log('sorted', sortedEps)

                    setRecentEps(sortedEps)
                    setLoadingRecent(false)
                } catch (error) {
                    console.error(error)
                    setLoadingRecent(false)
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
                console.log('podSubs', data)
                setPodSubs(data)
                setLoadingSubs(false)
            } catch (error) {
                console.error('Error subscribing to podcast:', error)
                setLoadingSubs(false)
                toast.error('Error retrieving podcasts..')
            }
        }
        if (!podSubs) {
            getSubs()
        } else {
            setLoadingSubs(false)
        }
        if (!recentEps && podSubs && podSubs.length >= 1) {
            getRecentEps()
        } else {
            setLoadingRecent(false)
        }
        if (!progressLoaded) {
            fetchPodcastProgress()
        } else {
            setLoadingProgress(false)
        }
    }, [podSubs])

    const onChange = (e: any) => {
        setSearchTerm(e.target.value)
        setSearching(true)
    }

    const style = { fontSize: '2rem', color: 'lightgreen' }

    return (
        <div className={`flex w-full flex-col`}>
            <form className="m-3 p-3 w-full" action="">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={e => onChange(e)}
                    placeholder="Search for podcasts..."
                    className={`border rounded-full px-4 py-2 ${queueToggle ? 'w-3/4' : 'w-1/2'}  text-slate-600 bg-white`}
                />
            </form>
            {searchTerm && searching ? (
                <SkeletonDropdownDisplay sliceNumber={sliceNumber} />
            ) : searchTerm && searchResults ? (
                <div className={`flex flex-wrap justify-center w-full gap-1`}>
                    <DropdownDisplay
                        object={searchResults}
                        podcastShow={true}
                        sliceNumber={sliceNumber}
                        noTitle={true}
                        title={'Search Results'}
                    />
                </div>
            ) : (
                searchTerm &&
                !searching &&
                !searchResults && (
                    <div
                        className={`flex w-11/12 justify-center text-xl italic text-black font-bold py-20  gap-1`}
                    >
                        No results for that search!
                    </div>
                )
            )}
            {podSubs && podSubs.length == 0 && (
                <>
                    <div className="text-3xl font-bold text-center w-full flex justify-center mt-5 italic text-white pb-7">
                        You're not subscribed to any podcasts yet!
                    </div>
                    <div className=" text-white text-md  font-semibold p-5 rounded-lg flex flex-col justify-center m-3 text-center mx-auto gap-3 items-center">
                        <div className="mb-5 text-2xl">
                            Use the search function to find and subscribe to
                            podcasts{' '}
                        </div>
                        <div className="text-lg">- or -</div>
                        <div className="w-full flex justify-start items-center mt-3 flex-col">
                            <div className="w-full flex gap-2 justify-center items-center">
                                <div className="border-2 max-w-96 bg-blue-500 flex flex-col text-left justify-center text-white border-white rounded-lg p-5">
                                    Use this shortcut to export an OPML file of
                                    your podcast subscriptions from Apple
                                    Podcasts
                                    <a
                                        href="https://www.icloud.com/shortcuts/44009520675540d7945263e088f6e915"
                                        target="_blank" // Optional: Opens the link in a new tab
                                        rel="noopener noreferrer" // Optional: Adds security for external links
                                        className="block bg-white text-center hover:text-blue-600  active:scale-95 text-blue-400 p-1 mt-3 text-md rounded-full" // Replace with your button styles
                                    >
                                        Podcast Export Tool
                                    </a>
                                </div>
                                <div className="max-w-96 flex items-center justify-center">
                                    <FaArrowAltCircleRight style={style} />
                                </div>
                                <div className="flex justify-start w-fit">
                                    <ImportPodcasts />
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
            {loadingSubs ? (
                <SkeletonDropdownDisplay sliceNumber={sliceNumber} />
            ) : !loadingSubs && podSubs.length >= 1 ? (
                <div className="flex flex-wrap justify-center w-full gap-1 ">
                    <DropdownDisplay
                        object={podSubs}
                        podcastShow={true}
                        sliceNumber={sliceNumber}
                        noTitle={true}
                        title={'Podcast Subscriptions'}

                        // shrink={searchFilters.length < 2}
                    />
                </div>
            ) : (
                !loadingSubs && podSubs.length < 1 && null
            )}
            {loadingRecent || loadingSubs || loadingProgress ? (
                <>
                    <SkeletonDropdownDisplay sliceNumber={sliceNumber} />
                </>
            ) : !loadingRecent &&
              !loadingSubs &&
              !loadingProgress &&
              recentEps ? (
                <DropdownDisplay
                    podcast={true}
                    object={recentEps}
                    sliceNumber={sliceNumber}
                />
            ) : (
                !loadingRecent &&
                !loadingSubs &&
                !loadingProgress &&
                !recentEps &&
                null
            )}
        </div>
    )
}

export default Podcasts
