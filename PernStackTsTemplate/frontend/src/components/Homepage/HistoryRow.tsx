import React from 'react'
import { Link } from 'react-router-dom'

interface playlistProps {
    name: string
    artistName: string
    id: string
}
const HistoryRow: React.FC<playlistProps> = ({ name, artistName, id }) => {
    return (
        <div className="flex-col gap-2">
            <Link
                to={`/song/${id}`}
                className="text-sm flex flex-col  w-fit truncate my-3  mx-auto   font-semibold hover:text-slate-200 text-slate-800 bg-slate-300 hover:bg-slate-500  px-3 py-1 rounded-xl hover:cursor-pointer"
            >
                <span className="font-semibold">{name}</span>
                <span className="font-normal">{artistName}</span>
            </Link>
        </div>
    )
}

export default HistoryRow
