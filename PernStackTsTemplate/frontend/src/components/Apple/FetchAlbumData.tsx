import { useState, useEffect } from 'react'
import useMusicKit from './LoadMusickit'
// import { useMusickitContext } from '../../context/MusickitContext'
import { useStore } from '../../store/store'

type AlbumType = {
    attributes: AttributeObject
    relationships: RelationshipObject
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
    artistName: String
    artwork: ArtworkObject
    dateAdded: String
    genreNames: Array<String>
    durationInMillis: Number
    name: String
    releasedDate: String
    trackCount: Number
    playParams: PlayParameterObject
}

type PlayParameterObject = {
    catalogId: String
    id: String
    isLibrary: Boolean
    kind: String
}

type ArtworkObject = {
    height: Number
    width: Number
    url: String
}

const FetchAlbumData = (albumId: String | undefined) => {
    const [albumData, setAlbumData] = useState<AlbumType | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    const musicKitLoaded = useMusicKit()
    const musicKitInstance = useStore(state => state.musicKitInstance)

    useEffect(() => {
        const fetchAlbumData = async () => {
            if (musicKitInstance) {
                if (albumId?.startsWith('l')) {
                    try {
                        const res = await musicKitInstance.api.music(
                            `/v1/me/library/albums/${albumId}`
                        )

                        if (!res.ok) {
                            console.log('error: ', res.body)
                        }
                        console.log(res)

                        const data = await res.data.data
                        setAlbumData(data[0])
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
                            `/v1/catalog/{{storefrontId}}/albums/${albumId}`,
                            queryParameters
                        )

                        if (!res.ok) {
                            console.log('error: ', res.body)
                        }
                        console.log(res)

                        const data = await res.data.data
                        setAlbumData(data[0])
                    } catch (error: any) {
                        console.error(error)
                        setError(error)
                    } finally {
                        setLoading(false)
                    }
                }
            }
        }

        if (musicKitInstance) {
            fetchAlbumData()
        }
    }, [musicKitInstance, albumId])

    return { albumData, loading, error }
}

export default FetchAlbumData
