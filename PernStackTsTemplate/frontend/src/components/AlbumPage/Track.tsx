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
    index: number
}

interface Song {
    id: string
    type: string
    attributes: {
        name: string
        trackNumber: number
        artistName: string
        albumName: string
        durationInMillis: number
        playParams: {
            catalogId: string
        }
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
    index,
    trackNumber,
}) => {
    //const albumSongs = albumTracks.data
    // const {
    //     state,
    //     playSong,

    //     togglePlayPause,
    //     loadPlaylist,
    // } = usePlayerContext()

    // const [isPlaying, setIsPlaying] = useState(false)
    const {
        playSong,
        pauseSong,
        isPlaying,
        musicKitInstance,
        setCurrentSongIndex,
        setCurrrentSongId,
        authorizeMusicKit,
        switchTrack,
        currentSongIndex,
        currentElapsedTime,
        currentSongDuration,
        currentSongId,
        playlist,
        nextSong,
        previousSong,
        setPlaylist,
    } = useStore(state => ({
        switchTrack: state.switchTrack,
        currentElapsedTime: state.currentElapsedTime,
        pauseSong: state.pauseSong,
        currentSongDuration: state.currentSongDuration,
        nextSong: state.nextSong,
        previousSong: state.previousSong,
        setCurrentSongIndex: state.setCurrentSongIndex,
        currentSongId: state.currentSongId,
        setCurrrentSongId: state.setCurrentSongId,
        currentSongIndex: state.currentSongIndex,
        playlist: state.playlist,
        authorizeMusicKit: state.authorizeMusicKit,
        isPlaying: state.isPlaying,
        musicKitInstance: state.musicKitInstance,
        playSong: state.playSong,
        setPlaylist: state.setPlaylist,
    }))

    const initializeMusic = async () => {
        await setPlaylist(albumTracks, index)
    }

    const pause = async () => {
        await pauseSong()
    }
    const setSongIndex = async (index: number) => {
        await setCurrentSongIndex(index)
    }
    const play = async () => {
        playSong()
    }

    const convertToDuration = (milliseconds: number) => {
        if (typeof milliseconds !== 'number' || milliseconds < 0) {
            return `0:00`
        }

        const totalSeconds = Math.floor(milliseconds / 1000)
        const minutes = Math.floor(totalSeconds / 60)
        const seconds = totalSeconds % 60

        const formattedMinutes = minutes.toString().padStart(2, '0')
        const formattedSeconds = seconds.toString().padStart(2, '0')

        return `${formattedMinutes}:${formattedSeconds}`
    }

    const style = { color: 'white' }

    const timeLeft = () => {
        if (currentSongDuration == null || currentElapsedTime == null) {
            return trackDuration
        }
        if (
            typeof currentSongDuration !== 'number' ||
            typeof currentElapsedTime !== 'number'
        ) {
            console.error(
                'Invalid types for currentSongDuration or currentElapsedTime',
                {
                    currentSongDuration,
                    currentElapsedTime,
                }
            )
            return trackDuration
        }
        if (currentSongDuration < 0 || currentElapsedTime < 0) {
            console.error(
                'Negative values for currentSongDuration or currentElapsedTime',
                {
                    currentSongDuration,
                    currentElapsedTime,
                }
            )
            return trackDuration
        }
        if (isPlaying && songId === currentSongId) {
            const safeElapsedTime = Math.max(currentElapsedTime, 0)
            return convertToDuration(currentSongDuration - safeElapsedTime)
        }
        return trackDuration
    }

    const playPauseHandler = async () => {
        if (playlist !== albumTracks) {
            // console.log('adding album to playlist')
            await initializeMusic()
            // await setCurrrentSongId(playlist[index].id)
            await play()

            return
        }

        if (songId === currentSongId) {
            // console.log('songId is current song')
            if (isPlaying) {
                // console.log('is playing: pausing')
                await pause()
            } else {
                // console.log('isnt playing: playing')
                await play()
                // setCurrrentSongId()
            }
        } else {
            // console.log('isnt playing: setting track')
            await switchTrack(index)
            // setCurrrentSongId()
        }
    }

    return (
        <div
            //className={`flex border-2  rounded-lg my-2 px-3 justify-between items-center border-slate-300`}
            className={`flex border-2  rounded-lg my-2 px-3 justify-between items-center border-slate-${isPlaying && songId === currentSongId ? '300' : '700'}`}
        >
            <div
                className={
                    isPlaying && songId === currentSongId
                        ? 'font-bold text-slate-200'
                        : ''
                }
            >
                {timeLeft()}
            </div>
            <div
                className={
                    isPlaying && songId === currentSongId
                        ? 'font-bold text-slate-200'
                        : ''
                }
            >
                {trackName}
            </div>
            <button onClick={playPauseHandler}>
                {isPlaying && songId === currentSongId ? (
                    <FaRegCirclePause style={style} />
                ) : (
                    <FaCirclePlay />
                )}
            </button>
        </div>
    )
}

export default Track
