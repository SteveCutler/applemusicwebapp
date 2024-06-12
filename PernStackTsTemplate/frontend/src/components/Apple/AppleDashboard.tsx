import { useState, useEffect } from 'react'
import useMusicKit from './LoadMusickit'
// import { useMusickitContext } from '../../context/MusickitContext'
import AlbumItem from '../Homepage/AlbumItem'
import DisplayRow from '../Homepage/DisplayRow'
import fetchHeavyRotation from './FetchHeavyRotation'
import FetchRecentlyPlayed from './FetchRecentlyPlayed'
import FetchRecommendations from './FetchRecommendations'

interface appleDashboardProps {
    musicUserToken: String
}

type AlbumType = {
    attributes: AttributeObject
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

const AppleDashboard = () => {
    // const [heavyRotation, setHeavyRotation] = useState<Array<AlbumType> | null>(
    //     null
    // )

    const { heavyRotation } = fetchHeavyRotation()
    const { recentlyPlayed } = FetchRecentlyPlayed()
    // const { recommendations } = FetchRecommendations()

    return (
        <div className="h-screen flex-col justify-left ">
            {/* MAIN DISPLAY */}
            {heavyRotation && (
                <DisplayRow title={'HEAVY ROTATION'} albums={heavyRotation} />
            )}
            {recentlyPlayed && (
                <DisplayRow title={'RECENTLY PLAYED'} albums={recentlyPlayed} />
            )}

            {/* NEED TO MAKE A CUSTOM HOOK FOR DISPLAYING RECOMMMENDATIONS */}
            {/* {recommendations && (
                <DisplayRow
                    title={'RECOMMENDATIONS'}
                    albums={recommendations}
                />
            )} */}
        </div>
    )
}

export default AppleDashboard
