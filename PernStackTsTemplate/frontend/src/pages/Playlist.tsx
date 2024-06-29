import { useParams } from 'react-router-dom'
import useFetchPlaylistData from '../components/Apple/FetchPlaylistData'
import TrackDisplay from '../components/AlbumPage/TrackDisplay'
import { MdArrowBackIosNew } from 'react-icons/md'
import { Link } from 'react-router-dom'
import defaultPlaylistArtwork from '../../src/assets/images/defaultPlaylistArtwork.png'
import ScrollToTop from '../components/Homepage/ScrollToTop'

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

    // console.log(playlistData)
    // console.log(playlistTrackData)

    // console.log('album data: ', albumData)
    const constructImageUrl = (url: string, size: number) => {
        return url
            .replace('{w}', size.toString())
            .replace('{h}', size.toString())
    }

    const style = { fontSize: '1.5em', color: 'royalblue' }
    if (loading) {
        return <div>Loading...</div>
    }

    // if (error) {
    //     return <div>Error: {error}</div>
    // }

    if (!playlistData || !playlistTrackData) {
        return (
            <div className="flex text-3xl m-5 p-5 text-slate-800">
                No playlist data available
            </div>
        )
    }

    if (playlistData && playlistTrackData) {
        return (
            <div className="flex-col flex text-slate-900 flex-grow mt-10 mx-auto w-11/12 ">
                <ScrollToTop />
                {/* <Link to="/">
                    <div className="sticky mb-10 top-1 left-1">
                        {' '}
                        <MdArrowBackIosNew style={style} />
                    </div>
                </Link> */}
                <div className="flex-col">
                    <h1 className="text-5xl font-bold">
                        {playlistData.attributes.name}
                    </h1>
                </div>
                <div className="flex w-full justify-between gap-4 py-3  ">
                    <div className="w-full">
                        <img
                            src={constructImageUrl(
                                playlistData.attributes.artwork?.url ??
                                    defaultPlaylistArtwork,
                                1000
                            )}
                            alt=""
                        />
                    </div>
                    <TrackDisplay albumTracks={playlistTrackData} />
                    {/* MAKE TRACK GETTER, ETC. DESIGN PAGE LAYOUT */}
                </div>
            </div>
        )
    }
}

export default Playlist
