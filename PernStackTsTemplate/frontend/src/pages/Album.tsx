import { useParams } from 'react-router-dom'
import useFetchAlbumData from '../components/Apple/FetchAlbumData'
import TrackDisplay from '../components/AlbumPage/TrackDisplay'
import { MdArrowBackIosNew } from 'react-icons/md'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useStore } from '../store/store'
import { FaCirclePlay, FaRegCirclePause } from 'react-icons/fa6'
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

const Album = () => {
    const { albumId, type } = useParams<{ albumId: string; type: string }>()
    console.log(type)
    const { albumData, artistId, loading, error } = useFetchAlbumData(albumId)
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

    // console.log('album data: ', albumData)
    const constructImageUrl = (url: string, size: number) => {
        return url
            .replace('{w}', size.toString())
            .replace('{h}', size.toString())
    }

    const setTerm = () => {
        setSearchTerm(albumData.attributes.artistName)
    }

    const loadPlayer = async () => {
        console.log('track data: ', albumData.relationships.tracks.data)
        setPlaylist(albumData.relationships.tracks.data, 0, true)
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

    if (!albumData) {
        return <div>No album data available</div>
    }

    if (albumData) {
        return (
            <div className="flex-col w-4/5 mx-auto h-full">
                <ScrollToTop />
                <Link to="/">
                    <div className="sticky mb-10 mt-5 top-1 left-1">
                        {' '}
                        <MdArrowBackIosNew style={style} />
                    </div>
                </Link>
                <div className="flex-col ">
                    <h1 className="text-3xl font-bold">
                        {albumData.attributes.name}
                    </h1>
                    <Link
                        to={
                            type === 'library-albums'
                                ? `/search/`
                                : `/artist/${artistId}`
                        }
                        onClick={
                            type === 'library-albums' ? setTerm : undefined
                        }
                        className="text-2xl hover:text-blue-200 hover:cursor-pointer font-bold"
                    >
                        {albumData.attributes.artistName}
                    </Link>
                </div>
                <div className="flex w-full justify-between gap-4 py-3  ">
                    <div className="relative">
                        <img
                            src={constructImageUrl(
                                albumData.attributes.artwork.url,
                                500
                            )}
                            alt=""
                        />
                        <div
                            className=" absolute bottom-10 right-10 hover:cursor-pointer transform   flex justify-right hover:scale-110 active:scale-95 transition-transform duration-100 easy-ease"
                            onClick={async e => {
                                e.preventDefault()
                                e.stopPropagation() // Prevents the link's default behavior
                                // await FetchAlbumData(albumId)
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
                    <TrackDisplay
                        albumTracks={albumData.relationships.tracks.data}
                    />
                    {/* MAKE TRACK GETTER, ETC. DESIGN PAGE LAYOUT */}
                </div>
            </div>
        )
    }
}

export default Album
