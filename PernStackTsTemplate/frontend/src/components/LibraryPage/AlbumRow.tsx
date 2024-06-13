import React from 'react'
import { Link } from 'react-router-dom'

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

const AlbumRow: React.FC<AlbumProps> = ({
    albumId,
    // href,
    // type,
    name,
    artistName,
    artworkUrl,
    trackCount,
}) => {
    return (
        <>
            <Link
                to={`/album/${albumId}`}
                className="flex border-2 border-slate-400 hover:border-slate-300 hover:scale{1.01} hover:text-slate-200 my-3 rounded-lg px-3 items-center justify-between h-10"
            >
                {artworkUrl ? (
                    <img src={artworkUrl} width="25" height="25" />
                ) : (
                    <span></span>
                )}
                <span className="">{artistName}</span>
                <span className="">{name}</span>
                <span className="">{trackCount}</span>
            </Link>
        </>
    )
}

export default AlbumRow
