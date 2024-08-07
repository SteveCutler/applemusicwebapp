import { useParams } from 'react-router-dom'
import useFetchAlbumData from '../components/Apple/FetchAlbumData'
import fetchAlbumCatalogId from '../hooks/AlbumPage/FetchLibraryAlbumCatalogId'
import FetchRelatedAlbums from '../hooks/AlbumPage/FetchRelatedAlbums'
import FetchAppearsOn from '../hooks/AlbumPage/FetchAppearsOn'
import useFetchArtistSimilarArtistsData from '../hooks/ArtistPage/FetchArtistSimilarArtistsData'
import TrackDisplay from '../components/AlbumPage/TrackDisplay'
import { MdArrowBackIosNew } from 'react-icons/md'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useStore } from '../store/store'
import {
    FaCaretDown,
    FaCaretUp,
    FaCirclePause,
    FaCirclePlay,
    FaRegCirclePause,
} from 'react-icons/fa6'
import ScrollToTop from '../components/Homepage/ScrollToTop'
import DisplayRow from '../components/Homepage/DisplayRow'
import AlbumItem from '../components/Homepage/AlbumItem'
import defaultPlaylistArtwork from '../assets/images/defaultPlaylistArtwork.png'
import OptionsModal from '../components/Homepage/OptionsModal'
import ArtistItem from '../components/Homepage/ArtistItem'
import PlaylistItem from '../components/Homepage/PlaylistItem'
import axios from 'axios'
import PodcastListItem from '../components/Homepage/PodcastListItem'
import CryptoJS from 'crypto-js'
import parse from 'html-react-parser'
import PodcastOptionsModal from '../components/Homepage/PodcastOptionsModal'

// import { usePodcastPlayer } from '../components/Homepage/PodcastPlayer'

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
}

const PodcastEpisode = () => {
    const [podcastInfo, setPodcastInfo] = useState<podcastInfo | null>(null)
    const [loading, setLoading] = useState(false)
    const [podcastEpisode, setPodcastEpisode] = useState<podcastEpisode | null>(
        null
    )

    const { id } = useParams<{ id: string }>()

    const [expandDescription, setExpandDescription] = useState(false)

    function formatTime(sec: number) {
        // Calculate hours, minutes, and seconds
        let hours = Math.floor(sec / 3600)
        let minutes = Math.floor((sec % 3600) / 60)
        let seconds = sec % 60

        // Format hours, minutes, and seconds to be two digits if needed
        hours = hours.toString()
        minutes = minutes.toString()
        seconds = seconds.toString().padStart(2, '0')

        if (hours == 0) {
            return `${minutes}m`
        } else {
            return `${hours}h${minutes}m`
        }
    }

    useEffect(() => {
        const fetchPodcastData = async () => {
            setLoading(true)
            try {
                const headerTime = Math.floor(Date.now() / 1000)
                const hash = CryptoJS.SHA1(
                    import.meta.env.VITE_PODCASTINDEX_KEY +
                        import.meta.env.VITE_PODCASTINDEX_SECRET +
                        headerTime
                ).toString()

                const episodesResponse = await fetch(
                    `https://mus-backend-b262ef3b1b65.herokuapp.com/api/podcast/episode/${id}`,

                    {
                        headers: {
                            'Content-type': 'application/json',
                        },
                        credentials: 'include',
                    }
                )
                const episodeData = await episodesResponse.json()
                const episode: podcastEpisode = await episodeData.data.episode

                console.log('episode', episode)

                setPodcastEpisode(episode)
                if (episode) {
                    try {
                        const infoResponse = await fetch(
                            `https://mus-backend-b262ef3b1b65.herokuapp.com/api/podcast/get-podcast/${episode.feedId}`,

                            {
                                headers: {
                                    'Content-type': 'application/json',
                                },
                                credentials: 'include',
                            }
                        )
                        const infoData = await infoResponse.json()
                        const info = infoData.data.feed
                        console.log('info', info)

                        setPodcastInfo(info)
                    } catch (error) {
                        console.error(error)
                    }
                }
                // console.log('podcast response', response)

                // const info: podcastInfo = infoResponse.data.feed

                // const info = data.shift(0)
                // const episodes = data

                // console.log('info: ', info)
                // console.log('episodes: ', episodes)
                // setPodcastInfo(info)
            } catch (error) {
                console.error('Error fetching podcast details:', error)
                throw error
            } finally {
                setLoading(false)
            }
        }

        if (!podcastInfo) {
            fetchPodcastData()
        }
    }, [id])

    const {
        setSearchTerm,
        playPodcast,
        podcastUrl,
        musicKitInstance,
        darkMode,
        authorizeMusicKit,
        queueToggle,
        isPlaying,
        playlist,

        setPlaylist,
        isPlayingPodcast,
        epId,
        podcastAudio,
    } = useStore(state => ({
        playPodcast: state.playPodcast,
        isPlayingPodcast: state.isPlayingPodcast,
        epId: state.epId,
        podcastAudio: state.podcastAudio,
        podcastUrl: state.podcastUrl,
        setSearchTerm: state.setSearchTerm,
        darkMode: state.darkMode,
        queueToggle: state.queueToggle,
        authorizeMusicKit: state.authorizeMusicKit,
        musicKitInstance: state.musicKitInstance,
        isPlaying: state.isPlaying,
        playlist: state.playlist,
        setPlaylist: state.setPlaylist,
    }))

    const styleButton = { fontSize: '2.1rem', color: 'dodgerblue' }
    const styleButtonSmall = { fontSize: '1.2rem', color: 'dodgerblue' }
    const styleButtonBig = { fontSize: '3rem', color: 'dodgerblue' }

    const style = { fontSize: '1.5em' }

    const handlePlayPodcast = async () => {
        if (isPlayingPodcast && epId === podcastEpisode.id) {
            podcastAudio.paused ? podcastAudio.play() : podcastAudio.pause()
        } else {
            if (podcastEpisode && podcastInfo) {
                playPodcast(
                    podcastEpisode.enclosureUrl,
                    podcastEpisode.duration,
                    podcastEpisode.feedImage,
                    podcastEpisode.title,
                    podcastInfo.title,
                    podcastInfo.id,
                    podcastEpisode.id
                )
            }
        }
    }

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div
            className={`flex-col w-11/12 mx-auto ${darkMode ? 'text-slate-200' : 'text-slate-800'} h-full`}
        >
            <ScrollToTop />

            <div className="flex-col ">
                <h1 className="text-3xl w-1/2 font-bold select-none">
                    {podcastEpisode?.title}
                </h1>
                <Link
                    to={`/podcast/${podcastInfo?.id}`}
                    className={`text-xl w-1/2 ${darkMode ? 'hover:text-slate-400' : 'hover:text-slate-600'} font-bold select-none`}
                >
                    Go to show{' '}
                </Link>
            </div>
            <div
                className={`${queueToggle ? ' flex-col' : 'lg:flex-row flex-col'}   gap-4 flex pb-5 justify-around  items-start`}
            >
                <div
                    className={`relative ${queueToggle ? ' w-1/2' : 'lg:w-1/2 w-full'} h-fit `}
                >
                    {podcastEpisode?.feedImage ? (
                        <img
                            className="w-full"
                            src={podcastEpisode?.feedImage}
                            alt=""
                        />
                    ) : (
                        <img
                            className="w-full"
                            src={defaultPlaylistArtwork}
                            alt=""
                        />
                    )}
                    <div
                        className=" absolute bottom-5 left-5 hover:cursor-pointer transform    hover:scale-110 active:scale-95 transition-transform duration-100 easy-ease"
                        onClick={async e => {
                            e.preventDefault()
                            e.stopPropagation() // Prevents the link's default behavior
                            // await FetchAlbumData(albumId)
                            // handlePlayPause()

                            // await loadPlayer()
                            handlePlayPodcast()
                        }}
                    >
                        {isPlayingPodcast &&
                        podcastEpisode &&
                        epId === podcastEpisode.id &&
                        !podcastAudio.paused &&
                        !podcastAudio.ended ? (
                            <FaCirclePause style={styleButton} />
                        ) : (
                            <FaCirclePlay style={styleButton} />
                        )}
                    </div>
                    {podcastEpisode && (
                        <div className="absolute bottom-4 right-4">
                            <div
                                onClick={e => {
                                    e.preventDefault()
                                    e.stopPropagation() // Prevents the link's default behavior
                                }}
                                className=""
                            >
                                {id && (
                                    <PodcastOptionsModal
                                        id={podcastEpisode.feedId.toString()}
                                    />
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* <div className="text-xl select-none font-semibold">
                    {podcastInfo?.author}
                </div> */}
                {/* <div>{podcastInfo?.country}</div> */}
                {podcastEpisode && (
                    <div
                        className={`${queueToggle ? ' w-full mx-auto' : 'lg:w-1/2 w-full '} ${darkMode ? 'text-white bg-slate-700' : 'text-black bg-slate-300'} flex-col   rounded-lg p-3 `}
                    >
                        <div
                            className={`font-semibold text-xs select-none flex justify-self-end p-1 px-2 ${darkMode ? 'bg-slate-300 text-slate-700' : 'bg-slate-700 text-slate-200'} rounded-md w-fit`}
                        >
                            Latest release
                        </div>
                        {podcastEpisode && (
                            <div className="flex-col pt-3 flex">
                                <div className="text-2xl select-none  font-semibold">
                                    {podcastEpisode.title}
                                </div>
                                <div className="text-lg select-none font-normal">
                                    {podcastEpisode.datePublishedPretty}
                                </div>
                                <div className=" flex select-none items-center gap-1 pb-2">
                                    <div
                                        className="hover:scale-110 active:scale-90 hover:cursor-pointer text-blue-600 hover:text-blue-400"
                                        onClick={handlePlayPodcast}
                                    >
                                        {isPlayingPodcast &&
                                        podcastEpisode &&
                                        epId === podcastEpisode.id &&
                                        !podcastAudio.paused &&
                                        !podcastAudio.ended ? (
                                            <FaCirclePause
                                                style={styleButtonSmall}
                                            />
                                        ) : (
                                            <FaCirclePlay
                                                style={styleButtonSmall}
                                            />
                                        )}
                                    </div>

                                    <div>
                                        {formatTime(podcastEpisode.duration)}
                                    </div>
                                </div>

                                <div
                                    className={` ${expandDescription ? 'line-clamp-none overflow-auto' : 'line-clamp-5'} select-none `}
                                    style={{
                                        maxHeight: queueToggle ? '' : '400px',
                                    }}
                                >
                                    {parse(podcastEpisode.description)}
                                </div>
                                <button
                                    onClick={e => {
                                        e.preventDefault()
                                        setExpandDescription(!expandDescription)
                                    }}
                                    className="  rounded-b-lg  w-4/12 mx-auto md:flex justify-center items-center flex-col mt-3 bg-blue-500 hover:bg-blue-400 active:bg-blue-600"
                                >
                                    {expandDescription ? (
                                        <div className="mx-auto flex-col justify-center py-2 items-center flex text-slate-300 font-bold text-sm">
                                            <FaCaretUp style={style} />
                                        </div>
                                    ) : (
                                        <div className="mx-auto flex-col justify-center items-center flex text-slate-300 font-bold text-sm">
                                            Show more
                                            <FaCaretDown style={style} />
                                        </div>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default PodcastEpisode
