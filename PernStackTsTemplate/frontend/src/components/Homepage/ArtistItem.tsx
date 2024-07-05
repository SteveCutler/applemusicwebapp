import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../../store/store'
import { FaCirclePlay, FaRegCirclePause } from 'react-icons/fa6'
import defaultPlaylistArtwork from '../../assets/images/defaultPlaylistArtwork.png'

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

    const { isPlaying, darkMode, queueToggle } = useStore(state => ({
        darkMode: state.darkMode,
        queueToggle: state.queueToggle,
        isPlaying: state.isPlaying,
    }))

    const [loading, setLoading] = useState<Boolean>(false)

    const style = { fontSize: '2rem', color: 'dodgerblue ' }

    return (
        <Link
            className={`${carousel && 'carousel-item'} select-none  flex-col ${width ? width : queueToggle ? 'w-3/12' : ' w-2/12'}  ${darkMode ? 'text-slate-300' : 'text-slate-800'}    rounded-3xl flex `}
            to={`/artist/${artist.id}`}
        >
            {artist.attributes.artwork?.url ? (
                <div className="shadow-lg w-full">
                    <img
                        src={constructImageUrl(
                            artist.attributes.artwork?.url,
                            600,
                            600
                        )}
                    />
                </div>
            ) : (
                <div className="shadow-lg w-full">
                    <img src={defaultPlaylistArtwork} />
                </div>
            )}

            <div className="flexw-full justify-between mb-5">
                <div className="flex-col h-full w-full overflow-hidden">
                    <h2 className="text-md truncate font-bold">
                        {artist.attributes.name}
                    </h2>
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
