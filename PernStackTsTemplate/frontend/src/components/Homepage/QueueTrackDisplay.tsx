import React from 'react'
import { FaCirclePlay, FaRegCirclePause } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import { useStore } from '../../store/store'
import defaultPlaylistArtwork from '../../assets/images/defaultPlaylistArtwork.png'
import OptionsModal from './OptionsModal'

interface playlistProps {
    song: Song
    index: number
    albumId?: string
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
const QueueTrackDisplay: React.FC<playlistProps> = ({
    song,
    index,
    albumId,
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

    const createSongObject = (item: any) => {
        return {
            id: item.id,
            type: 'songs',
            href: item.attributes.url,
            attributes: {
                name: item.attributes.name,
                id: item.id,
                trackNumber: item.attributes.trackNumber,
                artistName: item.attributes.artistName,
                albumName: item.attributes.albumName,
                durationInMillis: item.attributes.durationInMillis,
                playParams: {
                    catalogId: item.attributes.playParams.catalogId ?? item.id,
                },
                artwork: {
                    bgColor: item.attributes.artwork.bgColor ?? '',
                    url: item.attributes.artwork.url ?? '',
                },
            },
        }
    }

    const playPauseHandler = async () => {
        if (song.id === currentSongId) {
            // console.log('songId is current song')
            isPlaying
                ? // console.log('is playing: pausing')
                  await pause()
                : // console.log('isnt playing: playing')
                  play()

            // setCurrrentSongId()
        } else {
            // console.log('isnt playing: setting track')
            await musicKitInstance?.changeToMediaItem(song)
            // setCurrrentSongId()
        }
    }

    const constructImageUrl = (url: string, size: number) => {
        return url
            .replace('{w}', size.toString())
            .replace('{h}', size.toString())
    }

    const style = { fontSize: '1.5rem', color: 'royalblue' }
    return (
        <Link
            to={`/song/${song.id}`}
            className="  overflow-hidden text-ellipsis whitespace-nowrap flex m-1 truncate  mx-auto w-11/12  font-semibold hover:text-slate-200 text-slate-400 border-2 border-slate-300  px-1 py-1 rounded-lg hover:cursor-pointer"
        >
            {song.attributes.artwork?.url ? (
                <img
                    src={constructImageUrl(song.attributes.artwork?.url, 50)}
                    className="pe-2 w-1/4"
                />
            ) : (
                <img
                    src={defaultPlaylistArtwork}
                    width="50px"
                    className="pe-2"
                />
            )}
            <div
                className="text-sm  flex-col overflow-hidden flex justify-center text-ellipsis whitespace-nowrap  truncate w-full mx-auto  "
                title={`${song.attributes.name} by ${song.attributes.artistName}`}
            >
                <div className="overflow-hidden text-ellipsis whitespace-nowrap truncate font-semibold">
                    {song.attributes.name}
                </div>
                <div className="overflow-hidden text-ellipsis whitespace-nowrap truncate font-normal">
                    {song.attributes.artistName}
                </div>
            </div>
            {/* <div className="transform scale-75  items-center flex  transition-transform duration-100 easy-ease">
                {musicKitInstance?.queue &&
                    musicKitInstance?.nowPlayingItem && (
                        <OptionsModal
                            object={createSongObject(
                                musicKitInstance.queue.items[
                                    musicKitInstance?.nowPlayingItemIndex
                                ]
                            )}
                        />
                    )}
            </div> */}
            <div
                className="transform hover:scale-110 items-center pe-1 flex active:scale-95 transition-transform duration-100 easy-ease"
                onClick={async e => {
                    e.preventDefault()
                    e.stopPropagation() // Prevents the link's default behavior
                    // await FetchAlbumData(albumId)
                    // handlePlayPause()

                    await playPauseHandler()
                }}
            >
                {isPlaying &&
                song.id === musicKitInstance?.nowPlayingItem.id ? (
                    <FaRegCirclePause style={style} />
                ) : (
                    <FaCirclePlay style={style} />
                )}
            </div>
        </Link>
    )
}

export default QueueTrackDisplay
