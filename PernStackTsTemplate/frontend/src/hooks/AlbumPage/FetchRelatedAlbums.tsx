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

const FetchRelatedAlbums = (albumId: string | undefined) => {
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [relatedAlbums, setRelatedAlbums] = useState<string | null>(null)

    // const musicKitLoaded = useMusicKit()
    const { musicKitInstance, authorizeMusicKit } = useStore(state => ({
        musicKitInstance: state.musicKitInstance,
        authorizeMusicKit: state.authorizeMusicKit,
    }))
    // const musicKitInstance = useStore(state => state.musicKitInstance)
    // const authorizeMusicKit = useStore(state => state.authorizeMusicKit)

    const fetchRelatedAlbums = async () => {
        if (!musicKitInstance) {
            await authorizeMusicKit()
            return
        }
        setLoading(true)

        try {
            const res = await musicKitInstance?.api.music(
                `v1/catalog/ca/albums/${albumId}/view/related-albums`
            )

            const catalogId = await res.data.data
            console.log('related albums:', res)

            setRelatedAlbums(catalogId)
        } catch (error: any) {
            console.error(error)
            setError(error)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchRelatedAlbums()
    }, [musicKitInstance])

    return { relatedAlbums, loading, error }
}

export default FetchRelatedAlbums
