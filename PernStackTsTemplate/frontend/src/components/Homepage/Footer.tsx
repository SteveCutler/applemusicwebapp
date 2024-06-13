import { useMusickitContext } from '../../context/MusickitContext'
import { FaCirclePlay } from 'react-icons/fa6'
import { FaRegCirclePause } from 'react-icons/fa6'
import { IoPlayBackCircleSharp } from 'react-icons/io5'
import { IoPlayForwardCircleSharp } from 'react-icons/io5'
import Timeline from './Timeline'

import { useStore } from '../../store/store'
import VolumeSlider from './VolumeSlider'

function Footer() {
    // const { musicInstance } = useMusickitContext()
    // const [playbackState, setPlaybackState] = useState(2)
    const {
        playSong,
        pauseSong,
        isPlaying,
        musicKitInstance,
        setCurrentSongIndex,
        setCurrrentSongId,
        authorizeMusicKit,
        switchTrack,
        currentElapsedTime,
        currentSongIndex,
        currentSongId,
        currentSongDuration,
        nextSong,
        previousSong,
        playlist,
        setPlaylist,
    } = useStore(state => ({
        currentSongDuration: state.currentSongDuration,
        switchTrack: state.switchTrack,
        currentElapsedTime: state.currentElapsedTime,
        pauseSong: state.pauseSong,
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

    const playPauseHandler = (e: any) => {
        e.preventDefault()
        isPlaying ? pauseSong() : playSong()
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
            <div className="flex gap-1 mx-auto w-1/4 justify-start mx-10">
                <button
                    className="btn flex rounded-full items-center justify-center btn-primary"
                    onClick={e => playPrev(e)}
                >
                    <IoPlayBackCircleSharp style={style} />
                </button>
                <button
                    className="btn flex items-center rounded-full justify-center btn-primary"
                    onClick={e => playPauseHandler(e)}
                >
                    {isPlaying ? (
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
            <div className="flex-col w-1/2">
                <div className="flex justify-center font-bold w-full">
                    {musicKitInstance?.nowPlayingItem &&
                        musicKitInstance?.nowPlayingItem.title}
                </div>
                <div className="flex w-full ">
                    <Timeline />
                </div>
            </div>
            <div className="w-1/4 flex justify-end mx-5">
                {' '}
                <VolumeSlider />
            </div>
        </div>
    )
}

export default Footer
