import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../../store/store'
import { FaCirclePlay, FaRegCirclePause } from 'react-icons/fa6'
import OptionsModal from './OptionsModal'
import defaultPlaylistArtwork from '../../assets/images/defaultPlaylistArtwork.png'
import PodcastOptionsModal from './PodcastOptionsModal'
import { BsFillPatchCheckFill } from 'react-icons/bs'

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

interface podcastProp {
    podcast: podcastEpisode
    width?: string
    sub?: boolean
    recent?: boolean
}

const PodcastEpisodeItem: React.FC<podcastProp> = ({
    podcast,
    width,
    sub,
    recent,
}) => {
    const constructImageUrl = (url: String, size: Number) => {
        return url
            .replace('{w}', size.toString())
            .replace('{h}', size.toString())
    }

    const {
        isPlaying,
        authorizeMusicKit,

        queueToggle,
        darkMode,
        playPodcast,
        playlist,
        podcastProgress,
        musicKitInstance,
    } = useStore(state => ({
        playPodcast: state.playPodcast,
        playlistData: state.playlistData,
        darkMode: state.darkMode,
        queueToggle: state.queueToggle,
        setPlaylistData: state.setPlaylistData,
        podcastProgress: state.podcastProgress,
        isPlaying: state.isPlaying,
        pause: state.pauseSong,
        playSong: state.playSong,
        musicKitInstance: state.musicKitInstance,
        authorizeMusicKit: state.authorizeMusicKit,
        setAlbumData: state.setAlbumData,
        albumData: state.albumData,
        setPlaylist: state.setPlaylist,
        playlist: state.playlist,
    }))

    // const [loading, setLoading] = useState<Boolean>(false)
    // const [playlistData, setPlaylistData] = useState<Song[]>([])

    const [isHovered, setIsHovered] = useState(false)

    // console.log('albumArtUrl: ', albumArtUrl)
    const navigate = useNavigate()

    const styleButton = { fontSize: '2rem', color: 'dodgerblue' }

    const handlePlayPodcast = async () => {
        const res = await fetch(
            `https://mus-backend-b262ef3b1b65.herokuapp.com/api/podcast/get-podcast/${podcast.feedId}`,

            {
                headers: {
                    'Content-type': 'application/json',
                },
                credentials: 'include',
            }
        )
        const showData = await res.json()
        const showTitle = showData.data.feed.title
        // console.log('podcast', podcast, 'podcast show tile', podcast.showTitle)
        if (podcast && showTitle) {
            playPodcast(
                podcast.enclosureUrl,
                podcast.duration,
                podcast.feedImage,
                podcast.title,
                showTitle,
                podcast.feedId,
                podcast.id
            )
        }
    }

    // console.log('podcast ', podcast)

    const handleNavigation = () => {
        navigate(`/podcast-episode/${podcast.id}`)
    }
    const style = { fontSize: '1.4rem' }

    const getEpisodeProgress = (episodeId, listenedEpisodes) => {
        const episode = listenedEpisodes.find(
            episode => episode.episodeId === episodeId
        )
        return episode ? episode.progress : 0
    }

    const progressPercent = getEpisodeProgress(
        String(podcast.id),
        podcastProgress
    )

    const progress = Number(progressPercent)

    return (
        <div
            onClick={handleNavigation}
            className={` select-none  flex-col justify-start ${width ? width : queueToggle ? 'w-3/12' : ' w-2/12'} ${darkMode ? 'text-slate-300 hover:text-slate-500' : 'text-slate-800 hover:text-slate-200'}   rounded-3xl flex `}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            title={`${podcast.title}`}
        >
            <div className="relative z-1 w-full h-fit shadow-lg">
                {podcast.feedImage ? (
                    <img src={podcast.feedImage} />
                ) : (
                    <img src={defaultPlaylistArtwork} />
                )}
                {podcast.released && (
                    <h3
                        className={`truncate absolute bottom-3 right-3 px-1 py-1 bg-blue-400 font-semibold rounded-lg text-sm ${darkMode ? ' text-black' : ' text-white'}`}
                    >
                        {podcast.released}
                    </h3>
                )}

                <div
                    className={`transform p-1 absolute bottom-1 left-1 flex justify-right hover:scale-110 active:scale-95 transition-transform duration-100 easy-ease ${isHovered ? 'block' : 'hidden'}`}
                    onClick={async e => {
                        e.preventDefault()
                        e.stopPropagation() // Prevents the div's default behavior
                        // await FetchAlbumData(albumId)
                        // handlePlayPause()
                        handlePlayPodcast()
                        // await loadPlayer()
                    }}
                >
                    <FaCirclePlay style={styleButton} />
                </div>

                <div
                    onClick={e => {
                        e.preventDefault()
                        e.stopPropagation() // Prevents the link's default behavior
                    }}
                    className={`absolute bottom-1 right-1 ${recent && 'hidden'} z-100 ${isHovered ? 'block' : 'hidden'}`}
                >
                    <PodcastOptionsModal id={String(podcast.id)} />
                </div>
            </div>
            <div className="flex justify-start items-start">
                <div className="flex-col flex items-start  justify-start overflow-hidden">
                    <h2 className={`text-md  line-clamp-3 font-bold`}>
                        {podcast.title}
                    </h2>

                    {progress !== 0 && (
                        <div className=" text-blue-500 w-fit p-1 font-bold text-sm  flex m-0 p-0">
                            {progress < 99 ? (
                                <div>{String(progress)}%</div>
                            ) : (
                                <div>
                                    {<BsFillPatchCheckFill style={style} />}
                                </div>
                            )}
                        </div>
                    )}
                    <div></div>
                </div>
            </div>
        </div>
    )
}

export default PodcastEpisodeItem
