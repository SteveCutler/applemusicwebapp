import React from 'react'
import Track from './Track'

type TracksObject = {
    albumTracks: Song[]
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

type TrackAttributeObject = {
    artistName: string
    dateAdded: string
    genreNames: Array<string>
    name: string
    releasedDate: string
    trackCount: number
    playParams: PlayParameterObject
    durationInMillis: number
    trackNumber: number
}

type PlayParameterObject = {
    catalogId: string
    id: string
    isLibrary: Boolean
    kind: string
}
const TrackDisplay = ({ albumTracks }: TracksObject) => {
    console.log('album tracks', albumTracks)

    const convertToDuration = (milliseconds: Number) => {
        console.log('millis,', milliseconds)
        if (typeof milliseconds !== 'number' || milliseconds < 0) {
            // throw new Error('Input must be a non-negative number')
            return ''
        }

        const totalSeconds = Math.floor(milliseconds / 1000)
        const minutes = Math.floor(totalSeconds / 60)
        const seconds = totalSeconds % 60

        const formattedMinutes = minutes.toString().padStart(2, '0')
        const formattedSeconds = seconds.toString().padStart(2, '0')

        return `${formattedMinutes}:${formattedSeconds}`
    }

    return (
        <div className="flex-col  w-full justify-between items-between ">
            {albumTracks.map((song, index: number) => (
                <>
                    <Track
                        key={index}
                        index={index}
                        trackDuration={convertToDuration(
                            song.attributes.durationInMillis
                        )}
                        albumTracks={albumTracks}
                        song={song}
                        first={index === 0}
                        last={index === albumTracks.length - 1}
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
