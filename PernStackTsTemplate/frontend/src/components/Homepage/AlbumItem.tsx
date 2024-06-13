import React from 'react'
import { Link } from 'react-router-dom'

interface AlbumPropTypes {
    title: String
    artistName: String
    albumArtUrl: String
    albumId: String
    type: string
}

const AlbumItem: React.FC<AlbumPropTypes> = ({
    title,
    artistName,
    albumArtUrl,
    albumId,
    type,
}) => {
    const constructImageUrl = (url: String, width: Number, height: Number) => {
        return url
            .replace('{w}', width.toString())
            .replace('{h}', height.toString())
    }

    return (
        <Link
            className="flex-col border-2 shadow-lg hover:bg-slate-500 bg-slate-600 w-1/5 mt-10  border-white p-3 rounded-3xl flex justify-between"
            to={
                albumId.startsWith('p')
                    ? `/playlist/${albumId}`
                    : `/album/${albumId}`
            }
        >
            <div className="">
                <img src={constructImageUrl(albumArtUrl, 500, 500)} />
            </div>
            <div className="">
                <h2 className="text-xl font-bold">{title}</h2>
                <h3>{artistName}</h3>
            </div>
        </Link>
    )
}

export default AlbumItem
