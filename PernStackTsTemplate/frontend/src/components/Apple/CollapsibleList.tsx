import React, { useState } from 'react'
import HistoryRow from '../Homepage/HistoryRow'

interface RecentHistory {
    items: Song[]
}

interface Song {
    id: string
    href?: string
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
        artwork?: {
            bgColor: string
            url: string
        }
        ratedAt?: Date
    }
}

const CollapsibleList: React.FC<RecentHistory> = ({ items }) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const toggleExpanded = () => setIsExpanded(!isExpanded)

    const visibleItems = isExpanded ? items : items.slice(0, 5)

    return (
        <div>
            <ul className="shadow px-4 mx-auto  w-full gap-2 items-center rounded-box ">
                {visibleItems.map((item, index) => (
                    <li key={index}>
                        <HistoryRow
                            name={item.attributes.name}
                            artistName={item.attributes.artistName}
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
export default CollapsibleList
