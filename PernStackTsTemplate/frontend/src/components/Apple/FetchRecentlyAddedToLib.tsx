import { useState, useEffect } from 'react'
import useMusicKit from './LoadMusickit'
import { useMusickitContext } from '../../context/MusickitContext'
import { useStore } from '../../store/store'

type RecentlyAddedItem = AlbumType | playlist | StationType | Song

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

type playlist = {
    attributes: {
        artwork?: {
            bgColor: string
            url: string
        }
        description?: string
        curatorName?: string
        canEdit: boolean
        playlistType?: string
        dataAdded: string
        isPublic: boolean
        lastModifiedDate: string
        name: string
    }
    href: string
    id: string
    type: string
}

type AlbumType = {
    attributes: AttributeObject
    id: String
    type: string
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

type ArtworkObject = {
    height: Number
    width: Number
    url: String
}
interface Album {
    id: string
    albumId: string
    name: string
    artistName: string
    artworkUrl: string
    trackCount: number
}

interface StationType {
    attributes: {
        artwork: {
            bgColor: string
            url: string
        }
        mediaKind: string
        name: string
        url: string
        playParams: {
            format: string
            id: string
            kind: string
            stationHash: string
        }
    }
    id: String
    type: string
}

const FetchRecentlyAddedToLib = () => {
    const { musicKitInstance, setRecentlyAddedToLib, recentlyAddedToLib } =
        useStore(state => ({
            musicKitInstance: state.musicKitInstance,
            recentlyAddedToLib: state.recentlyAddedToLib,
            setRecentlyAddedToLib: state.setRecentlyAddedToLib,
        }))
    // const [recommendations, setRecommendations] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    // const musicKitLoaded = useMusicKit()
    const { musicInstance: music } = useMusickitContext()

    useEffect(() => {
        const fetchRecentlyAddedToLib = async (url: string) => {
            if (musicKitInstance) {
                try {
                    console.log(music)
                    const queryParameters = { l: 'en-us', limit: 5 }
                    const res = await musicKitInstance.api.music(
                        url,
                        queryParameters
                    )

                    if (!res.ok) {
                        console.log('error: ', res.body)
                    }
                    // console.log(res)

                    const data: RecentlyAddedItem[] = await res.data.data
                    setRecentlyAddedToLib(
                        (prevData: RecentlyAddedItem[] = []) => {
                            const updatedData = [...prevData, ...data]
                            return updatedData.slice(0, 30) // Limit to 30 items
                        }
                    )

                    // Check if there is a next URL for pagination and the current data length is less than 30
                    if (res.data.next && recentlyAddedToLib.length < 30) {
                        await fetchRecentlyAddedToLib(res.data.next)
                    }
                } catch (error: any) {
                    console.error(error)
                    setError(error)
                } finally {
                    setLoading(false)
                }
            }
        }

        if (musicKitInstance) {
            fetchRecentlyAddedToLib('/v1/me/library/recently-added')
        }
    }, [musicKitInstance, setRecentlyAddedToLib])

    return { loading, error }
}

export default FetchRecentlyAddedToLib
