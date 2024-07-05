import React from 'react'
import { FaCirclePlay, FaRegCirclePause } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import { useStore } from '../../store/store'

interface playlistProps {
    name: string
    artistName: string
    id: string
    index: number
}
const HistoryRow: React.FC<playlistProps> = ({
    name,
    artistName,
    id,
    index,
}) => {
    const {
        isPlaying,
        currentSongId,
        playlist,
        recentHistory,
        switchTrack,
        setPlaylist,
        pause,
        play,
        musicKitInstance,
    } = useStore(state => ({
        isPlaying: state.isPlaying,
        currentSongId: state.currentSongId,
        musicKitInstance: state.musicKitInstance,
        setPlaylist: state.setPlaylist,
        playlist: state.playlist,
        recentHistory: state.recentHistory,
        pause: state.pauseSong,
        play: state.playSong,
        switchTrack: state.switchTrack,
    }))

    const playPauseHandler = async () => {
        if (playlist !== recentHistory) {
            setPlaylist(recentHistory, index, true)
        } else {
        }

        if (id === currentSongId) {
            // console.log('songId is current song')
            isPlaying
                ? // console.log('is playing: pausing')
                  await pause()
                : // console.log('isnt playing: playing')
                  play()

            // setCurrrentSongId()
        } else {
            // console.log('isnt playing: setting track')
            await switchTrack(index)
            // setCurrrentSongId()
        }
    }
    const style = { fontSize: '1.5rem', color: 'dodgerblue' }
    return (
        <Link
            to={`/song/${id}`}
            className="  overflow-hidden text-ellipsis whitespace-nowrap flex m-2 truncate w-full mx-auto   font-semibold hover:text-slate-200 text-slate-400 border-2 border-slate-300  px-3 py-1 rounded-lg hover:cursor-pointer"
        >
            <div
                className="text-sm  flex-col overflow-hidden flex text-ellipsis whitespace-nowrap  truncate w-full mx-auto  "
                title={`${name} by ${artistName}`}
            >
                <div className="overflow-hidden text-ellipsis whitespace-nowrap truncate font-semibold">
                    {name}
                </div>
                <div className="overflow-hidden text-ellipsis whitespace-nowrap truncate font-normal">
                    {artistName}
                </div>
            </div>
            <div
                className="transform hover:scale-110 items-center flex active:scale-95 transition-transform duration-100 easy-ease"
                onClick={async e => {
                    e.preventDefault()
                    e.stopPropagation() // Prevents the link's default behavior
                    // await FetchAlbumData(albumId)
                    // handlePlayPause()

                    await playPauseHandler()
                }}
            >
                {isPlaying && id === musicKitInstance?.nowPlayingItem.id ? (
                    <FaRegCirclePause style={style} />
                ) : (
                    <FaCirclePlay style={style} />
                )}
            </div>
        </Link>
    )
}

export default HistoryRow
