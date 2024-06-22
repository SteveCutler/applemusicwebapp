import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../../store/store'
import { FaCirclePlay, FaRegCirclePause } from 'react-icons/fa6'
import OptionsModal from './OptionsModal'

interface AlbumPropTypes {
    title: string
    artistName: string
    albumArtUrl: string
    playlistId: string
    type: string
    carousel?: boolean
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

const PlaylistItem: React.FC<AlbumPropTypes> = ({
    title,
    artistName,
    albumArtUrl,
    playlistId,
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
    const [playlistData, setPlaylistData] = useState<Song[]>([])

    const retrieveAlbumTracks = async () => {
        if (!musicKitInstance) {
            await authorizeMusicKit()
            return
        }
        if (!musicKitInstance || !playlistId) {
            return
        }
        setLoading(true)
        try {
            console.log('music kit instance and album id')
            console.log('music kit instance: ', musicKitInstance)
            console.log('playlistId: ', playlistId)

            if (playlistId.startsWith('pl')) {
                try {
                    // const queryParameters = { l: 'en-us' }
                    const res = await musicKitInstance.api.music(
                        `/v1/catalog/us/playlists/${playlistId}/tracks`
                    )

                    const data: Song[] = await res.data.data
                    console.log(data)

                    setPlaylistData(data)
                    setLoading(false)

                    return
                } catch (error: any) {
                    console.error(error)
                    setLoading(false)
                }
            } else {
                try {
                    const res = await musicKitInstance.api.music(
                        `/v1/me/library/playlists/${playlistId}/tracks`
                    )

                    const data: Song[] = await res.data.data
                    console.log(data)
                    setPlaylistData(data)
                    setLoading(false)

                    return
                } catch (error: any) {
                    console.error(error)
                    setLoading(false)
                }
            }
        } catch (error: any) {
            console.error(error)
            setLoading(false)
        }
    }
    useEffect(() => {
        if (playlistData.length > 0 && !loading) {
            playData()
        }
    }, [loading])

    // console.log('albumArtUrl: ', albumArtUrl)

    const playData = async () => {
        if (playlist === playlistData) {
            {
                isPlaying ? await pause() : playSong()
            }
        } else {
            await setPlaylist(playlistData, 0, true)
        }
    }
    const loadPlayer = async () => {
        await retrieveAlbumTracks()
    }

    const handleNavigation = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        navigate(`/playlist/${playlistId}`)
    }

    const navigate = useNavigate()

    const style = { fontSize: '2rem', color: 'royalblue ' }

    return (
        <div
            className={`${carousel && 'carousel-item'} hover:cursor-pointer select-none flex-col  w-1/5 flex-grow  text-slate-800 hover:text-slate-200 rounded-3xl flex justify-between`}
            onClick={handleNavigation}
            title={`${title} by ${artistName}`}
        >
            <div className="h-full relative shadow-lg w-full">
                {albumArtUrl && (
                    <img src={constructImageUrl(albumArtUrl, 600)} />
                )}

                <div
                    className="transform p-1 absolute bottom-1 left-1 flex justify-right hover:scale-110 active:scale-95 transition-transform duration-100 easy-ease"
                    onClick={async e => {
                        e.preventDefault()
                        e.stopPropagation() // Prevents the link's default behavior
                        // await FetchAlbumData(albumId)
                        // handlePlayPause()

                        await loadPlayer()
                    }}
                >
                    {isPlaying && playlistData === playlist ? (
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
                    className="absolute bottom-1 right-1 z-100"
                >
                    <OptionsModal
                        name={title}
                        type="playlists"
                        id={playlistId}
                    />
                </div>
            </div>
            <div className="flex justify-between h-full ">
                <div className="flex-col h-full overflow-hidden">
                    <h2 className="text-md truncate font-bold">{title}</h2>
                    <h3 className="truncate">{artistName}</h3>

                    {type === 'library-playlists' && (
                        <div className="bg-slate-300  text-slate-600 w-fit p-1 font-bold text-sm  flex rounded-lg">
                            <span>Library</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default PlaylistItem
