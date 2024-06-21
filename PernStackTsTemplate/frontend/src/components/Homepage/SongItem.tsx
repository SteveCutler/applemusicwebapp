import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../../store/store'
import { FaCirclePlay, FaRegCirclePause } from 'react-icons/fa6'
import e from 'express'
import OptionsModal from './OptionsModal'

interface AlbumPropTypes {
    song: Song
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
        artwork?: {
            bgColor: string
            url: string
        }
    }
}

const SongItem: React.FC<AlbumPropTypes> = ({ song }) => {
    const constructImageUrl = (url: String, width: Number, height: Number) => {
        return url
            .replace('{w}', width.toString())
            .replace('{h}', height.toString())
    }

    const {
        isPlaying,
        authorizeMusicKit,
        playSong,
        setPlaylist,
        pause,
        playlist,
        musicKitInstance,
    } = useStore(state => ({
        pause: state.pauseSong,
        playSong: state.playSong,
        isPlaying: state.isPlaying,
        musicKitInstance: state.musicKitInstance,
        authorizeMusicKit: state.authorizeMusicKit,
        setAlbumData: state.setAlbumData,
        albumData: state.albumData,
        setPlaylist: state.setPlaylist,
        playlist: state.playlist,
    }))

    const [loading, setLoading] = useState<Boolean>(false)

    const playData = async () => {
        if (playlist.includes(song)) {
            {
                isPlaying ? pause() : playSong()
            }
        } else {
            setPlaylist([song], 0, true)
        }
        //musicKitInstance?.play(songId)
    }

    const style = { fontSize: '2rem', color: 'royalblue ' }

    const handleNavigation = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        navigate(`/song/${song.id}`)
    }

    const navigate = useNavigate()

    return (
        <div
            // to={`/song/${song.id}`}
            onClick={handleNavigation}
            className="flex-col border-2 shadow-lg hover:bg-slate-500 bg-slate-600 w-1/5   border-white p-3 rounded-3xl flex justify-between"
        >
            {song.attributes.artwork?.url && (
                <div className="">
                    <img
                        src={constructImageUrl(
                            song.attributes.artwork?.url,
                            500,
                            500
                        )}
                    />
                </div>
            )}
            <div className="flex justify-between h-full pt-2">
                <div className="flex-col">
                    <h2 className="text-xl font-bold">
                        {song.attributes.name}
                    </h2>
                    <h3>{song.attributes.artistName}</h3>
                </div>
                <div className="flex flex-col justify-start gap-2 mt-2 items-end h-full">
                    <div
                        className="transform text-right h-fit flex justify-end hover:scale-110 active:scale-95 transition-transform duration-100 easy-ease"
                        onClick={async e => {
                            e.preventDefault()
                            e.stopPropagation() // Prevents the link's default behavior
                            // await FetchAlbumData(albumId)
                            // handlePlayPause()

                            await playData()
                        }}
                    >
                        {isPlaying &&
                        musicKitInstance?.nowPlayingItem.id === song.id ? (
                            <FaRegCirclePause style={style} />
                        ) : (
                            <FaCirclePlay style={style} />
                        )}
                    </div>
                    <div
                        onClick={e => {
                            e.preventDefault()
                            e.stopPropagation() // Prevents the link's default behavior
                        }}
                        className="relative z-100"
                    >
                        <OptionsModal
                            name={song.attributes.name}
                            type="songs"
                            id={song.id}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SongItem
