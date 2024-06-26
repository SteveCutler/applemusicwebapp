import { useState, useEffect } from 'react'
import useMusicKit from '../../components/Apple/LoadMusickit'
// import { useMusickitContext } from '../../context/MusickitContext'
import { useStore } from '../../store/store'

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
    releaseDate: string
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

type AlbumType = {
    attributes: {
        artistName: String
        artwork?: { height: Number; width: Number; url?: String }
        dateAdded: String
        genreNames: Array<String>
        name: String
        releaseDate: String
        trackCount: Number
    }
    id: String
    href?: string
    type: string
}

const FetchArtistData = (id: string | undefined) => {
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    const [artistAlbumData, setArtistAlbumData] =
        useState<Array<AlbumType> | null>(null)

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
        const fetchArtistAlbumData = async () => {
            if (!musicKitInstance) {
                await authorizeMusicKit()
                return
            }
            if (!musicKitInstance || !id) {
                return
            }

            try {
                if (id.startsWith('r')) {
                    console.log(`${id} start with 'r'`)
                    try {
                        const albumRes = await musicKitInstance.api.music(
                            `/v1/me/library/artists/${id}/albums`
                        )

                        console.log('test album res: ', albumRes)

                        const albumData: Array<AlbumType> =
                            await albumRes.data.data
                        console.log('artist album data: ', albumData)
                        setArtistAlbumData(albumData)
                    } catch (error: any) {
                        console.error(error)
                        setError(error)
                    } finally {
                        setLoading(false)
                    }
                } else {
                    try {
                        const albumRes = await musicKitInstance.api.music(
                            `/v1/catalog/ca/artists/${id}/albums`
                        )

                        const albumData: Array<AlbumType> =
                            await albumRes.data.data

                        setArtistAlbumData(albumData)
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

        fetchArtistAlbumData()
    }, [musicKitInstance, id, authorizeMusicKit])

    return {
        artistAlbumData,
        loading,
        error,
    }
}

export default FetchArtistData