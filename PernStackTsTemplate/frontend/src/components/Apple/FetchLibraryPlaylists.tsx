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

interface Song {
    id: string
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
    }
}

// const musicKitLoaded = useMusicKit()
// const musicKitInstance = useStore(state => state.musicKitInstance)
// const authorizeMusicKit = useStore(state => state.authorizeMusicKit)

export const fetchLibraryPlaylists = async () => {
    const { musicKitInstance, authorizeMusicKit } = useStore(state => ({
        musicKitInstance: state.musicKitInstance,
        authorizeMusicKit: state.authorizeMusicKit,
    }))
    if (!musicKitInstance) {
        await authorizeMusicKit()
        return
    }

    try {
        try {
            const res = await musicKitInstance.api.music(
                '/v1/me/library/playlists'
            )
            const playlists = res.data.data
            console.log('User Playlists:', playlists)

            return playlists
        } catch (error: any) {
            console.error(error)
            // setError(error)
        } finally {
            // setLoading(false)
        }
    } catch (error: any) {
        console.error(error)
    } finally {
        // setLoading(false)
    }
}
