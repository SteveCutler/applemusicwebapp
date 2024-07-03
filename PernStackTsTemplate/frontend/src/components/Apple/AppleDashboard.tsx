import { useState, useEffect } from 'react'
import useMusicKit from './LoadMusickit'
// import { useMusickitContext } from '../../context/MusickitContext'
import AlbumItem from '../Homepage/AlbumItem'
import DisplayRow from '../Homepage/DisplayRow'
import fetchHeavyRotation from './FetchHeavyRotation'
import FetchRecentlyPlayed from './FetchRecentlyPlayed'
import FetchRecommendations from './FetchRecommendations'
import { useStore } from '../../store/store'
import FetchRecentlyAddedToLib from './FetchRecentlyAddedToLib'

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
        recentlyAddedToLib,
        moreLikeRecommendations,
        stationsForYou,
    } = useStore(state => ({
        musicKitInstance: state.musicKitInstance,
        recentlyAddedToLib: state.recentlyAddedToLib,
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

    const constructImageUrl = (url: String, size: Number) => {
        return url
            .replace('{w}', size.toString())
            .replace('{h}', size.toString())
    }
    const [moreLikeAlbumImage, setMoreLikeAlbumImage] = useState<string | null>(
        null
    )
    // const [heavyRotation, setHeavyRotation] = useState<Array<AlbumType> | null>(
    //     null
    // )
    console.log('more like recommendations: ', moreLikeRecommendations)

    useEffect(() => {
        if (!musicKitInstance) {
            authorizeMusicKit()
        }

        const retrieveMoreLikeImage = async () => {
            try {
                if (
                    moreLikeRecommendations.attributes.title.contentIds[0].startsWith(
                        'l'
                    )
                ) {
                    try {
                        const res = await musicKitInstance.api.music(
                            `/v1/me/library/albums/${moreLikeRecommendations.attributes.title.contentIds[0]}`
                        )

                        const data =
                            await res.data.data[0].attributes.artwork.url

                        console.log('data1: ', data)
                        {
                            data && setMoreLikeAlbumImage(data)
                        }
                    } catch (error: any) {
                        console.error(error)
                    }
                } else {
                    try {
                        const queryParameters = { l: 'en-us' }
                        const res = await musicKitInstance.api.music(
                            `/v1/catalog/ca/albums/${moreLikeRecommendations.attributes.title.contentIds[0]}`,

                            queryParameters
                        )

                        const data =
                            await res.data.data[0].attributes.artwork.url

                        console.log('data2: ', data)

                        {
                            data && setMoreLikeAlbumImage(data)
                        }
                    } catch (error: any) {
                        console.error(error)
                    }
                }
            } catch (error: any) {
                console.error(error)
            }
        }

        if (!moreLikeAlbumImage && moreLikeRecommendations) {
            console.log('running image retrieval')
            retrieveMoreLikeImage()
        }
    }, [musicKitInstance, moreLikeRecommendations])

    fetchHeavyRotation()
    FetchRecentlyPlayed()
    FetchRecommendations()

    // const { recommendations } = FetchRecommendations()

    // Recently played tracks: https://api.music.apple.com/v1/me/recent/played/tracks
    // Recently played stations: https://api.music.apple.com/v1/me/recent/radio-stations
    // Get recommendation based on ID https://api.music.apple.com/v1/me/recommendations/{id}

    return (
        <div className="h-100vh flex-col flex-grow flex justify-center ">
            {/* MAIN DISPLAY */}
            {recentlyAddedToLib && (
                <DisplayRow
                    title={'Recently Added to Library'}
                    albums={recentlyAddedToLib}
                />
            )}
            {/* {recentlyPlayed && (
                <DisplayRow title={'Recently Played'} albums={recentlyPlayed} />
            )} */}
            {recentlyPlayedAlbums && (
                <DisplayRow
                    title={
                        recentlyPlayedAlbums.attributes.title.stringForDisplay
                    }
                    albums={recentlyPlayedAlbums.relationships.contents.data}
                />
            )}

            {heavyRotation && (
                <DisplayRow title={'Heavy Rotation'} albums={heavyRotation} />
            )}
            {/* {recentlyPlayed && (
                <DisplayRow title={'Recently Played'} albums={recentlyPlayed} />
            )} */}

            {/* NEED TO MAKE A CUSTOM HOOK FOR DISPLAYING RECOMMMENDATIONS */}
            {personalizedPlaylists && (
                <DisplayRow
                    title={
                        personalizedPlaylists.attributes.title.stringForDisplay
                    }
                    albums={personalizedPlaylists.relationships.contents.data}
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
                    url={
                        moreLikeAlbumImage &&
                        constructImageUrl(moreLikeAlbumImage, 100)
                    }
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
