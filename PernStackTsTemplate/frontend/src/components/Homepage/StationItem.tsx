import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../../store/store'
import { FaCirclePlay, FaRegCirclePause } from 'react-icons/fa6'

interface StationItemTypes {
    title: string
    artistName: string
    albumArtUrl?: string
    stationId: string
    type: string
    carousel?: boolean
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
    title,
    artistName,
    albumArtUrl,
    stationId,
    type,
    carousel,
}) => {
    const constructImageUrl = (url: String, size: Number) => {
        return url
            .replace('{w}', size.toString())
            .replace('{h}', size.toString())
    }

    const {
        isPlaying,
        authorizeMusicKit,
        playlistData,
        setPlaylistData,
        setPlaylist,
        playSong,
        pause,
        playlist,
        musicKitInstance,
    } = useStore(state => ({
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

    const playRadioStation = async () => {
        try {
            await musicKitInstance?.setQueue({ station: stationId })
        } catch (error) {
            console.error('Error playing radio station:', error)
        }
    }

    const playData = async () => {
        await playRadioStation()
        musicKitInstance?.play()
    }

    const style = { fontSize: '2rem', color: 'royalblue ' }

    return (
        <Link
            className={`${carousel && 'carousel-item'} select-none flex-col shadow-lg hover:bg-slate-700 bg-slate-800 w-1/6 flex-grow  border-white p-4 rounded-3xl flex justify-between`}
            to={`/station/${stationId}`}
            title={`${title} by ${artistName}`}
        >
            <div className="h-full w-full">
                {albumArtUrl && (
                    <img src={constructImageUrl(albumArtUrl, 600)} />
                )}
            </div>
            <div className="flex justify-between h-full pt-2">
                <div className="flex-col h-full overflow-hidden">
                    <h2 className="text-lg truncate font-bold">{title}</h2>
                    <h3 className="truncate">{artistName}</h3>
                </div>
                <div className="flex flex-col justify-between items-end h-full">
                    {' '}
                    <div
                        className="transform   flex justify-right hover:scale-110 active:scale-95 transition-transform duration-100 easy-ease"
                        onClick={async e => {
                            e.preventDefault()
                            e.stopPropagation() // Prevents the link's default behavior
                            // await FetchAlbumData(albumId)
                            // handlePlayPause()

                            playData()
                        }}
                    >
                        {isPlaying &&
                        musicKitInstance?.nowPlayingItem &&
                        playlist.includes(musicKitInstance?.nowPlayingItem) ? (
                            <FaRegCirclePause style={style} />
                        ) : (
                            <FaCirclePlay style={style} />
                        )}
                    </div>
                    {type === 'library-albums' && (
                        <div className="bg-slate-300  text-slate-600 w-fit p-1 my-1 font-bold text-sm  flex rounded-lg">
                            <span>Library</span>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    )
}

export default StationItem
