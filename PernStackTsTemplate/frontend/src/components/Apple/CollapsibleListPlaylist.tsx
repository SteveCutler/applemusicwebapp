import React, { useState } from 'react'
import HistoryRow from '../Homepage/HistoryRow'
import PlaylistRow from '../Homepage/PlaylistRow'

interface Playlists {
    items: playlist[]
}

type playlist = {
    attributes: {
        canEdit: boolean
        dataAdded: string
        isPublic: boolean
        lastModifiedDate: string
        name: string
        artwork?: {
            url: string
        }
    }
    href: string
    id: string
    type: string
}

const CollapsibleListPlaylist: React.FC<Playlists> = ({ items }) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const toggleExpanded = () => setIsExpanded(!isExpanded)

    const visibleItems = isExpanded ? items : items.slice(0, 5)

    return (
        <div>
            <ul className="shadow menu mx-auto flex w-full gap-2  items-center rounded-box ">
                {visibleItems.map((item, index) => (
                    <li key={index}>
                        <PlaylistRow
                            name={item.attributes.name}
                            id={item.id}
                            index={index}
                        />
                    </li>
                ))}
            </ul>
            {items.length > 5 && (
                <button className="mx-1 my-3 btn" onClick={toggleExpanded}>
                    {isExpanded ? 'Show Less' : 'Show More'}
                </button>
            )}
        </div>
    )
}
export default CollapsibleListPlaylist
