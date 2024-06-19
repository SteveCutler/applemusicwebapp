import { useState, useEffect } from 'react'
import useMusicKit from './LoadMusickit'
// import { useMusickitContext } from '../../context/MusickitContext'
import { useStore } from '../../store/store'

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

const FetchPlaylistData = (playlistId: string | undefined) => {
    const [playlistData, setPlaylistData] = useState<AlbumType | null>(null)
    const [playlistTrackData, setPlaylistTrackData] =
        useState<AlbumType | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    // const musicKitLoaded = useMusicKit()
    const musicKitInstance = useStore(state => state.musicKitInstance)
    const authorizeMusicKit = useStore(state => state.authorizeMusicKit)

    useEffect(() => {
        const fetchPlaylistData = async () => {
            if (!musicKitInstance) {
                await authorizeMusicKit()
                return
            }
            if (!musicKitInstance || !playlistId) {
                return
            }

            try {
                console.log('music kit instance and album id')
                console.log('music kit instance: ', musicKitInstance)
                console.log('playlistId: ', playlistId)

                if (playlistId.startsWith('pl')) {
                    try {
                        const queryParameters = { l: 'en-us' }
                        const trackRes = await musicKitInstance.api.music(
                            `/v1/catalog/us/playlists/${playlistId}/tracks`,

                            queryParameters
                        )
                        const playlistRes = await musicKitInstance.api.music(
                            `/v1/catalog/us/playlists/${playlistId}/`,

                            queryParameters
                        )

                        const playlistData = await playlistRes.data.data
                        const trackData = await trackRes.data.data

                        setPlaylistTrackData(trackData)
                        setPlaylistData(playlistData[0])
                    } catch (error: any) {
                        console.error(error)
                        setError(error)
                    } finally {
                        setLoading(false)
                    }
                } else if (playlistId.startsWith('p')) {
                    try {
                        const trackRes = await musicKitInstance.api.music(
                            `/v1/me/library/playlists/${playlistId}/tracks`
                        )
                        const playlistRes = await musicKitInstance.api.music(
                            `/v1/me/library/playlists/${playlistId}/`
                        )

                        const trackData = await trackRes.data.data
                        const playlistData = await playlistRes.data.data

                        setPlaylistTrackData(trackData)
                        setPlaylistData(playlistData[0])
                    } catch (error: any) {
                        console.error(error)
                        setError(error)
                    } finally {
                        setLoading(false)
                    }
                }
            } catch (error: any) {
                console.error(error)
                console.log('error in fetchPlaylistData')
            } finally {
                setLoading(false)
            }
        }

        fetchPlaylistData()
    }, [musicKitInstance, playlistId, authorizeMusicKit])

    return { playlistData, playlistTrackData, loading, error }
}

export default FetchPlaylistData
