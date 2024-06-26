import React, { useEffect } from 'react'
import { useStore } from '../../store/store'
import CollapsibleList from '../Apple/CollapsibleList'
import CollapsibleListFavs from '../Apple/CollapsibleListFavs'
import { FaCirclePlay, FaRegCirclePause } from 'react-icons/fa6'
import defaultPic from '../../assets/images/defaultPlaylistArtwork.png'
import { useNavigate } from 'react-router-dom'

interface ActivityProp {
    item: Song | Album | playlist | StationType
}
interface Song {
    id: string
    href?: string
    type: string
    attributes: {
        id: string
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
        ratedAt?: Date
    }
}

interface Album {
    attributes: {
        artistName: string
        artwork?: { height: number; width: number; url?: string }
        dateAdded: string
        genreNames: Array<string>
        name: string
        releaseDate: string
        trackCount: number
    }
    id: string
    type: string
}

interface StationType {
    attributes: {
        artwork: {
            bgColor: string
            url: string
        }
        mediaKind: string
        name: string
        url: string
        playParams: {
            format: string
            id: string
            kind: string
            stationHash: string
        }
    }
    id: String
    type: string
}

type playlist = {
    attributes: {
        artwork?: {
            bgColor: string
            url: string
        }
        description?: string
        curatorName?: string
        canEdit: boolean
        playlistType?: string
        dataAdded: string
        isPublic: boolean
        lastModifiedDate: string
        name: string
    }
    href: string
    id: string
    type: string
}

const ActivityRow: React.FC<ActivityProp> = ({ item }) => {
    const {
        favouriteSongs,
        setFavouriteSongs,
        isPlaying,
        musicKitInstance,
        backendToken,
        appleMusicToken,
    } = useStore(state => ({
        favouriteSongs: state.favouriteSongs,
        isPlaying: state.isPlaying,
        musicKitInstance: state.musicKitInstance,
        setFavouriteSongs: state.setFavouriteSongs,
        backendToken: state.backendToken,
        appleMusicToken: state.appleMusicToken,
    }))

    console.log('item: ', item)

    const userId = backendToken

    const navigate = useNavigate()

    const navigateTo = (id: string) => {
        switch (item.type) {
            case 'songs':
            case 'library-songs':
            case 'song':
                navigate(`/song/${id}`)

                break
            case 'playlists':
            case 'library-playlists':
                navigate(`/playlist/${id}`)

                break
            case 'albums':
            case 'library-albums':
                navigate(`/album/${id}`)
                break
            case 'station':
            case 'library-station':
                navigate(`/station/${id}`)
                break
            default:
                console.log('default response')
                break
        }
    }

    const style = { color: 'white', fontSize: '1.3rem' }
    const styleBlue = { color: 'royalblue', fontSize: '1.3rem' }

    const constructImageUrl = (url: string, size: number) => {
        return url
            .replace('{w}', size.toString())
            .replace('{h}', size.toString())
    }

    const playPauseHandler = async () => {
        if (musicKitInstance) {
            switch (item.type) {
                case 'songs':
                case 'library-songs':
                case 'song':
                    await musicKitInstance.setQueue({
                        playlist: item.id,
                        startWith: 0,
                        startPlaying: true,
                    })

                    break
                case 'playlists':
                case 'library-playlists':
                    await musicKitInstance.setQueue({
                        playlist: item.id,
                        startWith: 0,
                        startPlaying: true,
                    })

                    break
                case 'albums':
                case 'library-albums':
                    if (musicKitInstance) {
                        await musicKitInstance.setQueue({
                            album: item.id,
                            startWith: 0,
                            startPlaying: true,
                        })
                    }
                    break
                case 'stations':
                case 'library-stations':
                    if (musicKitInstance) {
                        await musicKitInstance.setQueue({ station: item.id })
                        musicKitInstance.play()
                    }
                    break
                default:
                    console.log('default response')
                    break
            }
        }
    }

    switch (item.type) {
        case 'songs':
        case 'library-songs':
            return (
                <div
                    className="flex border-b border-slate-800 w-full h-fit p-1 hover:cursor-pointer hover:bg-slate-700 text-xs  justify-between"
                    onClick={() => navigateTo(item.id)}
                >
                    <div className="w-10/12 truncate gap-1 flex">
                        {item.attributes.artwork?.url ? (
                            <img
                                src={constructImageUrl(
                                    item.attributes.artwork?.url,
                                    50
                                )}
                            />
                        ) : (
                            <img src={defaultPic} width="50px" />
                        )}
                        <div className="flex flex-col justify-center  items-start  ">
                            <div
                                className={`truncate 
                        ${
                            isPlaying &&
                            item.id === musicKitInstance?.nowPlayingItem.id
                                ? 'font-bold text-slate-300'
                                : 'font-semibold'
                        }
                    `}
                            >
                                {item.attributes.name}
                            </div>

                            <div
                                className={`truncate 
                        ${
                            isPlaying &&
                            item.id === musicKitInstance?.nowPlayingItem.id
                                ? 'font-bold text-slate-200'
                                : 'font-semibold text-slate-500'
                        }
                    `}
                            >
                                {item.attributes.artistName}
                            </div>
                            <div
                                className={`truncate 
                        ${
                            isPlaying &&
                            item.id === musicKitInstance?.nowPlayingItem.id
                                ? 'font-bold text-slate-200'
                                : 'font-semibold text-slate-500'
                        }
                    `}
                            >
                                Song
                            </div>
                        </div>
                    </div>

                    <button
                        // onClick={playPauseHandler}
                        className="transform hover:scale-110 items-center flex active:scale-95 transition-transform duration-100 easy-ease"
                        onClick={e => {
                            e.preventDefault()
                            e.stopPropagation()
                            playPauseHandler()
                        }}
                    >
                        {isPlaying &&
                        item.id === musicKitInstance?.nowPlayingItem.id ? (
                            <FaRegCirclePause style={style} />
                        ) : (
                            <FaCirclePlay style={styleBlue} />
                        )}
                    </button>
                </div>
            )
            break
        case 'albums':
        case 'library-albums':
            return (
                <div
                    className="flex  w-full h-fit p-1 hover:cursor-pointer hover:bg-slate-700 text-xs  border-b border-slate-800 justify-between"
                    onClick={() => navigateTo(item.id)}
                >
                    <div className="w-10/12 truncate gap-1 flex">
                        {item.attributes.artwork?.url ? (
                            <img
                                src={constructImageUrl(
                                    item.attributes.artwork?.url,
                                    50
                                )}
                            />
                        ) : (
                            <img src={defaultPic} width="50px" />
                        )}
                        <div className="flex flex-col justify-center  items-start  ">
                            <div
                                className={`truncate 
                        ${
                            isPlaying &&
                            item.id === musicKitInstance?.nowPlayingItem.id
                                ? 'font-bold text-slate-300'
                                : 'font-semibold'
                        }
                    `}
                            >
                                {item.attributes.name}
                            </div>

                            <div
                                className={`truncate 
                        ${
                            isPlaying &&
                            item.id === musicKitInstance?.nowPlayingItem.id
                                ? 'font-bold text-slate-200'
                                : 'font-semibold text-slate-500'
                        }
                    `}
                            >
                                {item.attributes.artistName}
                            </div>
                            <div
                                className={`truncate 
                        ${
                            isPlaying &&
                            item.id === musicKitInstance?.nowPlayingItem.id
                                ? 'font-bold text-slate-200'
                                : 'font-semibold text-slate-500'
                        }
                    `}
                            >
                                Album
                            </div>
                        </div>
                    </div>

                    <button
                        // onClick={playPauseHandler}
                        className="transform hover:scale-110 items-center flex active:scale-95 transition-transform duration-100 easy-ease"
                        onClick={e => {
                            e.preventDefault()
                            e.stopPropagation()
                            playPauseHandler()
                        }}
                    >
                        {isPlaying &&
                        item.id === musicKitInstance?.nowPlayingItem.id ? (
                            <FaRegCirclePause style={style} />
                        ) : (
                            <FaCirclePlay style={styleBlue} />
                        )}
                    </button>
                </div>
            )
            break
        case 'playlists':
        case 'library-playlists':
            return (
                <div
                    onClick={() => navigateTo(item.id)}
                    className="flex  w-full h-fit p-1 hover:cursor-pointer hover:bg-slate-700 text-xs  border-b border-slate-800 justify-between"
                >
                    <div className="w-10/12 truncate gap-1 flex">
                        {item.attributes.artwork?.url ? (
                            <img
                                src={constructImageUrl(
                                    item.attributes.artwork?.url,
                                    50
                                )}
                            />
                        ) : (
                            <img src={defaultPic} width="50px" />
                        )}
                        <div className="flex flex-col justify-center  items-start  ">
                            <div
                                className={`truncate 
                        ${
                            isPlaying &&
                            item.id === musicKitInstance?.nowPlayingItem.id
                                ? 'font-bold text-slate-300'
                                : 'font-semibold'
                        }
                    `}
                            >
                                {item.attributes.name}
                            </div>

                            <div
                                className={`truncate 
                        ${
                            isPlaying &&
                            item.id === musicKitInstance?.nowPlayingItem.id
                                ? 'font-bold text-slate-200'
                                : 'font-semibold text-slate-500'
                        }
                    `}
                            >
                                {item.attributes.artistName}
                            </div>
                            <div
                                className={`truncate 
                        ${
                            isPlaying &&
                            item.id === musicKitInstance?.nowPlayingItem.id
                                ? 'font-bold text-slate-200'
                                : 'font-semibold text-slate-500'
                        }
                    `}
                            >
                                Playlist
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={e => {
                            e.preventDefault()
                            e.stopPropagation()
                            playPauseHandler()
                        }}
                        className="transform hover:scale-110 items-center flex active:scale-95 transition-transform duration-100 easy-ease"
                    >
                        {isPlaying &&
                        item.id === musicKitInstance?.nowPlayingItem.id ? (
                            <FaRegCirclePause style={style} />
                        ) : (
                            <FaCirclePlay style={styleBlue} />
                        )}
                    </button>
                </div>
            )
            break
        case 'stations':
            return (
                <div
                    onClick={() => navigateTo(item.id)}
                    className="flex  w-full h-fit p-1 hover:cursor-pointer hover:bg-slate-700 text-xs  border-b border-slate-800 justify-between"
                >
                    <div className="w-10/12 truncate gap-1 flex">
                        {item.attributes.artwork?.url ? (
                            <img
                                src={constructImageUrl(
                                    item.attributes.artwork?.url,
                                    50
                                )}
                            />
                        ) : (
                            <img src={defaultPic} width="50px" />
                        )}
                        <div className="flex flex-col justify-center  items-start  ">
                            <div
                                className={`truncate 
                        ${
                            isPlaying &&
                            item.id === musicKitInstance?.nowPlayingItem.id
                                ? 'font-bold text-slate-300'
                                : 'font-semibold'
                        }
                    `}
                            >
                                {item.attributes.name}
                            </div>

                            <div
                                className={`truncate 
                        ${
                            isPlaying &&
                            item.id === musicKitInstance?.nowPlayingItem.id
                                ? 'font-bold text-slate-200'
                                : 'font-semibold text-slate-500'
                        }
                    `}
                            >
                                {item.attributes.artistName}
                            </div>
                            <div
                                className={`truncate 
                        ${
                            isPlaying &&
                            item.id === musicKitInstance?.nowPlayingItem.id
                                ? 'font-bold text-slate-200'
                                : 'font-semibold text-slate-500'
                        }
                    `}
                            >
                                Station
                            </div>
                        </div>
                    </div>

                    <button
                        // onClick={playPauseHandler}
                        className="transform hover:scale-110 items-center flex active:scale-95 transition-transform duration-100 easy-ease"
                        onClick={e => {
                            e.preventDefault()
                            e.stopPropagation()
                            playPauseHandler()
                        }}
                    >
                        {isPlaying &&
                        item.id === musicKitInstance?.nowPlayingItem.id ? (
                            <FaRegCirclePause style={style} />
                        ) : (
                            <FaCirclePlay style={styleBlue} />
                        )}
                    </button>
                </div>
            )
            break

        default:
            return <div>Type unknown:</div>
            break
    }
    return <div></div>
}

export default ActivityRow
