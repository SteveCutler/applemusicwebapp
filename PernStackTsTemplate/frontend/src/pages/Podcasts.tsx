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
    } = useStore(state => ({
        darkMode: state.darkMode,
        recentEps: state.recentEps,
        setRecentEps: state.setRecentEps,
        queueToggle: state.queueToggle,
        podSubs: state.podSubs,
        setPodSubs: state.setPodSubs,
        backendToken: state.backendToken,
    }))

    const [loading, setLoading] = useState(false)

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
        const getRecentEps = async () => {
            if (podSubs) {
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
                } catch (error) {
                    console.error(error)
                }
            }
        }

        const getSubs = async () => {
            setLoading(true)
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
                setLoading(false)
            } catch (error) {
                console.error('Error subscribing to podcast:', error)
                setLoading(false)
                toast.error('Error retrieving podcasts..')
            }
        }
        if (!podSubs) {
            getSubs()
        }
        if (!recentEps && podSubs) {
            getRecentEps()
        }
    }, [podSubs])

    if (loading) {
        return <div>loading</div>
    }
    return (
        <div className={`flex flex-col`}>
            {podSubs && (
                <div className="flex flex-wrap justify-center w-fit gap-1 ">
                    <DropdownDisplay
                        object={podSubs}
                        podcastShow={true}
                        sliceNumber={sliceNumber}
                        noTitle={true}
                        title={'Podcast Subscriptions'}

                        // shrink={searchFilters.length < 2}
                    />
                    {/* {podSubs &&
                    podSubs.map((sub, index) => (
                        <PodcastItem
                            key={index}
                            podcast={sub}
                            sub={true}
                            width={` ${queueToggle ? 'w-full md:w-5/12 lg:w-3/12 2xl:w-2/12' : 'w-full md:w-5/12 lg:w-3/12 xl:w-2/12 2xl:w-1/12 '} `}
                        />
                    ))} */}
                </div>
            )}
            {recentEps && (
                <DropdownDisplay
                    podcast={true}
                    object={recentEps}
                    sliceNumber={sliceNumber}
                />
            )}
        </div>
    )
}

export default Podcasts
