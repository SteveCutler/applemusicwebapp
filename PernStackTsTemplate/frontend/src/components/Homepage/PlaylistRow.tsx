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
        setPlaylistData,
        authorizeMusicKit,
        play,
        playlistData,
        musicKitInstance,
    } = useStore(state => ({
        isPlaying: state.isPlaying,
        playlistData: state.playlistData,
        currentSongId: state.currentSongId,
        musicKitInstance: state.musicKitInstance,
        setPlaylistData: state.setPlaylistData,
        authorizeMusicKit: state.authorizeMusicKit,
        setPlaylist: state.setPlaylist,
        playlist: state.playlist,
        recentHistory: state.recentHistory,
        pause: state.pauseSong,
        play: state.playSong,
        switchTrack: state.switchTrack,
    }))

    const [playlistTracks, setPlaylistTracks] = useState<Song[] | null>(null)

    const fetchPlaylistTracks = async () => {
        if (!musicKitInstance) {
            await authorizeMusicKit()
        }

        try {
            console.log('music kit instance and album id')
            console.log('music kit instance: ', musicKitInstance)
            console.log('playlistId: ', id)

            if (id.startsWith('pl')) {
                try {
                    const queryParameters = { l: 'en-us' }
                    const trackRes = await musicKitInstance?.api.music(
                        `/v1/catalog/us/playlists/${id}/tracks`,

                        queryParameters
                    )

                    const trackData = await trackRes.data.data
                    console.log(trackData)

                    setPlaylistTracks(trackData)
                    playPauseHandler()
                } catch (error: any) {
                    console.error(error)
                }
            } else if (id.startsWith('p')) {
                try {
                    const trackRes = await musicKitInstance?.api.music(
                        `/v1/me/library/playlists/${id}/tracks`
                    )

                    const trackData = await trackRes.data.data
                    console.log(trackData)

                    setPlaylistTracks(trackData)
                    playPauseHandler()
                } catch (error: any) {
                    console.error(error)
                }
            }
        } catch (error: any) {
            console.error(error)
            console.log('error in fetchPlaylistData')
        } finally {
        }
    }

    const playPauseHandler = async () => {
        if (musicKitInstance) {
            console.log('setting playlist and start position')
            await musicKitInstance.setQueue({
                playlist: id,
                startWith: 0,
                startPlaying: true,
            })
        }
    }
    const style = { fontSize: '1rem', color: 'royalblue' }

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
                        await fetchPlaylistTracks()
                    }}
                >
                    {isPlaying && playlist === playlistTracks ? (
                        <FaRegCirclePause style={style} />
                    ) : (
                        <FaCirclePlay style={style} />
                    )}
                </div>
            </div>
        </Link>
    )
}

export default PlaylistRow
