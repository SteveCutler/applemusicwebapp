import { useMusickitContext } from '../../context/MusickitContext'
import { FaCirclePlay } from 'react-icons/fa6'
import { FaRegCirclePause } from 'react-icons/fa6'
import { IoPlayBackCircleSharp } from 'react-icons/io5'
import { IoPlayForwardCircleSharp } from 'react-icons/io5'
import { useState } from 'react'
import { usePlayerContext } from '../../context/PlayerContext'
import { next } from '../../reducers/Actions'

function Footer() {
    const { musicInstance } = useMusickitContext()
    // const [playbackState, setPlaybackState] = useState(2)
    const {
        state,
        playSong,
        pauseSong,
        nextSong,
        previousSong,
        togglePlayPause,
    } = usePlayerContext()

    if (musicInstance) {
        console.log('music state ' + musicInstance.playbackMode)
    }
    console.log(state.currentSongTitle)

    const changeState = (e: any) => {
        e.preventDefault()
        if (state.currentSongTitle) {
            togglePlayPause(null, state.currentSongTitle)
        }
    }
    const playPrev = (e: any) => {
        e.preventDefault()
        previousSong()
    }
    const playNext = (e: any) => {
        e.preventDefault()
        nextSong()
    }

    const style = { fontSize: '1.5em' }

    return (
        <div className="footer p-5 flex items-center justify-between h-20 bg-slate-900">
            <p>test</p>
            <div className="flex gap-1">
                <button
                    className="btn flex rounded-full items-center justify-center btn-primary"
                    onClick={e => playPrev(e)}
                >
                    <IoPlayBackCircleSharp style={style} />
                </button>
                <button
                    className="btn flex items-center rounded-full justify-center btn-primary"
                    onClick={e => changeState(e)}
                >
                    {musicInstance && state.isPlaying === true ? (
                        <FaRegCirclePause style={style} />
                    ) : (
                        <FaCirclePlay style={style} />
                    )}
                </button>
                <button
                    className="btn flex rounded-full items-center justify-center btn-primary"
                    onClick={e => playNext(e)}
                >
                    <IoPlayForwardCircleSharp style={style} />
                </button>
            </div>
            <p>{state.currentSongTitle}</p>
        </div>
    )
}

export default Footer
