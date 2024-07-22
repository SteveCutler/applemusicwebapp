import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../../store/store'
import { FaCirclePlay, FaRegCirclePause } from 'react-icons/fa6'
import defaultPlaylistArtwork from '../../assets/images/defaultPlaylistArtwork.png'
import toast from 'react-hot-toast'

interface AlbumPropTypes {
    artist: Artist
    carousel?: boolean
    width?: string
}

type Artist = {
    attributes: {
        artwork?: {
            bgColor: string
            url: string
        }
        genreNames: Array<string>
        name: string
        url: string
    }
    relationships?: {
        albums?: {
            href: string
            data: Array<AlbumRelationships>
        }
    }
    id: string
    type: string
}

type AlbumRelationships = {
    href: string
    id: string
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

const ArtistItem: React.FC<AlbumPropTypes> = ({ artist, carousel, width }) => {
    const constructImageUrl = (url: String, width: Number, height: Number) => {
        return url
            .replace('{w}', width.toString())
            .replace('{h}', height.toString())
    }

    const { isPlaying, darkMode, queueToggle, musicKitInstance } = useStore(
        state => ({
            darkMode: state.darkMode,
            musicKitInstance: state.musicKitInstance,
            queueToggle: state.queueToggle,
            isPlaying: state.isPlaying,
        })
    )
    const [isHovered, setIsHovered] = useState(false)
    const [loading, setLoading] = useState<Boolean>(false)

    const style = { fontSize: '2rem', color: 'dodgerblue ' }

    const playTopSongs = async () => {
        if (artist) {
            try {
                if (artist.id.startsWith('r')) {
                    console.log(`${artist.id} start with 'r'`)
                    try {
                        const topSongs = await musicKitInstance.api.music(
                            `/v1/me/library/artists/${artist.id}/view/top-songs`
                        )

                        const topSongsData: Array<Song> =
                            await topSongs.data.data
                        if (topSongsData) {
                            console.log('top songs', topSongsData)

                            await musicKitInstance.setQueue({
                                items: topSongsData,
                                startPlaying: true,
                            })
                            await musicKitInstance.play()
                        }
                    } catch (error: any) {
                        console.error(error)
                        toast.error('Something went wrong..')
                    }
                } else {
                    try {
                        const topSongs = await musicKitInstance.api.music(
                            `/v1/catalog/${musicKitInstance.storefrontId}/artists/${artist.id}/view/top-songs`
                        )

                        const topSongsData: Array<Song> =
                            await topSongs.data.data

                        if (topSongsData) {
                            console.log('top songs', topSongsData)

                            await musicKitInstance.setQueue({
                                items: topSongsData,
                                startPlaying: true,
                            })
                            await musicKitInstance.play()
                        }
                    } catch (error: any) {
                        console.error(error)
                        toast.error('Something went wrong..')
                    }
                }
            } catch (error: any) {
                console.error(error)
            }
        }
    }

    return (
        <Link
            className={`${carousel && 'carousel-item'} select-none  flex-col ${width ? width : queueToggle ? 'w-3/12' : ' w-2/12'}  ${darkMode ? 'text-slate-300' : 'text-slate-800'}    rounded-3xl flex `}
            to={`/artist/${artist.id}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="  flex-col flex flex-shrink  ">
                <div className="relative">
                    {artist.attributes.artwork?.url ? (
                        <img
                            src={constructImageUrl(
                                artist.attributes.artwork?.url,
                                600,
                                600
                            )}
                            className="shadow-lg"
                            style={{ width: '1000px' }}
                        />
                    ) : (
                        <img
                            className="shadow-lg "
                            src={defaultPlaylistArtwork}
                        />
                    )}
                    <div
                        className={`absolute bottom-1 left-1 transform   ${isHovered ? 'block' : 'hidden'} flex justify-right hover:scale-110 active:scale-95 transition-transform duration-100 easy-ease`}
                        onClick={async e => {
                            e.preventDefault()
                            e.stopPropagation() // Prevents the link's default behavior
                            // await FetchAlbumData(albumId)
                            // handlePlayPause()

                            await playTopSongs()
                        }}
                    >
                        {musicKitInstance?.nowPlayingItem &&
                        musicKitInstance.nowPlayingItem.container &&
                        musicKitInstance?.nowPlayingItem.container.id ===
                            artist.id &&
                        musicKitInstance.playbackState == 2 ? (
                            <FaRegCirclePause style={style} />
                        ) : (
                            <FaCirclePlay style={style} />
                        )}
                    </div>
                </div>

                <div className="flex w-full justify-between mb-5">
                    <div className="flex-col  w-full overflow-hidden">
                        <h2 className="text-md truncate font-bold">
                            {artist.attributes.name}
                        </h2>
                    </div>
                </div>
            </div>

            {/* <div className="flex justify-between h-full pt-2">
                <div className="flex-col">
                    <h2 className="text-xl font-bold">{title}</h2>
                </div>
                <div className="flex-col justify-between pt-3"></div>
            </div> */}
        </Link>
    )
}

export default ArtistItem
