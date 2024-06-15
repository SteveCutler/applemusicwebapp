import { useState, useEffect } from 'react'
import useMusicKit from './LoadMusickit'
// import { useMusickitContext } from '../../context/MusickitContext'
import { useStore } from '../../store/store'

type AlbumType = {
    attributes?: AttributeObject
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

const FetchAlbumData = (albumId: string | undefined) => {
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

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
                console.log('music kit instance and album id')
                console.log('music kit instance: ', musicKitInstance)
                console.log('albumId: ', albumId)

                if (albumId.startsWith('l')) {
                    try {
                        const res = await musicKitInstance.api.music(
                            `/v1/me/library/albums/${albumId}`
                        )

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

                        // console.log(res)

                        const data = await res.data.data

                        console.log('data: ', albumData)

                        setAlbumData(data[0])
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

    return { albumData, loading, error }
}

export default FetchAlbumData
