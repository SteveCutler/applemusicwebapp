import { IoHomeSharp } from 'react-icons/io5'
import { FaSearch } from 'react-icons/fa'
import { LuLibrary } from 'react-icons/lu'
import { ImStack } from 'react-icons/im'
import { FaHistory } from 'react-icons/fa'
import { Link } from 'react-router-dom'

import { LogOut } from 'lucide-react'
import LogoutButton from './LogoutButton'
import { useStore } from '../../store/store'
import TrackDisplay from '../AlbumPage/TrackDisplay'
import QueueTrackDisplay from './QueueTrackDisplay'

const QueueDisplay = () => {
    const { playlist, isPlaying, musicKitInstance, currentSongId } = useStore(
        state => ({
            playlist: state.playlist,

            currentSongId: state.currentSongId,
            isPlaying: state.isPlaying,
            musicKitInstance: state.musicKitInstance,
        })
    )

    // const retrieveCurrentIndex = () => {
    //     if(musicKitInstance?.nowPlayingItem){

    //         const index = playlist.indexOf(musicKitInstance?.nowPlayingItemIndex)
    //     }

    // }
    console.log('current queue: ', musicKitInstance?.queue)
    if (musicKitInstance?.queue.items.length >= 1) {
        return (
            <div className="flex-col flex select-none h-full ">
                <div className="flex-col m-2 pt-10 pb-5 w-full   px-1 font-semibold text-slate-200 text-2xl items-center mx-auto justify-start text-center">
                    <div className="border-b-2 border-slate-600 pb-3">
                        {playlist && musicKitInstance?.nowPlayingItem && (
                            <>
                                <h1 className="text-3xl pb-3 font-bold text-white">
                                    Now playing:
                                </h1>
                                <QueueTrackDisplay
                                    key={musicKitInstance?.nowPlayingItemIndex}
                                    song={musicKitInstance?.nowPlayingItem}
                                    index={
                                        musicKitInstance?.nowPlayingItemIndex
                                    }
                                    // albumId={
                                    //     musicKitInstance?.nowPlayingItem
                                    //         .container.id
                                    // }
                                />
                            </>
                        )}
                    </div>
                    <div className="pt-3 ">
                        <h1 className="text-3xl pb-3  font-bold text-white">
                            Coming up:
                        </h1>
                        {playlist &&
                            musicKitInstance?.nowPlayingItem &&
                            musicKitInstance.queue.items
                                .slice(
                                    musicKitInstance?.nowPlayingItemIndex + 1
                                )
                                .map((song, index) => (
                                    <QueueTrackDisplay
                                        key={index}
                                        song={song}
                                        index={index}
                                        // albumId={song}
                                    />
                                ))}
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className="flex-col flex select-none h-full ">
                <div className="flex-col m-2 pt-10 pb-5 w-full   px-1 font-semibold text-slate-200 text-2xl items-center mx-auto justify-start text-center">
                    No items in queue...
                </div>
            </div>
        )
    }
}

export default QueueDisplay
