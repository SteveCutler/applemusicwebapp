import { FaCirclePlay, FaRegCirclePause } from 'react-icons/fa6'
import {
    IoPlayBackCircleSharp,
    IoPlayForwardCircleSharp,
} from 'react-icons/io5'
import { LuShuffle, LuRepeat, LuRepeat1 } from 'react-icons/lu'
import { FaListOl } from 'react-icons/fa'
import Timeline from './Timeline'
import VolumeSlider from './VolumeSlider'
import { useStore } from '../../store/store'
import { useNavigate } from 'react-router-dom'
import defaultPlaylistArtwork from '../../assets/images/defaultPlaylistArtwork.png'

function Footer() {
    const {
        isPlaying,
        isPlayingPodcast,
        playSong,
        pauseSong,
        nextSong,
        previousSong,
        playPodcast,
        pausePodcast,
        stopPodcast,
        podcastUrl,
        currentElapsedTime,
        albumArtUrl,
        musicKitInstance,
        shuffle,
        setShuffle,
        repeat,
        setRepeat,
        queueToggle,
        setQueueToggle,
    } = useStore(state => ({
        isPlaying: state.isPlaying,
        isPlayingPodcast: state.isPlayingPodcast,
        playSong: state.playSong,
        pauseSong: state.pauseSong,
        nextSong: state.nextSong,
        previousSong: state.previousSong,
        playPodcast: state.playPodcast,
        pausePodcast: state.pausePodcast,
        stopPodcast: state.stopPodcast,
        podcastUrl: state.podcastUrl,
        currentElapsedTime: state.currentElapsedTime,
        albumArtUrl: state.albumArtUrl,
        musicKitInstance: state.musicKitInstance,
        shuffle: state.shuffle,
        setShuffle: state.setShuffle,
        repeat: state.repeat,
        setRepeat: state.setRepeat,
        queueToggle: state.queueToggle,
        setQueueToggle: state.setQueueToggle,
    }))

    const navigate = useNavigate()

    const playPauseHandler = e => {
        e.preventDefault()
        if (isPlayingPodcast) {
            pausePodcast()
        } else if (isPlaying) {
            pauseSong()
        } else {
            podcastUrl ? playPodcast(podcastUrl) : playSong()
        }
    }

    const playPrev = e => {
        e.preventDefault()
        previousSong()
    }

    const playNext = e => {
        e.preventDefault()
        nextSong()
    }

    const handleQueueToggle = e => {
        setQueueToggle()
    }

    const style = { fontSize: '3em' }
    const styleSmall = { fontSize: '2em' }

    return (
        <div className="footer px-5 flex items-center justify-between bg-gradient-to-b from-gray-900 to-black">
            <div className="flex justify-between items-center mt-3 w-full">
                <div className="flex gap-2 justify-start hover:cursor-pointer hover:text-white w-1/4">
                    {albumArtUrl ? (
                        <img
                            src={albumArtUrl}
                            alt="album image"
                            style={{ width: '70px' }}
                            className="hover:scale-105"
                        />
                    ) : (
                        isPlaying && (
                            <img
                                src={defaultPlaylistArtwork}
                                alt="album image"
                                style={{ width: '70px' }}
                                className="hover:scale-105"
                            />
                        )
                    )}
                    <div className="flex flex-col w-full justify-center items-start text-xs font-normal">
                        {musicKitInstance?.nowPlayingItem ? (
                            <>
                                <div className="font-semibold hover:cursor-pointer hover:text-white w-full flex-col">
                                    <div>
                                        {
                                            musicKitInstance?.nowPlayingItem
                                                .attributes.name
                                        }
                                    </div>
                                    <div>
                                        {musicKitInstance.queue.items &&
                                            musicKitInstance.queue.items[
                                                musicKitInstance
                                                    ?.nowPlayingItemIndex
                                            ].attributes.albumName}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="hover:cursor-pointer hover:text-white">
                                        {musicKitInstance.queue.items &&
                                            musicKitInstance.queue.items[
                                                musicKitInstance
                                                    ?.nowPlayingItemIndex
                                            ].attributes.artistName}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <span className="flex flex-grow w-full"></span>
                        )}
                    </div>
                </div>
                <div className="flex flex-col justify-between items-around gap-3 w-1/2 mx-auto">
                    <div className="flex gap-1 mx-auto w-1/4 justify-center mx-10">
                        <button
                            className={`${shuffle && 'text-blue-600'} flex rounded-full mx-2 items-center justify-center active:scale-95`}
                            onClick={e => {
                                e.preventDefault()
                                setShuffle()
                            }}
                        >
                            <LuShuffle style={styleSmall} />
                        </button>
                        <button
                            className="flex rounded-full items-center justify-center hover:text-white active:scale-95"
                            onClick={e => playPrev(e)}
                        >
                            <IoPlayBackCircleSharp style={style} />
                        </button>
                        <button
                            className="flex items-center rounded-full justify-center hover:text-white active:scale-95"
                            onClick={e => playPauseHandler(e)}
                        >
                            {isPlaying || isPlayingPodcast ? (
                                <FaRegCirclePause style={style} />
                            ) : (
                                <FaCirclePlay style={style} />
                            )}
                        </button>
                        <button
                            className="flex rounded-full items-center justify-center hover:text-white active:scale-95"
                            onClick={e => playNext(e)}
                        >
                            <IoPlayForwardCircleSharp style={style} />
                        </button>
                        <button
                            className={`${repeat && 'text-blue-600'} flex rounded-full mx-2 items-center justify-center active:scale-95`}
                            onClick={e => {
                                e.preventDefault()
                                setRepeat()
                            }}
                        >
                            {repeat === 2 ? (
                                <LuRepeat1 style={styleSmall} />
                            ) : (
                                <LuRepeat style={styleSmall} />
                            )}
                        </button>
                    </div>
                    <div className="">
                        <Timeline />
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-end mx-5">
                <button
                    className={`${queueToggle && 'text-blue-600'} flex rounded-full items-center pe-10 justify-end active:scale-95`}
                    title="Display Queue"
                    onClick={e => {
                        e.preventDefault()
                        handleQueueToggle(e)
                    }}
                >
                    <FaListOl style={styleSmall} />
                </button>
                <VolumeSlider />
            </div>
        </div>
    )
}

export default Footer
