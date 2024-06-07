import React from 'react'
import { FaCirclePlay, FaRegCirclePause } from 'react-icons/fa6'

import PlaySong from '../Apple/PlaySong'
import { usePlayerContext } from '../../context/PlayerContext'
import { useState } from 'react'

type TrackPropTypes = {
    trackName: String
    trackDuration: String
    songId: string
    albumTracks: Array<Song>
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
}) => {
    const { state, playSong, togglePlayPause, loadPlaylist } =
        usePlayerContext()
    const [isPlaying, setIsPlaying] = useState(false)

    //console.log('album tracks :', albumTracks)

    return (
        <div
            className={`flex border-2  rounded-lg my-2 px-3 justify-between items-center border-slate-${isPlaying ? '300' : '500'}`}
        >
            <div className="">{trackDuration}</div>
            <div className="">{trackName}</div>
            <button
                onClick={() => {
                    if (state.playlist !== albumTracks) {
                        loadPlaylist(albumTracks)
                        console.log('playlist test')
                        console.log(state.playlist)
                    }
                    if (isPlaying && songId === state.currentSong) {
                        setIsPlaying(false)
                        togglePlayPause(songId)
                    } else if (!isPlaying && songId === state.currentSong) {
                        setIsPlaying(true)
                        togglePlayPause(songId)
                    } else {
                        setIsPlaying(true)
                        playSong(songId)
                    }
                }}
            >
                {isPlaying && songId === state.currentSong ? (
                    <FaRegCirclePause />
                ) : (
                    <FaCirclePlay />
                )}
            </button>
        </div>
    )
}

export default Track
