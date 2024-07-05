import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../../store/store'
import { FaCirclePlay, FaRegCirclePause } from 'react-icons/fa6'
import e from 'express'
import OptionsModal from './OptionsModal'

interface AlbumPropTypes {
    song: Song
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
        artwork?: {
            bgColor: string
            url: string
        }
    }
}

const SongItem: React.FC<AlbumPropTypes> = ({ song, carousel }) => {
    const constructImageUrl = (url: String, size: Number) => {
        return url
            .replace('{w}', size.toString())
            .replace('{h}', size.toString())
    }

    const {
        isPlaying,
        darkMode,
        authorizeMusicKit,
        queueToggle,
        playSong,
        setPlaylist,
        pause,
        playlist,
        musicKitInstance,
    } = useStore(state => ({
        pause: state.pauseSong,
        darkMode: state.darkMode,
        playSong: state.playSong,
        queueToggle: state.queueToggle,
        isPlaying: state.isPlaying,
        musicKitInstance: state.musicKitInstance,
        authorizeMusicKit: state.authorizeMusicKit,
        setAlbumData: state.setAlbumData,
        albumData: state.albumData,
        setPlaylist: state.setPlaylist,
        playlist: state.playlist,
    }))

    const [loading, setLoading] = useState<Boolean>(false)
    const [isHovered, setIsHovered] = useState(false)

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

    const style = { fontSize: '2rem', color: 'dodgerblue ' }

    // const handleNavigation = (e: React.MouseEvent) => {
    //     e.preventDefault()
    //     e.stopPropagation()

    //     navigate(`/song/${song.id}`)
    // }

    const navigate = useNavigate()

    return (
        <Link
            to={`/song/${song.id}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            state={{
                song: {
                    id: song.id,
                    href: song.attributes.url,
                    type: 'songs',
                    attributes: {
                        id: song.id,
                        name: song.attributes.name,
                        trackNumber: song.attributes.trackNumber,

                        artistName: song.attributes.artistName,
                        albumName: song.attributes.albumName,
                        durationInMillis: song.attributes.durationInMillis,

                        artwork: {
                            bgColor: song.attributes.artwork?.bgColor,
                            url: song.attributes.artwork?.url,
                        },
                    },
                },
            }}
            // onClick={handleNavigation}
            className={`${carousel && 'carousel-item'}  select-none flex-col ${queueToggle ? 'w-3/12' : ' w-2/12'} flex-grow ${darkMode ? 'text-slate-300 hover:text-slate-500' : ' text-slate-800 hover:text-slate-300'}   rounded-3xl flex`}
        >
            {song.attributes.artwork?.url && (
                <div className=" relative flex-col h-full w-full flex flex-shrink  ">
                    <img
                        className="shadow-lg"
                        src={constructImageUrl(
                            song.attributes.artwork?.url,
                            600
                        )}
                    />
                    <div
                        className={` absolute bottom-1 right-1 ${isHovered ? 'block' : 'hidden'}`}
                    >
                        <div
                            onClick={e => {
                                e.preventDefault()
                                e.stopPropagation() // Prevents the link's default behavior
                            }}
                            className="relative z-100"
                        >
                            <OptionsModal object={song} />
                        </div>
                    </div>
                    <div className="absolute bottom-1 left-1">
                        <div
                            className={`transform text-right h-fit flex justify-end hover:scale-110 active:scale-95 ${isHovered ? 'block' : 'hidden'} transition-transform duration-100 easy-ease`}
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
                    </div>
                </div>
            )}
            <div className="flex w-full justify-between mb-5">
                <div className="flex-col w-full h-full overflow-hidden">
                    <h2 className="text-md truncate font-bold">
                        {song.attributes.name}
                    </h2>
                    <div className="flex items-center justify-between">
                        <h3 className="truncate">
                            {song.attributes.artistName}
                        </h3>
                        <h3 className="text-sm font-bold">
                            {song.attributes.releaseDate.split('-')[0]}
                        </h3>
                    </div>
                </div>
                {song.type === 'library-songs' && (
                    <div className="bg-slate-300  text-slate-600 w-fit p-1 font-bold text-sm  flex rounded-lg">
                        <span>Library</span>
                    </div>
                )}
            </div>
        </Link>
    )
}

export default SongItem
