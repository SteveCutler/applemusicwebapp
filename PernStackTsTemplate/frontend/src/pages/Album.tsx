import { useParams } from 'react-router-dom'
import useFetchAlbumData from '../components/Apple/FetchAlbumData'
import TrackDisplay from '../components/AlbumPage/TrackDisplay'
import { MdArrowBackIosNew } from 'react-icons/md'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

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
    const { albumId } = useParams<{ albumId: string }>()
    // console.log(albumId)
    const { albumData, loading, error } = useFetchAlbumData(albumId)

    // console.log('album data: ', albumData)
    const constructImageUrl = (url: string, size: number) => {
        return url
            .replace('{w}', size.toString())
            .replace('{h}', size.toString())
    }

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
            <div className="flex-col w-4/5 h-screen">
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
                    <h1 className="text-2xl font-bold">
                        {albumData.attributes.artistName}
                    </h1>
                </div>
                <div className="flex w-full justify-between gap-4 py-3  ">
                    <div className="">
                        <img
                            src={constructImageUrl(
                                albumData.attributes.artwork.url,
                                500
                            )}
                            alt=""
                        />
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
