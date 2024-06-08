import React from 'react'
import { FaCirclePlay, FaRegCirclePause } from 'react-icons/fa6'
import { MdArrowBackIosNew } from 'react-icons/md'
// import PlaySong from '../Apple/PlaySong'
// import { usePlayerContext } from '../../context/PlayerContext'
import { useState } from 'react'

import { useStore } from '../../store/store'

type TrackPropTypes = {
    trackName: string
    trackDuration: string
    songId: string
    albumTracks: Array<Song>
    trackNumber: number
}

type Song = {
    id: string
    attributes: {
        name: string
        trackNumber: number
        artistName: string
        albumName: string
        durationInMillis: number
    }
}

type PlayParameterObject = {
    catalogId: String
    id: String
    isLibrary: Boolean
    kind: String
}

const Track: React.FC<TrackPropTypes> = ({
    trackName,
    trackDuration,
    songId,
    albumTracks,
    trackNumber,
}) => {
    // const {
    //     state,
    //     playSong,

    //     togglePlayPause,
    //     loadPlaylist,
    // } = usePlayerContext()

    const [isPlaying, setIsPlaying] = useState(false)

    console.log('album tracks :', albumTracks)

    return (
        <div
            className={`flex border-2  rounded-lg my-2 px-3 justify-between items-center border-slate-300`}
            // className={`flex border-2  rounded-lg my-2 px-3 justify-between items-center border-slate-${songId === state.currentSong ? '300' : '500'}`}
        >
            <div className="">{trackDuration}</div>
            <div className="">{trackName}</div>
            <button
                onClick={() => {
                    console.log('click')
                    // if (state.playlist !== albumTracks) {
                    //     loadPlaylist(albumTracks)
                    // }
                    // if (isPlaying && songId === state.currentSong) {
                    //     setIsPlaying(false)
                    //     togglePlayPause(songId, trackName)
                    // } else if (!isPlaying && songId === state.currentSong) {
                    //     setIsPlaying(true)
                    //     togglePlayPause(songId, trackName)
                    // } else {
                    //     setIsPlaying(true)
                    //     playSong(songId, trackName)
                    // }
                }}
            >
                {/* {isPlaying && songId === state.currentSong ? (
                    <FaRegCirclePause />
                ) : ( */}
                <FaCirclePlay />
                {/* )} */}
            </button>
        </div>
    )
}

export default Track
