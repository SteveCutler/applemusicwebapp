import { useParams } from 'react-router-dom'
import useFetchPlaylistData from '../components/Apple/FetchPlaylistData'
import TrackDisplay from '../components/AlbumPage/TrackDisplay'
import { MdArrowBackIosNew } from 'react-icons/md'
import { Link } from 'react-router-dom'
import defaultPlaylistArtwork from '../../src/assets/images/defaultPlaylistArtwork.png'
import ScrollToTop from '../components/Homepage/ScrollToTop'
import { useStore } from '../store/store'
import { FaCirclePlay } from 'react-icons/fa6'
import { useState } from 'react'

type AlbumType = {
    attributes: AttributeObject
    relationships: RelationshipObject
    id: string
}

type AttributeObject = {
    artistName: string
    artwork: ArtworkObject
    dateAdded: string
    genreNames: Array<string>
    name: string
    releasedDate: string
    trackCount: Number
}
type RelationshipObject = {
    tracks: TracksObject
}

type TracksObject = {
    data: Array<Track>
}
type Track = {
    attributes: TrackAttributeObject
}

type TrackAttributeObject = {
    artistName: string
    artwork: ArtworkObject
    dateAdded: string
    genreNames: Array<string>
    durationInMillis: Number
    name: string
    releasedDate: string
    trackCount: Number
    playParams: PlayParameterObject
}

type PlayParameterObject = {
    catalogId: string
    id: string
    isLibrary: Boolean
    kind: string
}

type ArtworkObject = {
    height: Number
    width: Number
    url: string
}

const Playlist = () => {
    const { playlistId } = useParams<{ playlistId: string }>()
    // console.log(albumId)
    const { playlistData, playlistTrackData, loading, error } =
        useFetchPlaylistData(playlistId)

    const { musicKitInstance, darkMode, queueToggle } = useStore(state => ({
        darkMode: state.darkMode,
        queueToggle: state.queueToggle,
        musicKitInstance: state.musicKitInstance,
    }))

    const [loadingImage, setLoadingImage] = useState(true)
    // console.log(playlistData)
    // console.log(playlistTrackData)

    // console.log('album data: ', albumData)
    const constructImageUrl = (url: string, size: number) => {
        return url
            .replace('{w}', size.toString())
            .replace('{h}', size.toString())
    }

    const playData = async () => {
        if (musicKitInstance) {
            console.log('setting playlist and start position')
            await musicKitInstance.setQueue({
                playlist: playlistId,
                startWith: 0,
                startPlaying: true,
            })
        }
    }
    const styleButton = { fontSize: '3rem', color: 'dodgerblue ' }
    const style = { fontSize: '1.5em', color: 'dodgerblue' }
    if (loading) {
        return <div>Loading...</div>
    }

    // if (error) {
    //     return <div>Error: {error}</div>
    // }

    if (!playlistData || !playlistTrackData) {
        return (
            <div
                className={`flex text-3xl select-none font-bold m-5 p-5 ${darkMode ? 'text-slate-300 ' : ' text-slate-800 '}`}
            >
                No playlist data available
            </div>
        )
    }

    if (playlistData && playlistTrackData) {
        return (
            <div
                className={`flex-col flex ${darkMode ? 'text-slate-300 ' : ' text-slate-800 '} flex-grow mt-10 mx-auto w-11/12 `}
            >
                <ScrollToTop />
                {/* <Link to="/">
                    <div className="sticky mb-10 top-1 left-1">
                        {' '}
                        <MdArrowBackIosNew style={style} />
                    </div>
                </Link> */}
                <div className="flex-col">
                    <h1 className="text-3xl w-full font-bold">
                        {playlistData.attributes.name}
                    </h1>
                </div>
                <div
                    className={`${queueToggle ? ' flex-col' : 'lg:flex-row flex-col'} flex w-full justify-between gap-4 py-3  `}
                >
                    <div
                        className={` relative  ${queueToggle ? ' w-2/3' : 'lg:w-1/2 w-full'} h-fit `}
                    >
                        {loadingImage ? (
                            // <div className="w-full h-full flex items-center justify-center">
                            <img
                                src={defaultPlaylistArtwork}
                                className=" w-full animate-pulse"
                            />
                        ) : // </div>
                        null}

                        <img
                            className="w-full"
                            src={constructImageUrl(
                                playlistData.attributes.artwork?.url ??
                                    defaultPlaylistArtwork,
                                1000
                            )}
                            alt=""
                            onLoad={() => setLoadingImage(false)}
                            style={{
                                display: loadingImage ? 'none' : 'block',
                            }}
                        />

                        <div
                            className=" absolute bottom-10 right-10 hover:cursor-pointer transform    hover:scale-110 active:scale-95 transition-transform duration-100 easy-ease"
                            onClick={async e => {
                                e.preventDefault()
                                e.stopPropagation() // Prevents the link's default behavior
                                // await FetchAlbumData(albumId)
                                // handlePlayPause()

                                await playData()
                            }}
                        >
                            <FaCirclePlay style={styleButton} />
                        </div>
                    </div>
                    <div
                        className={`${queueToggle ? ' w-full mx-auto' : 'lg:w-1/2 w-full '}`}
                    >
                        <TrackDisplay albumTracks={playlistTrackData} />
                    </div>
                    {/* MAKE TRACK GETTER, ETC. DESIGN PAGE LAYOUT */}
                </div>
            </div>
        )
    }
}

export default Playlist
