import { useMusickitContext } from '../../context/MusickitContext'
import { FaCirclePlay } from 'react-icons/fa6'
import { FaRegCirclePause } from 'react-icons/fa6'
import { IoPlayBackCircleSharp } from 'react-icons/io5'
import { IoPlayForwardCircleSharp } from 'react-icons/io5'
import Timeline from './Timeline'
import { LuShuffle, LuRepeat, LuRepeat1 } from 'react-icons/lu'
import { FaListOl } from 'react-icons/fa'

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
        queueToggle,
        setQueueToggle,
    } = useStore(state => ({
        repeat: state.repeat,
        queueToggle: state.queueToggle,
        setQueueToggle: state.setQueueToggle,
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

    const handleQueueToggle = (e: any) => {
        setQueueToggle()
    }

    const albumId =
        musicKitInstance?.nowPlayingItem?.relationships?.albums?.data[0]?.id

    const style = { fontSize: '1.5em' }

    return (
        <div className="footer px-5 flex  items-center justify-between  bg-slate-900">
            <div className="flex justify-between items-center mt-3 w-full">
                <div
                    // to={`/album/${albumId}`}

                    className="flex  gap-2 justify-start w-1/4"
                >
                    {albumArtUrl && (
                        <img
                            src={albumArtUrl}
                            alt="album image"
                            className="w-1/3"
                        />
                    )}
                    <div className="flex flex-col w-full justify-center items-start text-xs font-normal">
                        {musicKitInstance?.nowPlayingItem ? (
                            <>
                                <div className="font-semibold w-full flex flex-grow">
                                    {
                                        musicKitInstance?.nowPlayingItem
                                            .attributes.name
                                    }
                                </div>
                                <div>
                                    {
                                        playlist[
                                            musicKitInstance
                                                ?.nowPlayingItemIndex
                                        ].attributes.albumName
                                    }
                                </div>
                            </>
                        ) : (
                            <span className="flex flex-grow w-full"></span>
                        )}
                    </div>
                </div>
                <div className="flex flex-col justify-between items-around gap-3  w-1/2 mx-auto ">
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
                    <div className="">
                        <Timeline />
                    </div>
                </div>
            </div>
            <div className="w-1/4 flex items-center justify-end mx-5">
                <button
                    className={` ${queueToggle && 'bg-slate-300'} btn flex rounded-full items-center justify-end btn-primary`}
                    title="Display Queue"
                    onClick={e => {
                        e.preventDefault()
                        handleQueueToggle(e)
                    }}
                >
                    <FaListOl style={style} />
                </button>{' '}
                <VolumeSlider />
            </div>
        </div>
    )
}

export default Footer
