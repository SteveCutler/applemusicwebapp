import { useState, useEffect } from 'react'
import useMusicKit from './LoadMusickit'
// import { useMusickitContext } from '../../context/MusickitContext'
import { useStore } from '../../store/store'

type AlbumTypeObject = {
    attributes?: AttributeObject
    relationships?: RelationshipObject
    id: string
}

type AttributeObject = {
    artistName: string
    artwork?: {
        height: Number
        width: Number
        url: string
    }
    dateAdded: string
    genreNames: Array<string>
    name: string
    releaseDate: string
    trackCount: Number
}

type RelationshipObject = {
    tracks: TracksObject
    artists?: { data: ArtistObject[] }
}

type ArtistObject = {
    id: string
}

type TracksObject = {
    data: Array<Track>
}
type Track = {
    attributes: TrackAttributeObject
}

type TrackAttributeObject = {
    artistName: string
    artwork: {
        height: Number
        width: Number
        url: string
    }
    dateAdded: string
    genreNames: Array<string>
    durationInMillis: Number
    name: string
    releasedDate: string
    trackCount: Number
    playParams: {
        catalogId: string
        id: string
        isLibrary: Boolean
        kind: string
    }
}

const FetchAlbumData = (albumId: string | undefined) => {
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [artistId, setArtistId] = useState<String | null>(null)

    // const musicKitLoaded = useMusicKit()
    const { musicKitInstance, authorizeMusicKit, albumData, setAlbumData } =
        useStore(state => ({
            musicKitInstance: state.musicKitInstance,
            authorizeMusicKit: state.authorizeMusicKit,
            albumData: state.albumData,
            setAlbumData: state.setAlbumData,
        }))
    // const musicKitInstance = useStore(state => state.musicKitInstance)
    // const authorizeMusicKit = useStore(state => state.authorizeMusicKit)

    useEffect(() => {
        const fetchAlbumData = async () => {
            if (!musicKitInstance) {
                await authorizeMusicKit()
                return
            }
            if (!musicKitInstance || !albumId) {
                return
            }

            try {
                console.log('albumId: ', albumId)

                if (albumId.startsWith('l')) {
                    try {
                        const res = await musicKitInstance.api.music(
                            `/v1/me/library/albums/${albumId}`
                        )
                        const artistRes = await musicKitInstance.api.music(
                            `/v1/me/library/albums/${albumId}/artists`
                        )

                        const artistId = await artistRes.data.data[0].id

                        const data: AlbumTypeObject[] = await res.data.data
                        console.log('album data:', data)
                        setAlbumData(data[0])
                        setArtistId(artistId)
                    } catch (error: any) {
                        console.error(error)
                        setError(error)
                    } finally {
                        setLoading(false)
                    }
                } else {
                    try {
                        const queryParameters = { l: 'en-us' }
                        const res = await musicKitInstance.api.music(
                            `/v1/catalog/ca/albums/${albumId}`,

                            queryParameters
                        )
                        const artistRes = await musicKitInstance.api.music(
                            `/v1/catalog/ca/albums/${albumId}/artists`,

                            queryParameters
                        )

                        const artistId = await artistRes.data.data[0].id

                        const data: AlbumTypeObject = await res.data.data[0]

                        console.log('data: ', albumData)

                        setAlbumData(data)
                        setArtistId(artistId)
                    } catch (error: any) {
                        console.error(error)
                        setError(error)
                    } finally {
                        setLoading(false)
                    }
                }
            } catch (error: any) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }

        fetchAlbumData()
    }, [musicKitInstance, albumId, authorizeMusicKit])

    return { albumData, artistId, loading, error }
}

export default FetchAlbumData
