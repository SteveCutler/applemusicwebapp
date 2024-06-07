import React from 'react'
import Track from './Track'

type TracksObject = {
    albumTracks: Song[]
}
type Song = {
    attributes: TrackAttributeObject
    id: String
}

type TrackAttributeObject = {
    artistName: String
    dateAdded: String
    genreNames: Array<String>
    name: String
    releasedDate: String
    trackCount: Number
    playParams: PlayParameterObject
    durationInMillis: Number
}

type PlayParameterObject = {
    catalogId: String
    id: String
    isLibrary: Boolean
    kind: String
}
const TrackDisplay = ({ albumTracks }: TracksObject) => {
    console.log(albumTracks)

    const convertToDuration = (milliseconds: Number) => {
        if (typeof milliseconds !== 'number' || milliseconds < 0) {
            throw new Error('Input must be a non-negative number')
        }

        const totalSeconds = Math.floor(milliseconds / 1000)
        const minutes = Math.floor(totalSeconds / 60)
        const seconds = totalSeconds % 60

        const formattedMinutes = minutes.toString().padStart(2, '0')
        const formattedSeconds = seconds.toString().padStart(2, '0')

        return `${formattedMinutes}:${formattedSeconds}`
    }

    return (
        <div className="flex-col w-1/2 justify-between items-between ">
            {albumTracks.map(track => (
                <>
                    <Track
                        trackName={track.attributes.name}
                        trackDuration={convertToDuration(
                            track.attributes.durationInMillis
                        )}
                        songId={track.id}
                        albumTracks={albumTracks}
                    />
                    <p>
                        {/* {convertToDuration(track.attributes.durationInMillis)} */}
                    </p>
                </>
            ))}
        </div>
    )
}

export default TrackDisplay
