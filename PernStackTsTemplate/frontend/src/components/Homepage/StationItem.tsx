import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../../store/store'
import { FaCirclePlay, FaRegCirclePause } from 'react-icons/fa6'

interface StationItemTypes {
    stationItem: StationType
    carousel?: boolean
}

interface StationType {
    attributes: {
        artwork: {
            bgColor: string
            url: string
        }
        mediaKind: string
        name: string
        url: string
        playParams: {
            format: string
            id: string
            kind: string
            stationHash: string
        }
    }
    id: String
    type: string
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

const StationItem: React.FC<StationItemTypes> = ({ stationItem, carousel }) => {
    const constructImageUrl = (url: String, size: Number) => {
        return url
            .replace('{w}', size.toString())
            .replace('{h}', size.toString())
    }

    const {
        isPlaying,
        authorizeMusicKit,
        playlistData,
        setPlaylistData,
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

    const playRadioStation = async () => {
        if (musicKitInstance) {
            console.log('container id: ', musicKitInstance?.nowPlayingItem)
            console.log('stationItem.id: ', stationItem.id)

            await musicKitInstance.setQueue({ station: stationItem.id })
            musicKitInstance.play()
        }
    }

    const style = { fontSize: '2rem', color: 'royalblue ' }

    return (
        <Link
            className={`${carousel && 'carousel-item'} select-none flex-col w-1/5 flex-grow text-slate-800 hover:text-slate-200  rounded-3xl flex`}
            to={`/station/${stationItem.id}`}
            title={`${stationItem.attributes.name}`}
        >
            <div className=" relative w-full shadow-lg">
                {stationItem.attributes.artwork?.url && (
                    <img
                        src={constructImageUrl(
                            stationItem.attributes.artwork?.url,
                            600
                        )}
                    />
                )}
                <div
                    className=" absolute bottom-1 left-1 transform   flex justify-right hover:scale-110 active:scale-95 transition-transform duration-100 easy-ease"
                    onClick={async e => {
                        e.preventDefault()
                        e.stopPropagation() // Prevents the link's default behavior
                        // await FetchAlbumData(albumId)
                        // handlePlayPause()

                        await playRadioStation()
                    }}
                >
                    {isPlaying &&
                    musicKitInstance?.nowPlayingItem &&
                    musicKitInstance?.nowPlayingItem.id === stationItem.id ? (
                        <FaRegCirclePause style={style} />
                    ) : (
                        <FaCirclePlay style={style} />
                    )}
                </div>
            </div>

            <div className="flex justify-between mb-5">
                <div className="flex-col  overflow-hidden">
                    <h2 className="text-md truncate font-bold">
                        {stationItem.attributes.name}
                    </h2>
                    <h3 className="truncate">Radio Station</h3>
                </div>
            </div>
        </Link>
    )
}

export default StationItem
