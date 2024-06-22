import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import FetchAlbumCatalogId from '../../hooks/AlbumPage/FetchLibraryAlbumCatalogId'
import { useStore } from '../../store/store'
import { FaCirclePlay, FaRegCirclePause } from 'react-icons/fa6'
import OptionsModal from './OptionsModal'

interface AlbumPropTypes {
    title: string
    artistName: string
    albumArtUrl?: string
    albumId: string
    type: string
    carousel?: boolean
    releaseDate?: string
    width?: string
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

const AlbumItem: React.FC<AlbumPropTypes> = ({
    title,
    artistName,
    albumArtUrl,
    albumId,
    type,
    carousel,
    releaseDate,
    width,
}) => {
    const constructImageUrl = (url: String, size: Number) => {
        return url
            .replace('{w}', size.toString())
            .replace('{h}', size.toString())
    }
    const [albumData, setAlbumData] = useState<Song[]>([])

    const {
        isPlaying,
        authorizeMusicKit,

        setPlaylist,
        playSong,
        pause,
        playlist,
        musicKitInstance,
    } = useStore(state => ({
        isPlaying: state.isPlaying,
        pause: state.pauseSong,
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
        if (!musicKitInstance || !albumId) {
            return
        }
        setLoading(true)
        try {
            console.log('music kit instance and album id')
            console.log('music kit instance: ', musicKitInstance)
            console.log('albumId: ', albumId)

            if (albumId.startsWith('l')) {
                try {
                    const res = await musicKitInstance.api.music(
                        `/v1/me/library/albums/${albumId}/tracks`
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
                        `/v1/catalog/{{storefrontId}}/albums/${albumId}/tracks`,

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
        if (isPlaying && playlist === albumData) {
            await pause()
            return
        } else if (!isPlaying && playlist === albumData) {
            playSong()
            return
        } else {
            setPlaylist(albumData, 0, true)
            return
        }
        // setAlbumData([])
        //musicKitInstance?.play(songId)

        // console.log('album data: ', albumData)
        // setPlaylist(albumData, 0, true)
        // setAlbumData([])
    }
    const loadPlayer = async () => {
        await retrieveAlbumTracks()
    }

    const handleNavigation = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (albumId.startsWith('p')) {
            navigate(`/playlist/${albumId}`)
        } else if (albumId.startsWith('l')) {
            try {
                const res = await musicKitInstance?.api.music(
                    `v1/me/library/albums/${albumId}/catalog`
                )

                const catalogId = await res.data.data[0].id

                console.log(catalogId)
                navigate(`/album/${catalogId}/${type}`)
            } catch (error: any) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        } else {
            navigate(`/album/${albumId}/${type}`)
        }
    }

    const navigate = useNavigate()

    const style = { fontSize: '2rem', color: 'royalblue ' }

    return (
        <div
            className={`${carousel && 'carousel-item'} select-none  flex-col ${width ? width : 'w-1/5'} flex-grow text-slate-800 hover:text-slate-200  rounded-3xl flex `}
            onClick={handleNavigation}
            title={`${title} by ${artistName}`}
        >
            <div className=" relative w-fit shadow-lg">
                {albumArtUrl && (
                    <img src={constructImageUrl(albumArtUrl, 600)} />
                )}
                <div className="absolute bottom-1 right-1">
                    <div
                        onClick={e => {
                            e.preventDefault()
                            e.stopPropagation() // Prevents the link's default behavior
                        }}
                        className=""
                    >
                        <OptionsModal name={title} type={type} id={albumId} />
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
                <h2 className="text-md truncate font-bold">{title}</h2>
                <div className=" justify-between items-center ">
                    <h3 className="truncate">{artistName}</h3>
                    {releaseDate && (
                        <h3 className="text-sm font-bold ">
                            {releaseDate.split('-')[0]}
                        </h3>
                    )}
                </div>

                {type === 'library-albums' && (
                    <div className="bg-slate-300  text-slate-600 w-fit h-fit p-1 font-bold text-sm  flex rounded-lg">
                        <span>Library</span>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AlbumItem
