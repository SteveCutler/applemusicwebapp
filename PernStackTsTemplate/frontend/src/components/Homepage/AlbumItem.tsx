import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../../store/store'
import { FaCirclePlay, FaRegCirclePause } from 'react-icons/fa6'

interface AlbumPropTypes {
    title: String
    artistName: String
    albumArtUrl: String
    albumId: String
    type: string
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
    }
}

const AlbumItem: React.FC<AlbumPropTypes> = ({
    title,
    artistName,
    albumArtUrl,
    albumId,
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
        setAlbumData,
        albumData,
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
        setAlbumData: state.setAlbumData,
        albumData: state.albumData,
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
        if (
            musicKitInstance?.nowPlayingItem &&
            playlist.includes(musicKitInstance?.nowPlayingItem)
        ) {
            {
                isPlaying ? await pause() : playSong()
            }
        } else {
            await setPlaylist(albumData, 0, true)
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

    const style = { fontSize: '2rem', color: 'royalblue ' }

    return (
        <Link
            className={`${carousel && 'carousel-item'} flex-col shadow-lg hover:bg-slate-700 bg-slate-800 w-1/6   border-white p-4 rounded-3xl flex justify-between`}
            to={
                albumId.startsWith('p')
                    ? `/playlist/${albumId}`
                    : `/album/${albumId}/${type}`
            }
        >
            <div className="h-full w-full">
                <img src={constructImageUrl(albumArtUrl, 600)} />
            </div>
            <div className="flex justify-between h-full pt-2">
                <div className="flex-col ">
                    <h2 className="text-xl font-bold">{title}</h2>
                    <h3>{artistName}</h3>
                </div>
                <div className="flex flex-col justify-between items-end h-full">
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
                        {isPlaying &&
                        musicKitInstance?.nowPlayingItem &&
                        playlist.includes(musicKitInstance?.nowPlayingItem) ? (
                            <FaRegCirclePause style={style} />
                        ) : (
                            <FaCirclePlay style={style} />
                        )}
                    </div>
                    {type === 'library-albums' && (
                        <div className="bg-slate-300  text-slate-600 w-fit p-1 my-1 font-bold text-sm  flex rounded-lg">
                            <span>Library</span>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    )
}

export default AlbumItem
