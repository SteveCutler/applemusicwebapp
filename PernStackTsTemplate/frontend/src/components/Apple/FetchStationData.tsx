import { useState, useEffect } from 'react'
import useMusicKit from './LoadMusickit'
// import { useMusickitContext } from '../../context/MusickitContext'
import { useStore } from '../../store/store'

type AlbumType = {
    attributes?: AttributeObject
    relationships: RelationshipObject
    id: string
}

type StationType = {
    attributes: {
        artwork: {
            bgColor: string
            url: string
        }
        mediaKind: string
        name: string
    }
    href: string
    id: string
    type: string
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

const FetchStationData = (stationId: string | undefined) => {
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [stationData, setStationData] = useState<StationType | null>(null)

    // const musicKitLoaded = useMusicKit()
    const { musicKitInstance, authorizeMusicKit } = useStore(state => ({
        musicKitInstance: state.musicKitInstance,

        authorizeMusicKit: state.authorizeMusicKit,
    }))
    // const musicKitInstance = useStore(state => state.musicKitInstance)
    // const authorizeMusicKit = useStore(state => state.authorizeMusicKit)

    useEffect(() => {
        const fetchStationData = async () => {
            if (!musicKitInstance) {
                await authorizeMusicKit()
                return
            }
            if (!musicKitInstance || !stationId) {
                return
            }

            try {
                console.log('music kit instance and album id')
                console.log('music kit instance: ', musicKitInstance)
                console.log('stationId: ', stationId)

                if (stationId.startsWith('ra.u')) {
                    try {
                        const res = await musicKitInstance.api.music(
                            `/v1/catalog/${musicKitInstance.storefrontId}/stations/${stationId}`
                        )

                        const data = await res.data.data
                        console.log('station info: ', data)
                        setStationData(data[0])
                        // setAlbumData(data[0])
                    } catch (error: any) {
                        console.error(error)
                        setError(error)
                    } finally {
                        setLoading(false)
                    }
                } else {
                    try {
                        const res = await musicKitInstance.api.music(
                            `/v1/catalog/${musicKitInstance.storefrontId}/stations/${stationId}`
                        )

                        // console.log(res)

                        const data = await res.data.data

                        console.log('station info: ', data)

                        // setAlbumData(data[0])
                        setStationData(data[0])
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

        fetchStationData()
    }, [musicKitInstance, stationId, authorizeMusicKit])

    return { stationData, loading, error }
}

export default FetchStationData
