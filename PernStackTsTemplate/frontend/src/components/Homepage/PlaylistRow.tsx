import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../../store/store'
import { FaCirclePlay, FaRegCirclePause } from 'react-icons/fa6'
import FetchPlaylistData from '../Apple/FetchPlaylistData'

interface playlistProps {
    name: string
    id: string
    index: number
}

interface Song {
    id: string
    href?: string
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

const PlaylistRow: React.FC<playlistProps> = ({ name, id, index }) => {
    const {
        isPlaying,
        currentSongId,
        playlist,
        recentHistory,
        switchTrack,
        setPlaylist,
        pause,
        play,
        musicKitInstance,
    } = useStore(state => ({
        isPlaying: state.isPlaying,
        currentSongId: state.currentSongId,
        musicKitInstance: state.musicKitInstance,
        setPlaylist: state.setPlaylist,
        playlist: state.playlist,
        recentHistory: state.recentHistory,
        pause: state.pauseSong,
        play: state.playSong,
        switchTrack: state.switchTrack,
    }))

    const [playlistTracks, setPlaylistTracks] = useState<Song[] | null>(null)

    const playPauseHandler = async () => {
        console.log('play pause ahndler')

        const { playlistTrackData } = FetchPlaylistData(id)
        setPlaylistTracks(playlistTrackData)
        if (playlist !== playlistTrackData && playlistTrackData) {
            setPlaylist(playlistTrackData, 0, true)
            return
        }

        if (isPlaying) {
            await pause()
        } else {
            play()
        }
    }
    const style = { color: 'white' }

    return (
        <Link
            to={`/playlist/${id}`}
            className="  overflow-hidden text-ellipsis whitespace-nowrap  truncate w-full mx-auto font-semibold hover:text-slate-200 text-slate-400 border-2 border-slate-300  px-3 py-1 rounded-lg hover:cursor-pointer"
        >
            <div
                className="text-sm justify-center items-center gap-2 flex overflow-hidden text-ellipsis whitespace-nowrap  truncate w-full mx-auto  "
                title={`${name}`}
            >
                <div className="overflow-hidden text-ellipsis whitespace-nowrap truncate font-semibold">
                    {name}
                </div>

                <div
                    className="transform hover:scale-110 active:scale-95 transition-transform duration-100 easy-ease"
                    onClick={async e => {
                        e.preventDefault()
                        e.stopPropagation() // Prevents the link's default behavior
                        // await FetchAlbumData(albumId)
                        // handlePlayPause()

                        await playPauseHandler()
                    }}
                >
                    {isPlaying && playlist === playlistTrackData ? (
                        <FaRegCirclePause />
                    ) : (
                        <FaCirclePlay />
                    )}
                </div>
            </div>
        </Link>
    )
}

export default PlaylistRow
