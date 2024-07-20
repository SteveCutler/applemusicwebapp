import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../../store/store'
import { FaCirclePlay, FaRegCirclePause } from 'react-icons/fa6'
import e from 'express'
import OptionsModal from './OptionsModal'

const SkeletonItem = ({ width }) => {
    const {
        isPlaying,
        darkMode,
        authorizeMusicKit,
        queueToggle,
        playSong,
        setPlaylist,
        pause,
        playlist,
        musicKitInstance,
    } = useStore(state => ({
        pause: state.pauseSong,
        darkMode: state.darkMode,
        playSong: state.playSong,
        queueToggle: state.queueToggle,
        isPlaying: state.isPlaying,
        musicKitInstance: state.musicKitInstance,
        authorizeMusicKit: state.authorizeMusicKit,
        setAlbumData: state.setAlbumData,
        albumData: state.albumData,
        setPlaylist: state.setPlaylist,
        playlist: state.playlist,
    }))

    const [loading, setLoading] = useState<Boolean>(false)

    const style = { fontSize: '2rem', color: 'dodgerblue ' }

    // const handleNavigation = (e: React.MouseEvent) => {
    //     e.preventDefault()
    //     e.stopPropagation()

    //     navigate(`/song/${song.id}`)
    // }

    const navigate = useNavigate()

    return (
        <div
            // onClick={handleNavigation}
            className={` select-none  w-full pt-1 flex-col ${width ? width : queueToggle ? 'w-3/12' : ' w-2/12'}  ${darkMode ? 'text-slate-300' : 'text-slate-800'}     flex `}
        >
            <div className=" relative flex-col h-full animate-pulse bg-blue-500 rounded-lg mb-2 w-full flex flex-shrink  ">
                {/* <img
                    className="shadow-lg"
                    src={constructImageUrl(song.attributes.artwork?.url, 600)}
                    style={{ width: '1000px' }}
                /> */}
                <div
                    className="rounded-lg "
                    style={{ width: '600px', height: '150px' }}
                ></div>
                {/* <div className={` absolute bottom-1 right-1 `}></div> */}
            </div>

            <div className="flex w-full justify-between mb-5">
                <div className="flex-col rounded-lg bg-blue-400 w-full h-20 overflow-hidden">
                    <h2 className="text-md truncate font-bold">
                        {/* {song.attributes.name} */}
                    </h2>
                    <div className="flex items-center justify-between">
                        <h3 className="truncate">
                            {/* {song.attributes.artistName} */}
                        </h3>
                        <h3 className="text-sm font-bold">
                            {/* {song.attributes.releaseDate.split('-')[0]} */}
                        </h3>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SkeletonItem
