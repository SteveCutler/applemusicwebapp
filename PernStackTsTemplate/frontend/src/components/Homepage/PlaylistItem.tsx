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
            className={`${carousel && 'carousel-item'} select-none flex-col shadow-lg hover:bg-slate-700 bg-slate-800 w-1/6 flex-grow  border-white p-4 rounded-3xl flex justify-between`}
            onClick={handleNavigation}
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
                <div className="flex flex-col justify-start gap-2 mt-2 items-end h-full">
                    {' '}
                    <div
                        className="transform   flex justify-right hover:scale-110 active:scale-95 transition-transform duration-100 easy-ease"
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
                        className="relative z-100"
                    >
                        <OptionsModal
                            name={title}
                            type="playlists"
                            id={playlistId}
                        />
                    </div>
                    {type === 'library-albums' && (
                        <div className="bg-slate-300  text-slate-600 w-fit p-1 my-1 font-bold text-sm  flex rounded-lg">
                            <span>Library</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default PlaylistItem
