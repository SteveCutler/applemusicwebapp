import { useParams } from 'react-router-dom'
import useFetchPlaylistData from '../components/Apple/FetchPlaylistData'
import TrackDisplay from '../components/AlbumPage/TrackDisplay'
import { MdArrowBackIosNew } from 'react-icons/md'
import { Link } from 'react-router-dom'
import defaultPlaylistArtwork from '../../src/assets/images/defaultPlaylistArtwork.png'
import ScrollToTop from '../components/Homepage/ScrollToTop'
import { useStore } from '../store/store'
import { FaCirclePlay } from 'react-icons/fa6'

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

    const { musicKitInstance, darkMode } = useStore(state => ({
        darkMode: state.darkMode,
        musicKitInstance: state.musicKitInstance,
    }))

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
                    <h1 className="text-3xl font-bold">
                        {playlistData.attributes.name}
                    </h1>
                </div>
                <div className="flex w-full justify-between gap-4 py-3  ">
                    <div className=" relative h-fit w-1/2">
                        <img
                            className="w-full"
                            src={constructImageUrl(
                                playlistData.attributes.artwork?.url ??
                                    defaultPlaylistArtwork,
                                1000
                            )}
                            alt=""
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
                    <div className="w-1/2">
                        <TrackDisplay albumTracks={playlistTrackData} />
                    </div>
                    {/* MAKE TRACK GETTER, ETC. DESIGN PAGE LAYOUT */}
                </div>
            </div>
        )
    }
}

export default Playlist
