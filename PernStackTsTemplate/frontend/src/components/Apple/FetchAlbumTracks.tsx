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

const FetchAlbumTracks = async (albumId: string | undefined) => {
    // const musicKitLoaded = useMusicKit()
    const { musicKitInstance, authorizeMusicKit } = useStore(state => ({
        musicKitInstance: state.musicKitInstance,
        authorizeMusicKit: state.authorizeMusicKit,
        albumData: state.albumData,
        setAlbumData: state.setAlbumData,
    }))
    // const musicKitInstance = useStore(state => state.musicKitInstance)
    // const authorizeMusicKit = useStore(state => state.authorizeMusicKit)

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
                    `/v1/me/library/albums/${albumId}/tracks`
                )

                console.log(res)

                const data = await res.data.data
                return data
            } catch (error: any) {
                console.error(error)
            }
        } else {
            try {
                const queryParameters = { l: 'en-us' }
                const res = await musicKitInstance.api.music(
                    `/v1/catalog/{{storefrontId}}/albums/${albumId}/tracks`,

                    queryParameters
                )

                console.log(res)

                const data = await res.data.data

                return data
            } catch (error: any) {
                console.error(error)
            }
        }
    } catch (error: any) {
        console.error(error)
    }
}

export default FetchAlbumTracks
