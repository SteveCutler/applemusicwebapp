import React, { ReactNode } from 'react'
import AlbumItem from './AlbumItem'
import { Link } from 'react-router-dom'
import defaultPlaylistArtwork from '../../assets/images/defaultPlaylistArtwork.png'
import PlaylistItem from './PlaylistItem'
import StationItem from './StationItem'

type DisplayRow = {
    title: string
    albums: Array<AlbumType | playlist | StationType | Song>
    id?: string
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
    attributes: AttributeObject
    id: String
    type: string
}

type AttributeObject = {
    artistName: String
    artwork: ArtworkObject
    dateAdded: String
    genreNames: Array<String>
    name: String
    releasedDate: String
    trackCount: Number
}

type ArtworkObject = {
    height: Number
    width: Number
    url: String
}

const DisplayRow: React.FC<DisplayRow> = ({ title, albums, id }) => {
    return (
        <div className="flex-col flex items-center my-5  w-full rounded-lg  ">
            <h1 className="text-xl select-none flex w-full px-6 py-2 font-bold justify-start">
                {id && id}
                {title}
            </h1>
            {/* <div className="flex-grid flex grid-cols-5 m-1 px-5  pb-6  grid-rows-1 justify-center my-auto gap-3 "> */}
            <div className="carousel carousel-center max-w-5xl overflow-x-auto  flex p-4 space-x-4  rounded-box">
                {albums &&
                    albums.map(album =>
                        album.type === 'library-playlists' ||
                        album.type === 'playlists' ? (
                            <PlaylistItem
                                title={album.attributes.name}
                                artistName="Playlist"
                                albumArtUrl={
                                    album.attributes.artwork?.url ??
                                    defaultPlaylistArtwork
                                }
                                playlistId={album.id}
                                type={album.type}
                                carousel={true}
                            />
                        ) : album.type === 'stations' ? (
                            <StationItem
                                title={album.attributes.name}
                                artistName="Station"
                                albumArtUrl={album.attributes.artwork?.url}
                                stationId={album.id}
                                type={album.type}
                                carousel={true}
                            />
                        ) : (
                            album.attributes && (
                                <AlbumItem
                                    title={album.attributes.name}
                                    artistName={album.attributes.artistName}
                                    albumArtUrl={album.attributes.artwork?.url}
                                    albumId={album.id}
                                    type={album.type}
                                    carousel={true}
                                />
                            )
                        )
                    )}
            </div>
        </div>
    )
}

export default DisplayRow
