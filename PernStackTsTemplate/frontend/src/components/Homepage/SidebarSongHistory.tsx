import React, { useEffect } from 'react'
import { useStore } from '../../store/store'
import FetchRecentHistory from '../Apple/FetchRecentHistory'
import HistoryRow from './HistoryRow'
import CollapsibleList from '../Apple/CollapsibleList'
const SidebarSongHistory = () => {
    const { recentHistory, currentSongId } = useStore(state => ({
        recentHistory: state.recentHistory,
        currentSongId: state.currentSongId,
    }))

    useEffect(() => {
        if (recentHistory.length < 1) {
            FetchRecentHistory()
        }
    }, [recentHistory])

    console.log('recent history: ', recentHistory)
    return (
        <div className="">
            {/* {recentHistory && <CollapsibleList items={recentHistory} />} */}
        </div>
    )
}

export default SidebarSongHistory
