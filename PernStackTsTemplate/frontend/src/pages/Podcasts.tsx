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

    function isWithinLastWeek(datePublished: number) {
        const currentTime = Math.floor(Date.now() / 1000) // Current time in Unix timestamp
        const oneWeekInSeconds = 604800 // One week in seconds

        // Check if the date is within the last week

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
            return '<1h'
        }
    }

    const fetchMostRecentEp = async (id: string, title: string) => {
        try {
            const headerTime = Math.floor(Date.now() / 1000)
            const hash = CryptoJS.SHA1(
                import.meta.env.VITE_PODCASTINDEX_KEY +
                    import.meta.env.VITE_PODCASTINDEX_SECRET +
                    headerTime
            ).toString()

            const episodesResponse = await axios.get(
                `https://api.podcastindex.org/api/1.0/episodes/byfeedid?id=${id}&pretty`,
                {
                    headers: {
                        'User-Agent': 'AppleMusicDashboard/1.0',
                        'X-Auth-Key': import.meta.env.VITE_PODCASTINDEX_KEY,
                        'X-Auth-Date': headerTime,
                        Authorization: hash,
                    },
                    params: {
                        fulltext: true,
                        max: 10,
                    },
                }
            )
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
            console.error(error)
        }
    }

    useEffect(() => {
        const getRecentEps = async () => {
            if (podSubs) {
                let eps = await Promise.all(
                    podSubs.map(pod => fetchMostRecentEp(pod.id, pod.title))
                )
                const recentEps: podcastEpisode[] = eps.filter(
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
            setLoading(true)
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
            {recentEps && (
                <DropdownDisplay
                    podcast={true}
                    object={recentEps}
                    sliceNumber={sliceNumber}
                />
            )}

            {podSubs && (
                <div
                    className={`text-xl font-bold w-11/12 border-b-2 pb-2 mb-4 flex mx-auto ${darkMode ? 'text-white border-white' : 'text-black border-black'}`}
                >
                    <div className="px-5">Subscriptions</div>
                </div>
            )}
            <div className="flex flex-wrap justify-center w-fit gap-1 ">
                {podSubs &&
                    podSubs.map((sub, index) => (
                        <PodcastItem
                            key={index}
                            podcast={sub}
                            sub={true}
                            width={` ${queueToggle ? 'w-full md:w-5/12 lg:w-3/12 2xl:w-2/12' : 'w-full md:w-5/12 lg:w-3/12 xl:w-2/12 2xl:w-1/12 '} `}
                        />
                    ))}
            </div>
        </div>
    )
}

export default Podcasts
