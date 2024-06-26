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
        if (!recentHistory) {
            FetchRecentHistory()
        }
    }, [recentHistory])

    FetchRecentHistory()

    console.log('recent history: ', recentHistory)
    return (
        <div className="">
            {recentHistory && <CollapsibleList items={recentHistory} />}
        </div>
    )
}

export default SidebarSongHistory
