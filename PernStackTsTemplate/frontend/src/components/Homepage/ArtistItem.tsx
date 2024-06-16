import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../../store/store'
import { FaCirclePlay, FaRegCirclePause } from 'react-icons/fa6'

interface AlbumPropTypes {
    title: string
    artistId: string
    artUrl?: string
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

const ArtistItem: React.FC<AlbumPropTypes> = ({ title, artistId, artUrl }) => {
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
            className="flex-col border-2 shadow-lg hover:bg-slate-500 bg-slate-600 w-1/5   border-white p-3 rounded-3xl flex justify-between"
            to={`/artist/${artistId}`}
        >
            {artUrl && (
                <div className="">
                    <img src={constructImageUrl(artUrl, 500, 500)} />
                </div>
            )}

            <div className="flex justify-between h-full pt-2">
                <div className="flex-col">
                    <h2 className="text-xl font-bold">{title}</h2>
                </div>
                <div className="flex-col justify-between pt-3"></div>
            </div>
        </Link>
    )
}

export default ArtistItem
