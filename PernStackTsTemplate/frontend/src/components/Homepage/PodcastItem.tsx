import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../../store/store'
import { FaCirclePlay, FaRegCirclePause } from 'react-icons/fa6'
import OptionsModal from './OptionsModal'
import defaultPlaylistArtwork from '../../assets/images/defaultPlaylistArtwork.png'
import PodcastOptionsModal from './PodcastOptionsModal'

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
    podcast: podcastInfo
    width?: string
    sub?: boolean
}

const PodcastItem: React.FC<podcastProp> = ({ podcast, width, sub }) => {
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
        playlist,
        musicKitInstance,
    } = useStore(state => ({
        playlistData: state.playlistData,
        darkMode: state.darkMode,
        queueToggle: state.queueToggle,
        setPlaylistData: state.setPlaylistData,
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
    const [loading, setLoading] = useState(true)

    // console.log('albumArtUrl: ', albumArtUrl)
    const navigate = useNavigate()

    const handleNavigation = () => {
        navigate(`/podcast/${podcast.id}`)
    }

    return (
        <div
            onClick={handleNavigation}
            className={` select-none  flex-col justify-start ${width ? width : queueToggle ? 'w-3/12' : ' w-2/12'} ${darkMode ? 'text-slate-300 hover:text-slate-500' : 'text-slate-800 hover:text-slate-200'}   rounded-3xl flex `}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            title={`${podcast.title}`}
        >
            <div className="relative z-1 w-full h-fit shadow-lg">
                {loading ? (
                    <div className="w-full h-full flex items-center justify-center">
                        <img
                            src={defaultPlaylistArtwork}
                            className="animation-pulse"
                        />
                        {/* Replace with a loader if you have one */}
                    </div>
                ) : null}
                <img
                    src={
                        podcast.image ||
                        podcast.artwork ||
                        defaultPlaylistArtwork
                    }
                    onLoad={() => setLoading(false)}
                    style={{ display: loading ? 'none' : 'block' }}
                />

                <div
                    className={`transform p-1 absolute bottom-1 left-1 flex justify-right hover:scale-110 active:scale-95 transition-transform duration-100 easy-ease ${isHovered ? 'block' : 'hidden'}`}
                    onClick={async e => {
                        e.preventDefault()
                        e.stopPropagation() // Prevents the div's default behavior
                        // await FetchAlbumData(albumId)
                        // handlePlayPause()

                        // await loadPlayer()
                    }}
                >
                    {/* {isPlaying && playlistData === playlist ? (
                        <FaRegCirclePause style={style} />
                    ) : (
                        <FaCirclePlay style={style} />
                    )} */}
                </div>

                <div
                    onClick={e => {
                        e.preventDefault()
                        e.stopPropagation() // Prevents the link's default behavior
                    }}
                    className={`absolute bottom-1 right-1 z-100 ${isHovered ? 'block' : 'hidden'}`}
                >
                    <PodcastOptionsModal id={String(podcast.id)} />
                </div>
            </div>
            <div className="flex justify-start items-start">
                <div className="flex-col flex items-start  justify-start overflow-hidden">
                    <h2 className={`text-md  line-clamp-3 font-bold`}>
                        {podcast.title}
                    </h2>
                    {!sub && <h3 className="truncate">Podcast</h3>}
                    {/* {playlistItem.type === 'library-playlists' && (
                        <div className="bg-slate-300  text-slate-600 w-fit p-1 font-bold text-sm  flex rounded-lg">
                            <span>Library</span>
                        </div>
                    )} */}
                    <div></div>
                </div>
            </div>
        </div>
    )
}

export default PodcastItem
