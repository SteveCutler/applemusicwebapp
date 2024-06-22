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
            className="flex-col  w-1/5   flex justify-between"
            to={`/artist/${artistId}`}
        >
            {artUrl && (
                <div className="shadow-lg">
                    <img src={constructImageUrl(artUrl, 600, 600)} />
                </div>
            )}

            <div className="flex text-slate-800 justify-between mb-5">
                <div className="flex-col h-full overflow-hidden">
                    <h2 className="text-md truncate font-bold">{title}</h2>
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
