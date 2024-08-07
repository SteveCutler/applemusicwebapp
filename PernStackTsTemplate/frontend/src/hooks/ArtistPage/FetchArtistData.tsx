import { useState, useEffect } from 'react'
import useMusicKit from '../../components/Apple/LoadMusickit'
// import { useMusickitContext } from '../../context/MusickitContext'
import { useStore } from '../../store/store'

type AlbumType = {
    attributes?: AttributeObject
    relationships: RelationshipObject
    id: string
}

type playlist = {
    attributes: {
        canEdit: boolean
        dataAdded: string
        isPublic: boolean
        lastModifiedDate: string
        name: string
        artwork?: {
            url: string
        }
    }
    href: string
    id: string
    type: string
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

type Artist = {
    attributes: {
        artwork: {
            bgColor: string
            url: string
        }
        genreNames: Array<string>
        name: string
        url: string
    }
    relationships?: {
        albums?: {
            href: string
            data: Array<AlbumRelationships>
        }
    }
    id: string
    type: string
}

type AlbumRelationships = {
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

type AlbumData = {
    attributes: {
        artistName: string
        artwork: {
            bgColor: string
            url: string
        }
        editorialNotes: {
            short: string
            standard: string
        }
        genreName: Array<string>
        name: string
        trackCount: number
        url: string
    }
    href: string
    id: string
    type: string
}

const FetchArtistData = (id: string | undefined) => {
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [artistData, setArtistData] = useState<Artist | null>(null)

    // const musicKitLoaded = useMusicKit()
    const { musicKitInstance, authorizeMusicKit } = useStore(state => ({
        musicKitInstance: state.musicKitInstance,

        authorizeMusicKit: state.authorizeMusicKit,
        albumData: state.albumData,
        setAlbumData: state.setAlbumData,
    }))

    // const musicKitInstance = useStore(state => state.musicKitInstance)
    // const authorizeMusicKit = useStore(state => state.authorizeMusicKit)

    useEffect(() => {
        const fetchArtistData = async () => {
            if (!musicKitInstance) {
                await authorizeMusicKit()
                return
            }
            if (!musicKitInstance || !id) {
                return
            }

            try {
                if (id.startsWith('r')) {
                    try {
                        console.log(`${id} start with 'r'`)
                        const catId = await musicKitInstance.api.music(
                            `/v1/me/library/artists/${id}/catalog`
                        )

                        // const catData = await catId.json()

                        if (catId.response.status === 200) {
                            try {
                                const res = await musicKitInstance.api.music(
                                    `/v1/catalog/${musicKitInstance.storefrontId}/artists/${catId.data.data[0].id}`
                                )

                                const data: Artist = await res.data.data[0]

                                setArtistData(data)
                            } catch (error: any) {
                                console.error(error)
                                setError(error)
                            } finally {
                                setLoading(false)
                            }
                        } else {
                            const res = await musicKitInstance.api.music(
                                `/v1/me/library/artists/${id}`
                            )

                            console.log('artist data', catData)

                            const data: Artist = await res.data.data[0]

                            setArtistData(data)
                        }
                    } catch (error: any) {
                        console.error(error)
                        setError(error)
                    } finally {
                        setLoading(false)
                    }
                } else {
                    try {
                        const res = await musicKitInstance.api.music(
                            `/v1/catalog/${musicKitInstance.storefrontId}/artists/${id}`
                        )

                        const data: Artist = await res.data.data[0]

                        setArtistData(data)
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

        if (!artistData) {
            fetchArtistData()
        }
    }, [musicKitInstance, id, authorizeMusicKit])

    return {
        artistData,

        loading,
        error,
    }
}

export default FetchArtistData
