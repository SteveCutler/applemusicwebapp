import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../../store/store'
import { FaCirclePlay, FaRegCirclePause } from 'react-icons/fa6'

interface AlbumPropTypes {
    artist: Artist
    carousel?: boolean
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

const ArtistItem: React.FC<AlbumPropTypes> = ({ artist, carousel }) => {
    const constructImageUrl = (url: String, width: Number, height: Number) => {
        return url
            .replace('{w}', width.toString())
            .replace('{h}', height.toString())
    }

    const { isPlaying } = useStore(state => ({
        isPlaying: state.isPlaying,
    }))

    const [loading, setLoading] = useState<Boolean>(false)

    const style = { fontSize: '2rem', color: 'royalblue ' }

    return (
        <Link
            className={`${carousel && 'carousel-item'} select-none flex-col w-1/4 flex-grow text-slate-800 hover:text-slate-200  rounded-3xl flex`}
            to={`/artist/${artist.id}`}
        >
            {artist.attributes.artwork?.url && (
                <div className="shadow-lg w-full">
                    <img
                        src={constructImageUrl(
                            artist.attributes.artwork?.url,
                            600,
                            600
                        )}
                    />
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
