import { useParams } from 'react-router-dom'
import FetchSongData from '../components/Apple/FetchSongData'
import TrackDisplay from '../components/AlbumPage/TrackDisplay'
import { MdArrowBackIosNew } from 'react-icons/md'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useStore } from '../store/store'
import { FaCirclePlay, FaRegCirclePause } from 'react-icons/fa6'
import ScrollToTop from '../components/Homepage/ScrollToTop'

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
    const { songId, type } = useParams<{ songId: string; type: string }>()
    console.log(type)
    const { songData, trackAlbumData, trackArtistData, loading, error } =
        FetchSongData(songId)
    const {
        setSearchTerm,
        musicKitInstance,
        isPlaying,
        playlist,
        setPlaylist,
    } = useStore(state => ({
        setSearchTerm: state.setSearchTerm,
        musicKitInstance: state.musicKitInstance,
        isPlaying: state.isPlaying,
        playlist: state.playlist,
        setPlaylist: state.setPlaylist,
    }))

    // console.log('album data: ', songData)
    const constructImageUrl = (url: string, size: number) => {
        return url
            .replace('{w}', size.toString())
            .replace('{h}', size.toString())
    }

    // const setTerm = () => {
    //     setSearchTerm(songData.attributes.artistName)
    // }

    const loadPlayer = async () => {
        // console.log('track data: ', songData.relationships.tracks.data)
        if (songData) {
            setPlaylist([songData], 0, true)
        }
        // await retrieveAlbumTracks()
    }

    const styleButton = { fontSize: '3rem', color: 'royalblue ' }

    const style = { fontSize: '1.5em' }
    if (loading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>Error: {error}</div>
    }

    if (!songData) {
        return <div>No album data available</div>
    }

    if (songData) {
        return (
            <div className="flex-col w-4/5 text-slate-800 mx-auto h-full">
                <ScrollToTop />
                {/* <Link to="/">
                    <div className="sticky mb-10 mt-5 top-1 left-1">
                        {' '}
                        <MdArrowBackIosNew style={style} />
                    </div>
                </Link> */}
                <div className="flex-col ">
                    <h1 className="text-5xl font-bold">
                        {songData.attributes.name}
                    </h1>
                    {trackAlbumData && (
                        <Link
                            to={`/album/${trackAlbumData.id}`}
                            // onClick={
                            //     type === 'library-albums' ? setTerm : undefined
                            // }
                            className="text-2xl hover:text-blue-200 hover:cursor-pointer font-normal"
                        >
                            {songData.attributes.albumName}
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
                            {songData.attributes.artistName}
                        </Link>
                    )}
                </div>
                <div className="flex w-full justify-between gap-4 py-3  ">
                    <div className="relative">
                        <img
                            src={constructImageUrl(
                                songData.attributes.artwork.url,
                                500
                            )}
                            alt=""
                        />
                        <div
                            className=" absolute bottom-10 right-10 hover:cursor-pointer transform   flex justify-right hover:scale-110 active:scale-95 transition-transform duration-100 easy-ease"
                            onClick={async e => {
                                e.preventDefault()
                                e.stopPropagation() // Prevents the link's default behavior
                                // await FetchsongData(songId)
                                // handlePlayPause()

                                await loadPlayer()
                            }}
                        >
                            {isPlaying &&
                            musicKitInstance?.nowPlayingItem &&
                            playlist.includes(
                                musicKitInstance?.nowPlayingItem
                            ) ? (
                                <FaRegCirclePause style={styleButton} />
                            ) : (
                                <FaCirclePlay style={styleButton} />
                            )}
                        </div>
                    </div>
                    <TrackDisplay albumTracks={[songData]} />
                    {/* MAKE TRACK GETTER, ETC. DESIGN PAGE LAYOUT */}
                </div>
            </div>
        )
    }
}

export default Song
