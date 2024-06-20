import { useMusickitContext } from '../../context/MusickitContext'
import { FaCirclePlay } from 'react-icons/fa6'
import { FaRegCirclePause } from 'react-icons/fa6'
import { IoPlayBackCircleSharp } from 'react-icons/io5'
import { IoPlayForwardCircleSharp } from 'react-icons/io5'
import Timeline from './Timeline'

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
        playlist,
        setPlaylist,
    } = useStore(state => ({
        currentSongDuration: state.currentSongDuration,
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
            <div className="flex justify-between items-center w-full">
                <Link
                    // to={`/album/${albumId}`}
                    to=""
                    className="flex gap-2 justify-start w-1/10"
                >
                    {albumArtUrl ? (
                        <img src={albumArtUrl} alt="album image" />
                    ) : (
                        <img src={defaultPlaylistArtwork} width="50" />
                    )}
                    <div className="flex w-full font-semibold">
                        {musicKitInstance?.nowPlayingItem ? (
                            musicKitInstance?.nowPlayingItem.title
                        ) : (
                            <span className="w-full"></span>
                        )}
                    </div>
                </Link>
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
