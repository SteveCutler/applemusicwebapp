import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../../store/store'
import { FaCirclePlay, FaRegCirclePause } from 'react-icons/fa6'
import OptionsModal from './OptionsModal'
import defaultPlaylistArtwork from '../../assets/images/defaultPlaylistArtwork.png'

interface AlbumPropTypes {
    playlistItem: playlist
    width?: string
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

type playlist = {
    attributes: {
        artwork?: {
            bgColor: string
            url: string
        }
        description?: string
        curatorName?: string
        canEdit: boolean
        playlistType?: string
        dataAdded: string
        isPublic: boolean
        lastModifiedDate: string
        name: string
    }
    href: string
    id: string
    type: string
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
    playlistItem,
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

    const [loading, setLoading] = useState<Boolean>(false)
    const [playlistData, setPlaylistData] = useState<Song[]>([])

    const [isHovered, setIsHovered] = useState(false)

    const retrieveAlbumTracks = async () => {
        if (!musicKitInstance) {
            await authorizeMusicKit()
            return
        }
        if (!musicKitInstance || !playlistItem.id) {
            return
        }
        setLoading(true)
        try {
            console.log('music kit instance and album id')
            console.log('music kit instance: ', musicKitInstance)
            console.log('playlistId: ', playlistItem.id)

            if (playlistItem.id.startsWith('pl')) {
                try {
                    // const queryParameters = { l: 'en-us' }
                    const res = await musicKitInstance.api.music(
                        `/v1/catalog/${musicKitInstance.storefrontId}/playlists/${playlistItem.id}/tracks`
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
                        `/v1/me/library/playlists/${playlistItem.id}/tracks`
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
        if (musicKitInstance) {
            if (
                musicKitInstance.nowPlayingItem &&
                musicKitInstance?.nowPlayingItem.container &&
                musicKitInstance?.nowPlayingItem.container.id ===
                    playlistItem.id
            ) {
                if (musicKitInstance.playbackState == 2) {
                    await musicKitInstance.pause()
                } else {
                    await musicKitInstance.play()
                }
            } else {
                await musicKitInstance.setQueue({
                    playlist: playlistItem.id,
                    startWith: 0,
                    startPlaying: true,
                })
            }
        }
    }
    const loadPlayer = async () => {
        await retrieveAlbumTracks()
    }

    const handleNavigation = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        navigate(`/playlist/${playlistItem.id}`)
    }

    const navigate = useNavigate()

    const style = { fontSize: '2rem', color: 'dodgerblue ' }

    return (
        <div
            className={`${carousel && 'carousel-item'} select-none  flex-col justify-between ${width ? width : queueToggle ? 'w-3/12' : ' w-2/12'} ${darkMode ? 'text-slate-300 hover:text-slate-500' : 'text-slate-800 hover:text-slate-200'}   rounded-3xl flex `}
            onClick={handleNavigation}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            title={`${playlistItem.attributes.name}`}
        >
            <div className="relative z-1 w-full shadow-lg">
                {playlistItem.attributes.artwork?.url ? (
                    <img
                        src={constructImageUrl(
                            playlistItem.attributes.artwork?.url,
                            600
                        )}
                    />
                ) : (
                    <img src={defaultPlaylistArtwork} />
                )}

                <div
                    className={`transform p-1 absolute cursor-pointer bottom-1 left-1 flex justify-right hover:scale-110 active:scale-95 transition-transform duration-100 easy-ease ${isHovered ? 'block' : 'hidden'}`}
                    onClick={async e => {
                        e.preventDefault()
                        e.stopPropagation() // Prevents the link's default behavior
                        // await FetchAlbumData(albumId)
                        // handlePlayPause()

                        await playData()
                    }}
                >
                    {musicKitInstance.nowPlayingItem &&
                    musicKitInstance?.nowPlayingItem.container &&
                    musicKitInstance?.nowPlayingItem.container.id ===
                        playlistItem.id &&
                    musicKitInstance.playbackState == 2 ? (
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
                    className={`absolute bottom-1 right-1 z-100 ${isHovered ? 'block' : 'hidden'}`}
                >
                    <OptionsModal object={playlistItem} />
                </div>
            </div>
            <div className="flex  h-full ">
                <div className="flex-col justify-between h-full overflow-hidden">
                    <h2 className="text-md truncate font-bold">
                        {playlistItem.attributes.name}
                    </h2>
                    <h3 className="truncate">Playlist</h3>

                    {playlistItem.type === 'library-playlists' && (
                        <div className="bg-slate-300  text-slate-600 w-fit p-1 font-bold text-sm  flex rounded-lg">
                            <span>Library</span>
                        </div>
                    )}
                    <span></span>
                </div>
            </div>
        </div>
    )
}

export default PlaylistItem
