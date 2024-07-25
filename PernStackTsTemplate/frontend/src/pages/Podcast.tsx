import { useParams } from 'react-router-dom'
import useFetchAlbumData from '../components/Apple/FetchAlbumData'
import fetchAlbumCatalogId from '../hooks/AlbumPage/FetchLibraryAlbumCatalogId'
import FetchRelatedAlbums from '../hooks/AlbumPage/FetchRelatedAlbums'
import FetchAppearsOn from '../hooks/AlbumPage/FetchAppearsOn'
import useFetchArtistSimilarArtistsData from '../hooks/ArtistPage/FetchArtistSimilarArtistsData'
import TrackDisplay from '../components/AlbumPage/TrackDisplay'
import { MdArrowBackIosNew } from 'react-icons/md'
import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useStore } from '../store/store'
import { IoGridOutline, IoGrid } from 'react-icons/io5'
import { FaList } from 'react-icons/fa'
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
import { BsFillPatchCheckFill } from 'react-icons/bs'
import PodcastEpisodeItem from '../components/Homepage/PodcastEpisodeItem'

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

const Podcast = () => {
    const {
        setSearchTerm,
        playPodcast,
        podcastUrl,
        musicKitInstance,
        darkMode,
        authorizeMusicKit,
        queueToggle,
        isPlayingPodcast,
        isPlaying,
        playlist,
        setPlaylist,
        progressLoaded,
        fetchPodcastProgress,
        podcastProgress,
        epId,
        podcastAudio,
    } = useStore(state => ({
        playPodcast: state.playPodcast,
        podcastAudio: state.podcastAudio,
        podcastProgress: state.podcastProgress,
        epId: state.epId,
        progressLoaded: state.progressLoaded,
        isPlayingPodcast: state.isPlayingPodcast,
        fetchPodcastProgress: state.fetchPodcastProgress,
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

    const [podcastInfo, setPodcastInfo] = useState<podcastInfo | null>(null)
    const [loading, setLoading] = useState(false)
    const [podcastEpisodes, setPodcastEpisodes] =
        useState<Array<podcastEpisode> | null>(null)
    const [visibleEpisodes, setVisibleEpisodes] = useState<
        Array<podcastEpisode>
    >([])
    const [gridDisplay, setGridDisplay] = useState(true)
    const [page, setPage] = useState(1)
    const [episodeSearchTerm, setEpisodeSearchTerm] = useState<string | null>(
        null
    )
    const [episodeSearchResults, setEpisodeSearchResults] = useState<
        podcastEpisode[] | null
    >(null)
    const [progress, setProgress] = useState<number | null>(0)

    const observer = useRef<IntersectionObserver | null>(null)
    const loadMoreRef = useRef<HTMLDivElement>(null)

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

    const fetchRSSFeed = async (feedUrl: string) => {
        try {
            const response = await fetch(feedUrl)

            console.log('feed data: ', response)

            // const episodes = rssData.rss.channel[0].item;
            // console.log('Episodes from RSS Feed:', episodes);
        } catch (error) {
            console.error('Error fetching RSS feed:', error)
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

                const infoResponse = await fetch(
                    `https://mus-backend-b262ef3b1b65.herokuapp.com/api/podcast/get-podcast/${id}`,

                    {
                        headers: {
                            'Content-type': 'application/json',
                        },
                        credentials: 'include',
                    }
                )

                const episodesResponse = await fetch(
                    `https://mus-backend-b262ef3b1b65.herokuapp.com/api/podcast/get-episodes/${id}`,

                    {
                        method: 'POST',
                        headers: {
                            'Content-type': 'application/json',
                        },
                        credentials: 'include',
                    }
                )
                const episodeData = await episodesResponse.json()
                const episodes: podcastEpisode[] = episodeData.data.items

                const infoData = await infoResponse.json()

                const info: podcastInfo = infoData.data.feed

                console.log('episodes', episodes)
                setPodcastEpisodes(episodes)
                // setVisibleEpisodes(episodes.slice(0, 10))

                setPodcastInfo(info)
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

        if (!progressLoaded) {
            fetchPodcastProgress()
        }

        const getEpisodeProgress = (episodeId, listenedEpisodes) => {
            const episode = listenedEpisodes.find(
                episode => episode.episodeId === episodeId
            )
            return episode ? episode.progress : 0
        }

        if (podcastEpisodes) {
            const progressPercent = getEpisodeProgress(
                String(podcastEpisodes[0].id),
                podcastProgress
            )
            setProgress(progressPercent)
        }
    }, [id, podcastEpisodes])

    useEffect(() => {
        if (observer.current) observer.current.disconnect()
        const loadMoreEpisodes = () => {
            console.log('slicing podcast episodes')
            const newPage = page + 1
            const newVisibleEpisodes = podcastEpisodes.slice(0, newPage * 10)
            setVisibleEpisodes(newVisibleEpisodes)
            setPage(newPage)
        }
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && podcastEpisodes) {
                loadMoreEpisodes()
            }
        })
        if (loadMoreRef.current) observer.current.observe(loadMoreRef.current)
    }, [visibleEpisodes, podcastEpisodes])

    useEffect(() => {
        const filterEpisodes = () => {
            const searchResults: podcastEpisode[] = podcastEpisodes.filter(
                ep =>
                    ep.title
                        .toLowerCase()
                        .includes(episodeSearchTerm.toLowerCase()) ||
                    ep.description
                        .toLowerCase()
                        .includes(episodeSearchTerm.toLowerCase())
            )

            searchResults.length > 0
                ? setEpisodeSearchResults(searchResults)
                : setEpisodeSearchResults(null)
        }

        if (episodeSearchTerm) {
            filterEpisodes()
        } else {
            setEpisodeSearchTerm(null)
            setEpisodeSearchResults(null)
        }

        if (episodeSearchTerm == '') {
            setEpisodeSearchTerm(null)
            setEpisodeSearchResults(null)
        }
    }, [
        podcastEpisodes,
        visibleEpisodes,
        episodeSearchTerm,
        episodeSearchResults,
    ])

    const styleGrid = { fontSize: '2.1rem' }
    const styleButton = { fontSize: '2.1rem', color: 'dodgerblue' }
    const styleButtonSmall = { fontSize: '1.2rem', color: 'dodgerblue' }
    const styleButtonBig = { fontSize: '3rem', color: 'dodgerblue' }

    const style = { fontSize: '1.5em' }

    const handlePlayPodcast = async () => {
        if (isPlayingPodcast && epId === podcastEpisodes[0].id) {
            podcastAudio.paused ? podcastAudio.play() : podcastAudio.pause()
        } else {
            if (podcastEpisodes && podcastInfo) {
                playPodcast(
                    podcastEpisodes[0].enclosureUrl,
                    podcastEpisodes[0].duration,
                    podcastEpisodes[0].feedImage,
                    podcastEpisodes[0].title,
                    podcastInfo.title,
                    podcastInfo.id,
                    podcastEpisodes[0].id
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
                    {podcastInfo?.title}
                </h1>
                <h1 className="text-xl w-1/2 font-bold select-none">Podcast</h1>
            </div>
            <div
                className={`${queueToggle ? ' flex-col' : 'lg:flex-row flex-col'}   gap-4 flex pb-3 justify-around  items-start`}
            >
                <div
                    className={`relative ${queueToggle ? ' w-2/3' : 'lg:w-1/2 w-full'} h-fit `}
                >
                    {podcastEpisodes && podcastEpisodes[0]?.feedImage ? (
                        <img
                            className="w-full"
                            src={podcastEpisodes[0].feedImage}
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
                        className=" absolute bottom-3 left-2 hover:cursor-pointer transform    hover:scale-110 active:scale-95 transition-transform duration-100 easy-ease"
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
                        podcastEpisodes &&
                        epId === podcastEpisodes[0].id &&
                        !podcastAudio.paused &&
                        !podcastAudio.ended ? (
                            <FaCirclePause style={styleButton} />
                        ) : (
                            <FaCirclePlay style={styleButton} />
                        )}
                    </div>
                    {podcastEpisodes && (
                        <div className="absolute bottom-2 right-2">
                            <div
                                onClick={e => {
                                    e.preventDefault()
                                    e.stopPropagation() // Prevents the link's default behavior
                                }}
                                className=""
                            >
                                {id && <PodcastOptionsModal id={id} />}
                            </div>
                        </div>
                    )}
                </div>

                {/* <div className="text-xl select-none font-semibold">
                    {podcastInfo?.author}
                </div> */}
                {/* <div>{podcastInfo?.country}</div> */}
                {podcastEpisodes && !queueToggle && (
                    <div
                        className={`${queueToggle ? ' w-full mx-auto' : 'lg:w-1/2 w-full '} ${darkMode ? 'text-white bg-slate-700' : 'text-black bg-slate-300'} flex-col   rounded-lg p-3 `}
                    >
                        <div
                            className={`font-semibold text-xs select-none flex justify-self-end p-1 px-2 ${darkMode ? 'bg-slate-300 text-slate-700' : 'bg-slate-700 text-slate-200'} rounded-md w-fit`}
                        >
                            Latest release
                        </div>
                        {podcastEpisodes && (
                            <div className="flex-col pt-3 flex">
                                <div className="text-2xl select-none  font-semibold">
                                    {podcastEpisodes[0].title}
                                </div>
                                <div className="text-lg select-none font-normal">
                                    {podcastEpisodes[0].datePublishedPretty}
                                </div>
                                <div className=" flex select-none items-center gap-1 pb-2">
                                    <div
                                        className="hover:scale-110 active:scale-90 hover:cursor-pointer text-blue-600 hover:text-blue-400"
                                        onClick={handlePlayPodcast}
                                    >
                                        {isPlayingPodcast &&
                                        podcastEpisodes &&
                                        epId === podcastEpisodes[0].id &&
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

                                    <div className="flex gap-2 items-center">
                                        {formatTime(
                                            podcastEpisodes[0].duration
                                        )}
                                        {progress !== 0 && (
                                            <div
                                                className={`${darkMode ? 'text-black' : 'text-white'}  bg-blue-400 p-1 w-fit font-bold text-xs  flex m-0 rounded-lg`}
                                            >
                                                {progress < 99 ? (
                                                    <div className="drop-shadow-md">
                                                        {String(progress)}%
                                                    </div>
                                                ) : (
                                                    <div className="drop-shadow-md">
                                                        {
                                                            <BsFillPatchCheckFill
                                                                style={style}
                                                            />
                                                        }
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div
                                    className={` ${expandDescription ? 'line-clamp-none overflow-auto' : 'line-clamp-5'} select-none `}
                                    style={{
                                        maxHeight: queueToggle ? '' : '400px',
                                    }}
                                >
                                    {parse(podcastEpisodes[0].description)}
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
            <div className="flex w-11/12 justify-between items-center">
                <form className="p-3 w-full" action="">
                    <input
                        type="text"
                        value={episodeSearchTerm}
                        onChange={e => setEpisodeSearchTerm(e.target.value)}
                        placeholder="Filter episodes..."
                        className={`border rounded-full px-4 py-2 ${queueToggle ? 'w-2/3' : 'w-1/3'} text-slate-600 bg-white`}
                    />
                </form>

                <div
                    onClick={e => setGridDisplay(!gridDisplay)}
                    className={`w-fit ${darkMode ? 'bg-slate-300 text-black hover:bg-slate-400' : 'bg-slate-800 text-slate-200 hover:bg-slate-600'}  active:scale-95 m-2 p-1 rounded-md flex items-center gap-1`}
                >
                    {' '}
                    {gridDisplay ? (
                        <IoGridOutline style={styleGrid} />
                    ) : (
                        <FaList style={styleGrid} />
                    )}
                </div>
            </div>

            {episodeSearchTerm && !episodeSearchResults ? (
                <div>
                    <div className="text-2xl font-bold">
                        No results for search term
                    </div>
                </div>
            ) : episodeSearchTerm && episodeSearchResults ? (
                <div
                    className={`${gridDisplay ? 'flex-row flex-wrap gap-2 gap-y-5' : 'flex-col'}  flex w-11/12`}
                >
                    {episodeSearchTerm &&
                        podcastInfo &&
                        episodeSearchResults.map((episode, index) =>
                            gridDisplay ? (
                                <PodcastEpisodeItem
                                    key={index}
                                    podcast={episode}
                                    width={` ${queueToggle ? 'w-full md:w-5/12 lg:w-3/12 xl:w-3/12' : 'w-full md:w-5/12 lg:w-3/12 xl:w-2/12 2xl:w-1/12 '} `}
                                />
                            ) : (
                                <PodcastListItem
                                    key={index}
                                    podcast={episode}
                                    title={podcastInfo.title}
                                    id={podcastInfo.id}
                                />
                            )
                        )}
                </div>
            ) : (
                <div
                    className={`${gridDisplay ? 'flex-row flex-wrap gap-2 gap-y-5' : 'flex-col'}  flex w-11/12`}
                >
                    {visibleEpisodes &&
                        podcastInfo &&
                        visibleEpisodes
                            .slice(queueToggle ? 0 : 1)
                            .map((episode, index) =>
                                gridDisplay ? (
                                    <PodcastEpisodeItem
                                        key={index}
                                        podcast={episode}
                                        width={` ${queueToggle ? 'w-full md:w-5/12 lg:w-3/12 xl:w-3/12' : 'w-full md:w-5/12 lg:w-3/12 xl:w-2/12 2xl:w-1/12 '} `}
                                    />
                                ) : (
                                    <PodcastListItem
                                        key={index}
                                        podcast={episode}
                                        title={podcastInfo.title}
                                        id={podcastInfo.id}
                                    />
                                )
                            )}
                    <div ref={loadMoreRef} style={{ height: '1px' }} />
                </div>
            )}
        </div>
    )
}

export default Podcast
