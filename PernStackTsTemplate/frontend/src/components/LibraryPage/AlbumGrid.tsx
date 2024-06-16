import React, { useEffect, useState } from 'react'
import { FaCirclePlay, FaRegCirclePause } from 'react-icons/fa6'

import { Link } from 'react-router-dom'
import { useStore } from '../../store/store'

import FetchAlbumTracks from '../Apple/FetchAlbumTracks'

interface AlbumProps {
    // id: string
    albumId: string
    // href: string
    // type: string
    name: string
    artistName: string
    artworkUrl: string
    trackCount: number
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

const AlbumGrid: React.FC<AlbumProps> = ({
    albumId,
    // href,
    // type,
    name,
    artistName,
    artworkUrl,
    trackCount,
}) => {
    const {
        isPlaying,
        albumData,
        setAlbumData,
        playlist,
        setPlaylist,
        playSong,
        pause,
        musicKitInstance,
        authorizeMusicKit,
    } = useStore(state => ({
        isPlaying: state.isPlaying,
        musicKitInstance: state.musicKitInstance,
        authorizeMusicKit: state.authorizeMusicKit,
        albumData: state.albumData,
        setAlbumData: state.setAlbumData,
        setPlaylist: state.setPlaylist,
        playSong: state.playSong,
        playlist: state.playlist,
        pause: state.pauseSong,
    }))

    // const initializeMusic = async () => {
    //     await setPlaylist(albumData, 0)
    // }
    const [loading, setLoading] = useState<Boolean>(false)
    // setAlbumData([])

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

                    await setAlbumData(data)
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

    const playData = async () => {
        console.log('album data: ', albumData)
        setPlaylist(albumData, 0, true)
        setAlbumData([])
    }
    const loadPlayer = async () => {
        await retrieveAlbumTracks()
    }

    const style = { fontSize: '2rem', color: 'royalblue ' }

    return (
        <>
            {/* <div className="grid-cols-1"> */}
            <Link
                to={`/album/${albumId}`}
                className="flex-col bg-slate-900  p-3 w-1/5 h-full border-slate-400 hover:border-slate-300 hover:scale{1.01} hover:text-slate-200 my-3 rounded-lg px-3 items-between justify-between h-10"
            >
                {artworkUrl ? (
                    <img src={artworkUrl} width="300" height="300" />
                ) : (
                    <span></span>
                )}
                <div className="flex items-center justify-between py-3">
                    <div className="">
                        <span className="">{artistName}</span>
                        <span className="">{name}</span>
                        {/* <span className="">{trackCount}</span> */}
                    </div>

                    <div className="">
                        <div
                            className="transform hover:scale-110 active:scale-95 transition-transform duration-100 easy-ease"
                            onClick={async e => {
                                e.preventDefault()
                                e.stopPropagation() // Prevents the link's default behavior
                                // await FetchAlbumData(albumId)
                                // handlePlayPause()

                                await loadPlayer()
                                console.log(musicKitInstance)
                            }}
                        >
                            {isPlaying ? (
                                <FaRegCirclePause style={style} />
                            ) : (
                                <FaCirclePlay style={style} />
                            )}
                        </div>
                    </div>
                </div>
            </Link>
            {/* </div> */}
        </>
    )
}

export default AlbumGrid
