import { useMusickitContext } from '../../context/MusickitContext'
import { FaCirclePlay } from 'react-icons/fa6'
import { FaRegCirclePause } from 'react-icons/fa6'
import { IoPlayBackCircleSharp } from 'react-icons/io5'
import { IoPlayForwardCircleSharp } from 'react-icons/io5'
import { useState } from 'react'
import { usePlayerContext } from '../../context/PlayerContext'

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

    const changeState = (e: any) => {
        e.preventDefault()
        togglePlayPause(null)
    }

    const style = { fontSize: '1.5em' }

    return (
        <div className="footer p-5 flex items-center justify-between h-20 bg-slate-900">
            <p>test</p>
            <div className="flex gap-1">
                <button
                    className="btn flex rounded-full items-center justify-center btn-primary"
                    onClick={() => previousSong}
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
                    onClick={() => nextSong}
                >
                    <IoPlayForwardCircleSharp style={style} />
                </button>
            </div>
            <p>{state.currentSong && state.currentSong}</p>
        </div>
    )
}

export default Footer
