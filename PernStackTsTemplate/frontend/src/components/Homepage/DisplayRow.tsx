import React, { ReactNode } from 'react'
import AlbumItem from './AlbumItem'
import { Link } from 'react-router-dom'

type DisplayRow = {
    title: String
    albums: Array<AlbumType>
}

type AlbumType = {
    attributes: AttributeObject
    id: String
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

const DisplayRow: React.FC<DisplayRow> = ({ title, albums }) => {
    return (
        <div className="flex-col flex items-center my-5 rounded-lg  bg-slate-800">
            <h1 className="text-5xl pt-4 font-bold text-center">{title}</h1>
            <div className="flex-grid flex grid-cols-5 m-1 px-5  pb-6  grid-rows-1 justify-center my-auto gap-3 ">
                {albums &&
                    albums.map(album => (
                        <AlbumItem
                            title={album.attributes.name}
                            artistName={album.attributes.artistName}
                            albumArtUrl={album.attributes.artwork.url}
                            albumId={album.id}
                        />
                    ))}
            </div>
        </div>
    )
}

export default DisplayRow
