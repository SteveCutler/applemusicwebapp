import { useState, useEffect } from 'react'
import useMusicKit from './LoadMusickit'
// import { useMusickitContext } from '../../context/MusickitContext'
import AlbumItem from '../Homepage/AlbumItem'
import DisplayRow from '../Homepage/DisplayRow'
import fetchHeavyRotation from './FetchHeavyRotation'
import FetchRecentlyPlayed from './FetchRecentlyPlayed'
import FetchRecommendations from './FetchRecommendations'
import { useStore } from '../../store/store'

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
    const {
        musicKitInstance,
        authorizeMusicKit,
        heavyRotation,
        setHeavyRotation,
        recommendations,
        recentlyPlayed,
    } = useStore(state => ({
        musicKitInstance: state.musicKitInstance,
        recommendations: state.recommendations,
        authorizeMusicKit: state.authorizeMusicKit,
        heavyRotation: state.heavyRotation,
        setHeavyRotation: state.setHeavyRotation,
        recentlyPlayed: state.recentlyPlayed,
    }))
    // const [heavyRotation, setHeavyRotation] = useState<Array<AlbumType> | null>(
    //     null
    // )

    useEffect(() => {
        authorizeMusicKit
    }, [])
    fetchHeavyRotation()
    FetchRecentlyPlayed()
    FetchRecommendations()

    console.log('heavy rotation: ', heavyRotation)
    console.log('recently played: ', recentlyPlayed)
    console.log('recommendations: ', recommendations)

    // const { recommendations } = FetchRecommendations()
    // Recently Added Endpoint: /v1/me/library/recently-added
    // Recently played tracks: https://api.music.apple.com/v1/me/recent/played/tracks
    // Recently played stations: https://api.music.apple.com/v1/me/recent/radio-stations
    // Get recommendation based on ID https://api.music.apple.com/v1/me/recommendations/{id}

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
