import React, { ReactNode, useRef } from 'react'
import AlbumItem from './AlbumItem'
import { Link } from 'react-router-dom'
import defaultPlaylistArtwork from '../../assets/images/defaultPlaylistArtwork.png'
import PlaylistItem from './PlaylistItem'
import StationItem from './StationItem'
import { FaArrowCircleRight } from 'react-icons/fa'
import { FaArrowCircleLeft } from 'react-icons/fa'
import SongItem from './SongItem'
import { useStore } from '../../store/store'
import ArtistItem from './ArtistItem'

type DisplayRow = {
    title: string
    albums: Array<AlbumType | playlist | StationType | Song | Artist>
    id?: string
}

type Artist = {
    attributes: {
        artwork?: {
            bgColor: string
            url: string
        }
        genreNames: Array<string>
        name: string
        url: string
    }
    relationships?: {
        albums?: {
            href: string
            data: Array<AlbumRelationships>
        }
    }
    id: string
    type: string
}

type AlbumRelationships = {
    href: string
    id: string
    type: string
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

type AlbumType = {
    attributes: {
        artistName: String
        artwork?: { height: Number; width: Number; url?: String }
        dateAdded: String
        genreNames: Array<String>
        name: String
        releaseDate: String
        trackCount: Number
    }
    id: String
    type: string
}

type AttributeObject = {
    artistName: String
    artwork: ArtworkObject
    dateAdded: String
    genreNames: Array<String>
    name: String
    releaseDate: String
    trackCount: Number
}

type ArtworkObject = {
    height: Number
    width: Number
    url: String
}

const DisplayRow: React.FC<DisplayRow> = ({ title, albums, id }) => {
    const carouselRef = useRef<HTMLDivElement>(null)
    const { queueToggle } = useStore(state => ({
        queueToggle: state.queueToggle,
    }))

    const scrollLeft = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({ left: -1000, behavior: 'smooth' })
        }
    }

    const scrollRight = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({ left: 1000, behavior: 'smooth' })
        }
    }
    const style = { fontSize: '1.5rem' }

    return (
        <div className="flex-col flex items-center  my-5  w-full rounded-lg  ">
            <h1 className="text-5xl select-none flex w-full px-6 py-2 text-slate-800  font-bold justify-start">
                {id && id}
                {title}
            </h1>
            <div className="flex justify-center  items-center">
                <button
                    className=" p-2 bg-gray-300 -translate-y-10 hover:text-slate-500 hover:scale-110 active:scale-95 rounded-full shadow-lg transform  "
                    onClick={scrollLeft}
                >
                    <FaArrowCircleLeft style={style} />
                </button>

                {/* <div className="flex-grid flex grid-cols-5 m-1 px-5  pb-6  grid-rows-1 justify-center my-auto gap-3 "> */}
                <div
                    className={`carousel flex carousel-center ${queueToggle ? 'max-w-3xl' : 'max-w-5xl'} overflow-x-auto h-full p-2 space-x-2  rounded-box`}
                    ref={carouselRef}
                >
                    {albums &&
                        albums.map(album =>
                            album.type === 'library-playlists' ||
                            album.type === 'playlists' ? (
                                <PlaylistItem
                                    playlistItem={album}
                                    carousel={true}
                                />
                            ) : album.type === 'stations' ? (
                                <StationItem
                                    stationItem={album}
                                    carousel={true}
                                />
                            ) : album.type === 'songs' ||
                              album.type === 'library-songs' ? (
                                <SongItem song={album} carousel={true} />
                            ) : album.type === 'artists' ||
                              album.type === 'library-artists' ? (
                                <ArtistItem carousel={true} artist={album} />
                            ) : (
                                album.attributes && (
                                    <AlbumItem
                                        albumItem={album}
                                        carousel={true}
                                        releaseDate={
                                            album.attributes.releaseDate
                                        }
                                    />
                                )
                            )
                        )}
                </div>
                <button
                    className=" p-2 bg-gray-300 hover:text-slate-500 -translate-y-10 hover:scale-110 active:scale-95 rounded-full shadow-lg transform  "
                    onClick={scrollRight}
                >
                    <FaArrowCircleRight style={style} />
                </button>
            </div>
        </div>
    )
}

export default DisplayRow
