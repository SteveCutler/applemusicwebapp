import React, { useEffect, useState } from 'react'
import { FaCirclePlay, FaRegCirclePause } from 'react-icons/fa6'

import { Link } from 'react-router-dom'
import { useStore } from '../../store/store'
import defaultPlaylistArtwork from '../../assets/images/defaultPlaylistArtwork.png'

import FetchAlbumTracks from '../Apple/FetchAlbumTracks'

interface AlbumProps {
    // id: string
    albumItem: Album
    first: boolean
    last: boolean
    // albumId: string
    // index: number
    // first: boolean
    // last: boolean

    // name: string
    // artistName: string
    // artworkUrl?: string
    // trackCount: number
}
interface Album {
    attributes: {
        artistName?: string
        artwork?: { height: number; width: number; url?: string }
        dateAdded?: string
        genreNames?: Array<string>
        name?: string
        releaseDate?: string
        trackCount?: number
    }
    id: string
    type: string
}

type AlbumType = {
    attributes: AttributeObject
    id: string
    type: string
}

type AttributeObject = {
    artistName: string
    artwork?: ArtworkObject
    dateAdded: string
    genreNames: Array<string>
    name: string
    releasedDate: string
    trackCount: number
}

type ArtworkObject = {
    height: number
    width: number
    url: string
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

const AlbumRow: React.FC<AlbumProps> = ({ albumItem, first, last }) => {
    const {
        isPlaying,
        albumData,
        setTrackData,
        trackData,
        playlist,
        setPlaylist,
        playSong,
        pause,
        musicKitInstance,
        authorizeMusicKit,
    } = useStore(state => ({
        setTrackData: state.setTrackData,
        trackData: state.trackData,
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

    const constructImageUrl = (url: String, size: Number) => {
        return url
            .replace('{w}', size.toString())
            .replace('{h}', size.toString())
    }

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

                    await setTrackData(data)
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
                    setTrackData(data)
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
    const styleBlue = { color: 'dodgerblue', fontSize: '3rem' }

    useEffect(() => {
        if (trackData?.length > 0 && !loading) {
            playData()
        }
    }, [loading])

    const playData = async () => {
        console.log('album data: ', albumData)
        setPlaylist(trackData, 0, true)

        setTrackData([])
    }
    const loadPlayer = async () => {
        await retrieveAlbumTracks()
    }

    return (
        <>
            <Link
                to={`/album/${albumItem.id}`}
                className={`flex border-b-2 w-full  text-xl mx-auto ${first && 'rounded-t-xl'}  ${last ? 'rounded-b-xl' : ''} text-slate-200 font-bold select-none hover:bg-slate-800 bg-black  p-2 justify-between items-center border-slate-700`}

                // className="flex border-2 border-slate-400 hover:border-slate-300 hover:scale{1.01} hover:text-slate-200 my-3 rounded-lg px-3 items-center justify-between h-10"
            >
                <div className="flex gap-2 items-center">
                    {albumItem.attributes.artwork?.url ? (
                        <img
                            src={constructImageUrl(
                                albumItem.attributes.artwork?.url,
                                100
                            )}
                            style={{ width: '75px' }}
                        />
                    ) : (
                        <img
                            src={defaultPlaylistArtwork}
                            style={{ width: '75px' }}
                        />
                    )}
                    <div className="flex-flex-col justify-center">
                        <div className="">
                            {albumItem.attributes.artistName}
                        </div>
                        <div className="font-normal text-slate-400">
                            {albumItem.attributes.name}
                        </div>
                    </div>
                </div>
                <span className="">{albumItem.attributes.trackCount}</span>
                <div
                    className="transform hover:scale-110 pe-5 active:scale-95 transition-transform duration-100 easy-ease"
                    onClick={async e => {
                        e.preventDefault()
                        e.stopPropagation() // Prevents the link's default behavior
                        // await FetchAlbumData(albumId)
                        // handlePlayPause()

                        await loadPlayer()
                        console.log(musicKitInstance)
                    }}
                >
                    <FaCirclePlay style={styleBlue} />
                </div>
            </Link>
        </>
    )
}

export default AlbumRow
