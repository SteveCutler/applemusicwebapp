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
        themedRecommendations,
        setHeavyRotation,
        recommendations,
        recentlyPlayedAlbums,
        personalizedPlaylists,
        recentlyPlayed,
        moreLikeRecommendations,
        stationsForYou,
    } = useStore(state => ({
        musicKitInstance: state.musicKitInstance,
        moreLikeRecommendations: state.moreLikeRecommendations,
        themedRecommendations: state.themedRecommendations,
        personalizedPlaylists: state.personalizedPlaylists,
        recommendations: state.recommendations,
        authorizeMusicKit: state.authorizeMusicKit,
        heavyRotation: state.heavyRotation,
        recentlyPlayedAlbums: state.recentlyPlayedAlbums,
        setHeavyRotation: state.setHeavyRotation,
        recentlyPlayed: state.recentlyPlayed,
        stationsForYou: state.stationsForYou,
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

    // console.log('heavy rotation: ', heavyRotation)
    // console.log('recently played: ', recentlyPlayed)
    // console.log('recommendations: ', recommendations)
    // console.log('recentlyplayedalbums', recentlyPlayedAlbums)
    // console.log('personalizedPlaylists: ', personalizedPlaylists)
    // console.log('themed recos: ', themedRecommendations)

    return (
        <div className="h-screen flex-col justify-left ">
            {/* MAIN DISPLAY */}
            {heavyRotation && (
                <DisplayRow title={'Heavy Rotation'} albums={heavyRotation} />
            )}
            {recentlyPlayed && (
                <DisplayRow title={'Recently Played'} albums={recentlyPlayed} />
            )}

            {/* NEED TO MAKE A CUSTOM HOOK FOR DISPLAYING RECOMMMENDATIONS */}
            {personalizedPlaylists && (
                <DisplayRow
                    title={
                        personalizedPlaylists.attributes.title.stringForDisplay
                    }
                    albums={personalizedPlaylists.relationships.contents.data}
                />
            )}
            {recentlyPlayedAlbums && (
                <DisplayRow
                    title={
                        recentlyPlayedAlbums.attributes.title.stringForDisplay
                    }
                    albums={recentlyPlayedAlbums.relationships.contents.data}
                />
            )}
            {themedRecommendations && (
                <DisplayRow
                    title={
                        themedRecommendations.attributes.title.stringForDisplay
                    }
                    albums={themedRecommendations.relationships.contents.data}
                />
            )}
            {moreLikeRecommendations && (
                <DisplayRow
                    title={
                        moreLikeRecommendations.attributes.title
                            .stringForDisplay
                    }
                    id={moreLikeRecommendations.attributes.title.contentIds[0]}
                    albums={moreLikeRecommendations.relationships.contents.data}
                />
            )}
            {stationsForYou && (
                <DisplayRow
                    title={stationsForYou.attributes.title.stringForDisplay}
                    albums={stationsForYou.relationships.contents.data}
                />
            )}
        </div>
    )
}

export default AppleDashboard
