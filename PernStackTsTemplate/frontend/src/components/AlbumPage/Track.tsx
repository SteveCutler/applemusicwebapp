import React from 'react'
import { FaCirclePlay, FaRegCirclePause } from 'react-icons/fa6'

import { Link } from 'react-router-dom'
// import PlaySong from '../Apple/PlaySong'
// import { usePlayerContext } from '../../context/PlayerContext'

import { useStore } from '../../store/store'

type TrackPropTypes = {
    song: Song
    trackDuration: number
    albumTracks?: Song[]
    index: number
    first?: boolean
    last?: boolean
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
    }
}

const Track: React.FC<TrackPropTypes> = ({
    song,
    albumTracks,
    index,
    first,
    trackDuration,
    last,
}) => {
    //const albumSongs = albumTracks.data
    // const {
    //     state,
    //     playSong,

    //     togglePlayPause,
    //     loadPlaylist,
    // } = usePlayerContext()

    // const [isPlaying, setIsPlaying] = useState(false)

    // console.log('album tracks:', albumTracks)
    const {
        playSong,
        pauseSong,
        isPlaying,

        setCurrentSongIndex,

        switchTrack,

        currentElapsedTime,

        currentSongDuration,
        currentSongId,
        playlist,
        darkMode,

        setPlaylist,
    } = useStore(state => ({
        switchTrack: state.switchTrack,
        darkMode: state.darkMode,
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

    const initializeMusic = () => {
        if (albumTracks) {
            // console.log('album tracks ', albumTracks)
            setPlaylist(albumTracks, index, true)
        }
    }

    const pause = async () => {
        await pauseSong()
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

    const style = { color: 'white', fontSize: '1.3rem' }
    const styleBlue = { color: 'dodgerblue', fontSize: '1.3rem' }

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
        if (isPlaying && song.id === currentSongId) {
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
            // await play()

            return
        }

        if (song.id === currentSongId) {
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
        <Link
            to={`/song/${song.id}`}
            state={{
                song: {
                    id: song.id,
                    href: song.attributes.url,
                    type: 'songs',
                    attributes: {
                        id: song.id,
                        name: song.attributes.name,
                        trackNumber: song.attributes.trackNumber,
                        artistName: song.attributes.artistName,
                        albumName: song.attributes.albumName,
                        durationInMillis: song.attributes.durationInMillis,

                        artwork: {
                            bgColor: song.attributes.artwork?.bgColor,
                            url: song.attributes.artwork?.url,
                        },
                    },
                },
            }}
            //className={`flex border-2  rounded-lg my-2 px-3 justify-between items-center border-slate-300`}
            className={`flex border-x-2 w-full border-b-2 ${first && 'border-y-2 rounded-t-xl'}  ${last ? 'rounded-b-xl' : ''} ${darkMode ? 'text-slate-100 hover:text-slate-500 border-slate-200' : 'text-slate-900 hover:text-slate-700 border-black'}  select-none  ${isPlaying && song.id === currentSongId ? `` : ``}  p-1 font-normal justify-between items-center `}
        >
            <div
                className={
                    darkMode
                        ? 'font-bold text-slate-100'
                        : 'font-bold text-slate-800'
                }
            >
                {timeLeft()}
            </div>
            <div className="flex justify-start truncate w-full ps-5 gap-1">
                <div
                    className={` truncate
                        ${
                            isPlaying && song.id === currentSongId
                                ? ' text-slate-300'
                                : ''
                        }
                        w-full flex justify-start
                    `}
                >
                    {song.attributes.name}
                </div>
                {/* <p className="text-slate-100"> / </p> */}
                {/* <div
                    className={`truncate max-w-1/5
                        ${
                            isPlaying && song.id === currentSongId
                                ? 'font-bold text-slate-200'
                                : 'font-semibold text-slate-500'
                        }
                    `}
                >
                    {song.attributes.artistName}
                </div> */}
            </div>
            <button
                onClick={e => {
                    e.preventDefault()
                    e.stopPropagation()
                    initializeMusic()
                }}
                className="transform hover:scale-110 items-center flex active:scale-95 transition-transform duration-100 easy-ease"
            >
                {isPlaying && song.id === currentSongId ? (
                    <FaRegCirclePause style={style} />
                ) : (
                    <FaCirclePlay style={styleBlue} />
                )}
            </button>
        </Link>
    )
}

export default Track
