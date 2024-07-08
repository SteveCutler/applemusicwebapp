import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../../store/store'
import { FaCirclePlay, FaRegCirclePause } from 'react-icons/fa6'
import OptionsModal from './OptionsModal'
import defaultPlaylistArtwork from '../../assets/images/defaultPlaylistArtwork.png'

type podcast = {
    artistName: string

    artworkUrl100: string
    artworkUrl30: string
    artworkUrl60: string
    artworkUrl600: string
    collectionCensoredName: string
    collectionExplicitness: string
    collectionId: number
    collectionName: string
    collectionPrice: number
    collectionViewUrl: string
    contentAdvisoryRating: string
    country: string
    currency: string
    feedUrl: string
    genreIds: Array<string>
    genres: Array<string>
    kind: string
    primaryGenreName: string
    releaseDate: string
    trackCensoredName: string
    trackCount: number
    trackExplicitness: string
    trackId: number
    trackName: string
    trackPrice: number
    trackTimeMillis: number
    trackViewUrl: string
    wrapperType: string
}
interface podcastProp {
    podcast: podcast
    width: string
}

const PodcastItem: React.FC<podcastProp> = ({ podcast, width }) => {
    const constructImageUrl = (url: String, size: Number) => {
        return url
            .replace('{w}', size.toString())
            .replace('{h}', size.toString())
    }

    const {
        isPlaying,
        authorizeMusicKit,

        queueToggle,
        darkMode,
        playlist,
        musicKitInstance,
    } = useStore(state => ({
        playlistData: state.playlistData,
        darkMode: state.darkMode,
        queueToggle: state.queueToggle,
        setPlaylistData: state.setPlaylistData,
        isPlaying: state.isPlaying,
        pause: state.pauseSong,
        playSong: state.playSong,
        musicKitInstance: state.musicKitInstance,
        authorizeMusicKit: state.authorizeMusicKit,
        setAlbumData: state.setAlbumData,
        albumData: state.albumData,
        setPlaylist: state.setPlaylist,
        playlist: state.playlist,
    }))

    // const [loading, setLoading] = useState<Boolean>(false)
    // const [playlistData, setPlaylistData] = useState<Song[]>([])

    const [isHovered, setIsHovered] = useState(false)

    // console.log('albumArtUrl: ', albumArtUrl)

    return (
        <Link
            to={`/podcast/${podcast.collectionId}`}
            className={` select-none  h-full flex-col justify-between ${width ? width : queueToggle ? 'w-3/12' : ' w-2/12'} ${darkMode ? 'text-slate-300 hover:text-slate-500' : 'text-slate-800 hover:text-slate-200'}   rounded-3xl flex `}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            title={`${podcast.artistName}`}
        >
            <div className="relative z-1 w-full shadow-lg">
                {podcast.artworkUrl600 ? (
                    <img src={podcast.artworkUrl600} />
                ) : (
                    <img src={defaultPlaylistArtwork} />
                )}

                <div
                    className={`transform p-1 absolute bottom-1 left-1 flex justify-right hover:scale-110 active:scale-95 transition-transform duration-100 easy-ease ${isHovered ? 'block' : 'hidden'}`}
                    onClick={async e => {
                        e.preventDefault()
                        e.stopPropagation() // Prevents the link's default behavior
                        // await FetchAlbumData(albumId)
                        // handlePlayPause()

                        // await loadPlayer()
                    }}
                >
                    {/* {isPlaying && playlistData === playlist ? (
                        <FaRegCirclePause style={style} />
                    ) : (
                        <FaCirclePlay style={style} />
                    )} */}
                </div>
                <div
                    onClick={e => {
                        e.preventDefault()
                        e.stopPropagation() // Prevents the link's default behavior
                    }}
                    className={`absolute bottom-1 right-1 z-100 ${isHovered ? 'block' : 'hidden'}`}
                >
                    {/* <OptionsModal object={playlistItem} /> */}
                </div>
            </div>
            <div className="flex  h-full ">
                <div className="flex-col justify-between h-full overflow-hidden">
                    <h2 className="text-md truncate font-bold">
                        {podcast.artistName}
                    </h2>
                    <h3 className="truncate">Playlist</h3>

                    {/* {playlistItem.type === 'library-playlists' && (
                        <div className="bg-slate-300  text-slate-600 w-fit p-1 font-bold text-sm  flex rounded-lg">
                            <span>Library</span>
                        </div>
                    )} */}
                    <span></span>
                </div>
            </div>
        </Link>
    )
}

export default PodcastItem
