import { useMusickitContext } from '../../context/MusickitContext'
import { FaCirclePlay } from 'react-icons/fa6'
import { FaRegCirclePause } from 'react-icons/fa6'
import { IoPlayBackCircleSharp } from 'react-icons/io5'
import { IoPlayForwardCircleSharp } from 'react-icons/io5'
import Timeline from './Timeline'
import { LuShuffle, LuRepeat, LuRepeat1 } from 'react-icons/lu'

import { useStore } from '../../store/store'
import VolumeSlider from './VolumeSlider'
import { Link } from 'react-router-dom'
import defaultPlaylistArtwork from '../../assets/images/defaultPlaylistArtwork.png'

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
        albumArtUrl,
        currentSongId,
        currentSongDuration,
        nextSong,
        previousSong,
        shuffle,
        setShuffle,
        repeat,
        setRepeat,
        playlist,
        setPlaylist,
    } = useStore(state => ({
        repeat: state.repeat,
        setRepeat: state.setRepeat,
        currentSongDuration: state.currentSongDuration,
        shuffle: state.shuffle,
        setShuffle: state.setShuffle,
        switchTrack: state.switchTrack,
        currentElapsedTime: state.currentElapsedTime,
        albumArtUrl: state.albumArtUrl,
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

    const albumId =
        musicKitInstance?.nowPlayingItem?.relationships?.albums?.data[0]?.id

    const style = { fontSize: '1.5em' }

    return (
        <div className="footer p-5 flex  items-center justify-between h-20 bg-slate-900">
            <div className="flex justify-between items-center w-full">
                <Link
                    // to={`/album/${albumId}`}
                    to=""
                    className="flex gap-2 justify-start w-1/4"
                >
                    {albumArtUrl && (
                        <img
                            src={albumArtUrl}
                            alt="album image"
                            className="w-1/4 h-10"
                        />
                    )}
                    <div className="flex w-full font-semibold">
                        {musicKitInstance?.nowPlayingItem ? (
                            musicKitInstance?.nowPlayingItem.title
                        ) : (
                            <span className="flex flex-grow w-full"></span>
                        )}
                    </div>
                </Link>
                <div className="flex flex-col justify-center mt-5 w-full ">
                    <div className="w-3/5 mx-auto">
                        <Timeline />
                    </div>
                    <div className="flex gap-1 mx-auto w-1/4 justify-center mx-10">
                        <button
                            className={` ${shuffle && 'bg-slate-300'} btn flex rounded-full mx-2 items-center justify-center btn-primary`}
                            onClick={e => {
                                e.preventDefault()
                                setShuffle()
                            }}
                        >
                            <LuShuffle style={style} />
                        </button>
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
                        <button
                            className={` ${repeat && 'bg-slate-300'} btn flex rounded-full mx-2 items-center justify-center btn-primary`}
                            onClick={e => {
                                e.preventDefault()
                                setRepeat()
                            }}
                        >
                            {repeat === 2 ? (
                                <LuRepeat1 style={style} />
                            ) : (
                                <LuRepeat style={style} />
                            )}
                        </button>
                    </div>
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
