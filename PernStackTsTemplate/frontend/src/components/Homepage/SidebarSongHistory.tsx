import React from 'react'
import { useStore } from '../../store/store'
import FetchRecentHistory from '../Apple/FetchRecentHistory'
import HistoryRow from './HistoryRow'

const SidebarSongHistory = () => {
    const { recentHistory } = useStore(state => ({
        recentHistory: state.recentHistory,
    }))

    FetchRecentHistory()

    console.log('recent history: ', recentHistory)
    return (
        <div className="flex-col w-full items-center justify-left ">
            {recentHistory &&
                recentHistory.map(track => (
                    <HistoryRow
                        name={track.attributes.name}
                        artistName={track.attributes.artistName}
                        id={track.id}
                    />
                    // <div className="flex justify-center items-center">
                    //     <div className="flex-col justify-center items-center">
                    //         -
                    //     </div>
                    //     <div className="flex-col border-2 border-white flex justify-start items-center w-full">
                    //         <span className="text-sm w-full font-bold">
                    //             {track.attributes.name}
                    //         </span>
                    //         <span className="text-sm w-full font-normal">
                    //             {track.attributes.artistName}
                    //         </span>
                    //     </div>
                    // </div>
                ))}
        </div>
    )
}

export default SidebarSongHistory
