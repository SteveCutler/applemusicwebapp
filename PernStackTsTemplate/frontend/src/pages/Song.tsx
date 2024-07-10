import { useParams, useLocation } from 'react-router-dom'
import FetchSongData from '../components/Apple/FetchSongData'
import TrackDisplay from '../components/AlbumPage/TrackDisplay'
import { MdArrowBackIosNew } from 'react-icons/md'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useStore } from '../store/store'
import { FaCirclePlay, FaRegCirclePause } from 'react-icons/fa6'
import ScrollToTop from '../components/Homepage/ScrollToTop'
import defaultPlaylistArtwork from '../assets/images/defaultPlaylistArtwork.png'
import OptionsModal from '../components/Homepage/OptionsModal'

interface songProp {
    song: Song
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

const Song = () => {
    const location = useLocation()
    const song: Song = location.state.song
    console.log('song received: ', song)

    if (!song) {
        // Handle the case where the song object is not passed correctly
        return <div>Song not found</div>
    }

    console.log('song object: ', song)
    const { songId, type } = useParams<{ songId: string; type: string }>()
    console.log(type)
    const { trackAlbumData, trackArtistData, loading, error } =
        FetchSongData(songId)
    const {
        setSearchTerm,
        musicKitInstance,
        darkMode,
        isPlaying,
        queueToggle,
        playlist,
        setPlaylist,
    } = useStore(state => ({
        darkMode: state.darkMode,
        queueToggle: state.queueToggle,
        setSearchTerm: state.setSearchTerm,
        musicKitInstance: state.musicKitInstance,
        isPlaying: state.isPlaying,
        playlist: state.playlist,
        setPlaylist: state.setPlaylist,
    }))

    // console.log('album data: ', song)
    const constructImageUrl = (url: string, size: number) => {
        return url
            .replace('{w}', size.toString())
            .replace('{h}', size.toString())
    }

    // const setTerm = () => {
    //     setSearchTerm(song.attributes.artistName)
    // }

    const loadPlayer = async () => {
        // console.log('track data: ', song.relationships.tracks.data)
        if (song) {
            setPlaylist([song], 0, true)
        }
        // await retrieveAlbumTracks()
    }

    const styleButton = {
        fontSize: '3rem',
        color: 'dodgerblue ',
        // backgroundColor: 'black',
        // borderRadius: '9999xp',
    }

    const style = { fontSize: '1.5em' }
    if (loading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>Error: {error}</div>
    }

    if (!song) {
        return <div>No album data available</div>
    }

    if (song) {
        return (
            <div
                className={`flex-col w-11/12 mx-auto ${darkMode ? 'text-slate-200' : 'text-slate-800'} h-full`}
            >
                <ScrollToTop />
                {/* <Link to="/">
                    <div className="sticky mb-10 mt-5 top-1 left-1">
                        {' '}
                        <MdArrowBackIosNew style={style} />
                    </div>
                </Link> */}
                <div className="flex-col ">
                    <h1 className="text-3xl w-1/2 font-bold">
                        {song.attributes.name}
                    </h1>
                    {trackAlbumData && (
                        <Link
                            to={`/album/${trackAlbumData.id}`}
                            // onClick={
                            //     type === 'library-albums' ? setTerm : undefined
                            // }
                            className="text-2xl  hover:text-blue-200 hover:cursor-pointer font-normal"
                        >
                            {song.attributes.albumName}
                        </Link>
                    )}
                    <br></br>
                    {trackArtistData && (
                        <Link
                            to={`/artist/${trackArtistData.id}`}
                            // onClick={
                            //     type === 'library-albums' ? setTerm : undefined
                            // }
                            className="text-2xl hover:text-blue-200 hover:cursor-pointer font-normal"
                        >
                            {song.attributes.artistName}
                        </Link>
                    )}
                </div>
                <div
                    className={`${queueToggle ? ' flex-col' : 'lg:flex-row flex-col'}   gap-4 flex  justify-around  items-start`}
                >
                    <div className="relative w-1/2">
                        {song.attributes.artwork?.url ? (
                            <img
                                src={constructImageUrl(
                                    song.attributes.artwork.url,
                                    500
                                )}
                                alt=""
                                className="w-full"
                            />
                        ) : (
                            <img src={defaultPlaylistArtwork} />
                        )}
                        <div
                            className=" absolute bottom-5 left-4 hover:cursor-pointer transform   flex justify-right hover:scale-110 active:scale-95 transition-transform duration-100 easy-ease"
                            onClick={async e => {
                                e.preventDefault()
                                e.stopPropagation() // Prevents the link's default behavior
                                // await Fetchsong(songId)
                                // handlePlayPause()

                                await loadPlayer()
                            }}
                        >
                            <FaCirclePlay style={styleButton} />
                        </div>

                        <div className="absolute bottom-4 right-4">
                            <div
                                onClick={e => {
                                    e.preventDefault()
                                    e.stopPropagation() // Prevents the link's default behavior
                                }}
                                className=""
                            >
                                <OptionsModal big={true} object={song} />
                            </div>
                        </div>
                    </div>
                    <div
                        className={`${queueToggle ? ' w-full mx-auto' : 'lg:w-1/2 w-full '}  overflow-y-auto  `}
                    >
                        <TrackDisplay albumTracks={[song]} />
                    </div>
                    {/* MAKE TRACK GETTER, ETC. DESIGN PAGE LAYOUT */}
                </div>
            </div>
        )
    }
}

export default Song
