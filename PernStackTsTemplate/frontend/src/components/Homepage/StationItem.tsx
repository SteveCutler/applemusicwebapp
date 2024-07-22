import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../../store/store'
import { FaCirclePlay, FaRegCirclePause } from 'react-icons/fa6'

interface StationItemTypes {
    stationItem: StationType
    width?: string
    carousel?: boolean
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

interface Song {
    id: string
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
    }
}

const StationItem: React.FC<StationItemTypes> = ({
    stationItem,
    carousel,
    width,
}) => {
    const constructImageUrl = (url: String, size: Number) => {
        return url
            .replace('{w}', size.toString())
            .replace('{h}', size.toString())
    }

    const {
        isPlaying,

        queueToggle,
        darkMode,
        musicKitInstance,
    } = useStore(state => ({
        queueToggle: state.queueToggle,
        darkMode: state.darkMode,
        playlistData: state.playlistData,
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

    const [loading, setLoading] = useState<Boolean>(false)
    const [isHovered, setIsHovered] = useState(false)

    const playRadioStation = async () => {
        if (musicKitInstance) {
            if (
                musicKitInstance?.nowPlayingItem &&
                musicKitInstance?.nowPlayingItem.container &&
                musicKitInstance?.nowPlayingItem.container.id === stationItem.id
            ) {
                musicKitInstance.playbackState == 2
                    ? await musicKitInstance.pause()
                    : await musicKitInstance.play()
            } else {
                await musicKitInstance.setQueue({ station: stationItem.id })
                musicKitInstance.play()
            }
        }
    }

    const style = { fontSize: '2rem', color: 'dodgerblue ' }

    return (
        <Link
            className={`${carousel && 'carousel-item'} select-none flex-col ${width ? width : queueToggle ? 'w-3/12' : ' w-2/12'}  ${darkMode ? 'text-slate-300 hover:text-slate-500' : ' text-slate-800 hover:text-slate-300'}  rounded-3xl flex`}
            to={`/station/${stationItem.id}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            title={`${stationItem.attributes.name}`}
        >
            <div className=" relative w-full shadow-lg">
                {stationItem.attributes.artwork?.url && (
                    <img
                        src={constructImageUrl(
                            stationItem.attributes.artwork?.url,
                            600
                        )}
                    />
                )}
                <div
                    className={`absolute bottom-1 left-1 transform   ${isHovered ? 'block' : 'hidden'} flex justify-right hover:scale-110 active:scale-95 transition-transform duration-100 easy-ease`}
                    onClick={async e => {
                        e.preventDefault()
                        e.stopPropagation() // Prevents the link's default behavior
                        // await FetchAlbumData(albumId)
                        // handlePlayPause()

                        await playRadioStation()
                    }}
                >
                    {musicKitInstance?.nowPlayingItem &&
                    musicKitInstance?.nowPlayingItem.container &&
                    musicKitInstance?.nowPlayingItem.container.id ===
                        stationItem.id &&
                    musicKitInstance.playbackState == 2 ? (
                        <FaRegCirclePause style={style} />
                    ) : (
                        <FaCirclePlay style={style} />
                    )}
                </div>
            </div>

            <div className="flex justify-between mb-5">
                <div className="flex-col  overflow-hidden">
                    <h2 className="text-md truncate font-bold">
                        {stationItem.attributes.name}
                    </h2>
                    <h3 className="truncate">Radio Station</h3>
                </div>
            </div>
        </Link>
    )
}

export default StationItem
