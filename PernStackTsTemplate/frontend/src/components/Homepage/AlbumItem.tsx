import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import FetchAlbumCatalogId from '../../hooks/AlbumPage/FetchLibraryAlbumCatalogId'
import { useStore } from '../../store/store'
import { FaCirclePlay, FaRegCirclePause } from 'react-icons/fa6'
import OptionsModal from './OptionsModal'
import defaultPlaylistArtwork from '../../assets/images/defaultPlaylistArtwork.png'
import QueueDisplay from './QueueDisplay'

interface AlbumPropTypes {
    albumItem: AlbumType
    carousel?: boolean
    releaseDate?: string
    width?: string
}

type AlbumData = {
    attributes: {
        artistName: string

        artwork: {
            bgColor: string
            url: string
        }
        editorialNotes: {
            short: string
            standard: string
        }
        genreName: Array<string>
        name: string
        trackCount: number
        url: string
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
        id: string
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

const AlbumItem: React.FC<AlbumPropTypes> = ({
    albumItem,
    carousel,
    releaseDate,
    width,
}) => {
    // console.log('album item: ', albumItem)
    const constructImageUrl = (url: String, size: Number) => {
        return url
            .replace('{w}', size.toString())
            .replace('{h}', size.toString())
    }
    const [albumData, setAlbumData] = useState<Song[]>([])

    const {
        isPlaying,
        authorizeMusicKit,
        queueToggle,
        setPlaylist,
        playSong,
        pause,
        playlist,
        musicKitInstance,
    } = useStore(state => ({
        isPlaying: state.isPlaying,
        pause: state.pauseSong,
        queueToggle: state.queueToggle,
        playSong: state.playSong,
        musicKitInstance: state.musicKitInstance,
        authorizeMusicKit: state.authorizeMusicKit,

        setPlaylist: state.setPlaylist,
        playlist: state.playlist,
    }))

    const [loading, setLoading] = useState<Boolean>(false)

    const retrieveAlbumTracks = async () => {
        if (!musicKitInstance) {
            await authorizeMusicKit()
            return
        }
        if (!musicKitInstance || !albumItem.id) {
            return
        }
        setLoading(true)
        try {
            console.log('music kit instance and album id')
            console.log('music kit instance: ', musicKitInstance)
            console.log('albumId: ', albumItem.id)

            if (albumItem.id.startsWith('l')) {
                try {
                    const res = await musicKitInstance.api.music(
                        `/v1/me/library/albums/${albumItem.id}/tracks`
                    )

                    const data: Song[] = await res.data.data
                    console.log(data)

                    setAlbumData(data)
                    setLoading(false)

                    return
                } catch (error: any) {
                    console.error(error)
                    setLoading(false)
                }
            } else {
                try {
                    const queryParameters = { l: 'en-us' }
                    const res = await musicKitInstance.api.music(
                        `/v1/catalog//ca/albums/${albumItem.id}/tracks`,

                        queryParameters
                    )

                    const data: Song[] = await res.data.data
                    console.log(data)
                    setAlbumData(data)
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
        if (albumData.length > 0 && !loading) {
            playData()
        }
    }, [loading])

    // console.log('albumArtUrl: ', albumArtUrl)

    const playData = async () => {
        if (musicKitInstance) {
            const albumDescriptor = [
                {
                    id: albumItem.id,
                    type: 'album',
                },
            ]
            console.log('setting playlist and start position')
            await musicKitInstance.setQueue({
                album: albumItem.id,
                startWith: 0,
                startPlaying: true,
            })
        }
    }
    const loadPlayer = async () => {
        await retrieveAlbumTracks()
    }

    const handleNavigation = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (albumItem.id.startsWith('p')) {
            navigate(`/playlist/${albumItem.id}`)
        } else if (albumItem.id.startsWith('l')) {
            try {
                const res = await musicKitInstance?.api.music(
                    `v1/me/library/albums/${albumItem.id}/catalog`
                )

                const catalogId = await res.data.data[0].id

                console.log(catalogId)
                navigate(`/album/${catalogId}/${albumItem.type}`)
            } catch (error: any) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        } else {
            navigate(`/album/${albumItem.id}/${albumItem.type}`)
        }
    }

    const navigate = useNavigate()

    const style = { fontSize: '2rem', color: 'royalblue ' }

    if (albumItem) {
        return (
            <div
                className={`${carousel && 'carousel-item'} select-none  flex-col ${width ? width : queueToggle ? 'w-3/12' : ' w-2/12'}  text-slate-800 hover:text-slate-200  rounded-3xl flex `}
                onClick={handleNavigation}
                title={`${albumItem.attributes?.name} by ${albumItem.attributes?.artistName}`}
            >
                <div className=" relative z-1 w-fit shadow-lg">
                    {albumItem.attributes.artwork?.url ? (
                        <img
                            src={constructImageUrl(
                                albumItem.attributes.artwork?.url,
                                600
                            )}
                        />
                    ) : (
                        <img src={defaultPlaylistArtwork} />
                    )}
                    <div className="absolute bottom-1 right-1">
                        <div
                            onClick={e => {
                                e.preventDefault()
                                e.stopPropagation() // Prevents the link's default behavior
                            }}
                            className=""
                        >
                            <OptionsModal object={albumItem} />
                        </div>
                    </div>
                    <div className="absolute bottom-1 left-1">
                        <div
                            className="transform  p-1 flex justify-right hover:scale-110 active:scale-95 transition-transform duration-100 easy-ease"
                            onClick={async e => {
                                e.preventDefault()
                                e.stopPropagation() // Prevents the link's default behavior
                                // await FetchAlbumData(albumId)
                                // handlePlayPause()

                                await loadPlayer()
                            }}
                        >
                            {isPlaying && playlist === albumData ? (
                                <FaRegCirclePause style={style} />
                            ) : (
                                <FaCirclePlay style={style} />
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex-col h-full overflow-hidden">
                    <h2 className="text-md truncate font-bold">
                        {albumItem.attributes.name}
                    </h2>
                    <div className=" justify-between items-center ">
                        <h3 className="truncate">
                            {albumItem.attributes.artistName}
                        </h3>
                        {releaseDate ? (
                            <h3 className="text-sm font-bold ">
                                {releaseDate.split('-')[0]}
                            </h3>
                        ) : (
                            <h1></h1>
                        )}
                    </div>

                    {albumItem.type === 'library-albums' && (
                        <div className="bg-slate-300  text-slate-600 w-fit h-fit p-1 font-bold text-sm  flex rounded-lg">
                            <span>Library</span>
                        </div>
                    )}
                </div>
            </div>
        )
    }
}

export default AlbumItem
