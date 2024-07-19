import { IoHomeSharp, IoSettingsSharp } from 'react-icons/io5'
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
import { MdOutlineDarkMode, MdOutlineLogin, MdSunny } from 'react-icons/md'
import { TbLayoutSidebarRightCollapse } from 'react-icons/tb'

const QueueDisplay = () => {
    const {
        playlist,
        isPlaying,
        darkMode,
        musicKitInstance,
        setQueueToggle,
        setDarkMode,
        queueToggle,
        currentSongId,
    } = useStore(state => ({
        playlist: state.playlist,
        setDarkMode: state.setDarkMode,
        darkMode: state.darkMode,
        queueToggle: state.queueToggle,
        setQueueToggle: state.setQueueToggle,
        currentSongId: state.currentSongId,
        isPlaying: state.isPlaying,
        musicKitInstance: state.musicKitInstance,
    }))

    const collapseQueue = () => {
        setQueueToggle()
    }
    // const retrieveCurrentIndex = () => {
    //     if(musicKitInstance?.nowPlayingItem){

    //         const index = playlist.indexOf(musicKitInstance?.nowPlayingItemIndex)
    //     }

    // }
    console.log('current queue: ', musicKitInstance?.queue)
    const style = { fontSize: '1.8rem' }

    return (
        <div className="flex-col flex select-none relative h-full ">
            <div
                title="collapse queue"
                onClick={collapseQueue}
                className=" text-white absolute top-1 left-1 hover:cursor-pointer  hover:text-slate-400"
            >
                <TbLayoutSidebarRightCollapse style={style} />
            </div>
            <div
                className={` ${!queueToggle && 'hidden'} absolute top-1 right-11 text-2xl hover:cursor-pointer hover:text-slate-500`}
                title="toggle dark mode"
                onClick={() => {
                    {
                        darkMode ? setDarkMode(false) : setDarkMode(true)
                    }
                }}
            >
                {darkMode ? <MdSunny /> : <MdOutlineDarkMode />}
            </div>
            <Link
                to="/settings"
                className={`hover:cursor-pointer ${!queueToggle && 'hidden'} absolute  text-2xl top-1 right-3 hover:text-slate-500`}
                title="settings"
            >
                <IoSettingsSharp />
            </Link>
            <div className="flex-col m-2 pt-10 pb-5 w-full   px-1 font-semibold text-slate-200 text-2xl items-center mx-auto justify-start text-center">
                <div className="border-b-2 border-slate-600 pb-3">
                    {playlist &&
                        musicKitInstance?.queue.items &&
                        musicKitInstance?.nowPlayingItem && (
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
                            .slice(musicKitInstance?.nowPlayingItemIndex + 1)
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
}

export default QueueDisplay
