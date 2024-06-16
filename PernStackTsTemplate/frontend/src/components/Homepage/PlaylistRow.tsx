import React from 'react'
import { Link } from 'react-router-dom'

interface playlistProps {
    name: string
    id: string
}
const PlaylistRow: React.FC<playlistProps> = ({ name, id }) => {
    return (
        <div className="flex-col gap-2">
            <Link
                to={`/playlist/${id}`}
                className="text-sm flex  my-3 w-fit  mx-auto   font-semibold hover:text-slate-200 text-slate-800 bg-slate-300 hover:bg-slate-500  px-3 py-1 rounded-xl hover:cursor-pointer"
            >
                {name}
            </Link>
        </div>
    )
}

export default PlaylistRow
