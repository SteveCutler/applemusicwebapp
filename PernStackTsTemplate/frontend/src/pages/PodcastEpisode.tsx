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

type podcastInfo = {
    artistName: string
    artworkUrl100: string
    artworkUrl30: string
    artworkUrl60: string
    artworkUrl600: string
    collectionCensoredName: string
    collectionExplicitness: string
    collectionId: number
    collectionName: string
    collectionPrice: number
    collectionViewUrl: string
    contentAdvisoryRating: string
    country: string
    currency: string
    feedUrl: string
    genreIds: Array<string>
    genres: Array<string>
    kind: string
    primaryGenreName: string
    releaseDate: string
    trackCensoredName: string
    trackCount: number
    trackExplicitness: string
    trackId: number
    trackName: string
    trackPrice: number
    trackTimeMillis: number
    trackViewUrl: string
    wrapperType: string
}
interface podcastEpisode {
    artistIds: Array<string>
    artworkUrl160: string
    artworkUrl60: string
    artworkUrl600: string
    closedCaptioning: string
    collectionId: number
    collectionName: string
    collectionViewUrl: string
    contentAdvisoryRating: string
    country: string
    description: string
    episodeContentType: string
    episodeFileExtension: string
    episodeGuid: string
    episodeUrl: string
    feedUrl: string
    genres: Array<{
        id: string
        name: string
    }>
    kind: string
    previewUrl: string
    releaseDate: string
    shortDescription: string
    trackId: number
    trackName: string
    trackTimeMillis: number
    trackViewUrl: string
    wrapperType: string
}

const PodcastEpisode = () => {
    const [podcastInfo, setPodcastInfo] = useState<podcastInfo | null>(null)
    const [podcastEpisodes, setPodcastEpisodes] =
        useState<Array<podcastEpisode> | null>(null)

    const { id } = useParams<{ id: string }>()

    const [expandDescription, setExpandDescription] = useState(false)

    function formatTime(ms: number) {
        // Calculate hours, minutes, and seconds
        let hours = Math.floor(ms / 3600000)
        let minutes = Math.floor((ms % 3600000) / 60000)
        let seconds = Math.floor((ms % 60000) / 1000)

        // Format hours, minutes, and seconds to be two digits if needed
        hours = hours.toString()
        minutes = minutes.toString().padStart(2, '0')
        seconds = seconds.toString().padStart(2, '0')

        if (hours == 0) {
            return `${minutes}m`
        } else {
            return `${hours}h${minutes}m`
        }
    }

    useEffect(() => {
        const fetchPodcastData = async () => {
            try {
                const response = await axios.get(
                    `https://itunes.apple.com/lookup?id=${id}&entity=podcastEpisode`
                )
                const data = response.data.results
                const info = data.shift(0)
                const episodes = data

                console.log('info: ', info)
                console.log('episodes: ', episodes)
                setPodcastInfo(info)
                setPodcastEpisodes(episodes)
            } catch (error) {
                console.error('Error fetching podcast details:', error)
                throw error
            }
        }

        // if (!podcastData) {
        fetchPodcastData()
        // }
    }, [id])

    const {
        setSearchTerm,
        musicKitInstance,
        darkMode,
        authorizeMusicKit,
        queueToggle,
        isPlaying,
        playlist,
        setPlaylist,
    } = useStore(state => ({
        setSearchTerm: state.setSearchTerm,
        darkMode: state.darkMode,
        queueToggle: state.queueToggle,
        authorizeMusicKit: state.authorizeMusicKit,
        musicKitInstance: state.musicKitInstance,
        isPlaying: state.isPlaying,
        playlist: state.playlist,
        setPlaylist: state.setPlaylist,
    }))

    const styleButton = { fontSize: '1rem' }

    const style = { fontSize: '1.5em' }

    return (
        <div
            className={`flex-col w-11/12 mx-auto ${darkMode ? 'text-slate-200' : 'text-slate-800'} h-full`}
        >
            <ScrollToTop />

            <div className="flex-col ">
                <h1 className="text-3xl w-1/2 font-bold select-none">
                    {podcastInfo?.collectionName}
                </h1>
                <h1 className="text-xl w-1/2 font-bold select-none">Podcast</h1>
            </div>
            <div
                className={`${queueToggle ? ' flex-col' : 'lg:flex-row flex-col'}   gap-4 flex  justify-around  items-start`}
            >
                <div
                    className={`relative ${queueToggle ? ' w-1/2' : 'lg:w-1/2 w-full'} h-fit `}
                >
                    {podcastInfo?.artworkUrl600 ? (
                        <img
                            className="w-full"
                            src={podcastInfo?.artworkUrl600}
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
                        }}
                    >
                        {/* <FaCirclePlay style={styleButton} /> */}
                    </div>
                    <div className="absolute bottom-4 right-4">
                        <div
                            onClick={e => {
                                e.preventDefault()
                                e.stopPropagation() // Prevents the link's default behavior
                            }}
                            className=""
                        >
                            {/* <OptionsModal big={true} object={albumData} /> */}
                        </div>
                    </div>
                </div>
                <div
                    className={`${queueToggle ? ' w-full mx-auto' : 'lg:w-1/2 w-full '}  flex-col  `}
                >
                    <div className="text-xl select-none font-semibold">
                        {podcastInfo?.artistName}
                    </div>
                    <div>{podcastInfo?.country}</div>
                    {podcastEpisodes && (
                        <div className="flex-col pt-3 flex">
                            <div className="text-2xl select-none  font-semibold">
                                Latest Episode:
                            </div>
                            <div className="text-lg select-none font-normal">
                                Released:{' '}
                                {podcastEpisodes[0].releaseDate.split('T')[0]}
                            </div>
                            <div className=" flex select-none items-center gap-1 pb-2">
                                <div className="hover:scale-115 active:scale-90 hover:cursor-pointer text-blue-600 hover:text-blue-400">
                                    <FaCirclePlay style={styleButton} />
                                </div>
                                <div>
                                    {formatTime(
                                        podcastEpisodes[0].trackTimeMillis
                                    )}
                                </div>
                            </div>

                            <div
                                className={` ${expandDescription ? 'line-clamp-none overflow-auto' : 'line-clamp-5'}`}
                                style={{
                                    maxHeight: queueToggle ? '' : '400px',
                                }}
                            >
                                {podcastEpisodes[0].description}
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
                {/* MAKE TRACK GETTER, ETC. DESIGN PAGE LAYOUT */}
            </div>
        </div>
    )
}

export default PodcastEpisode
