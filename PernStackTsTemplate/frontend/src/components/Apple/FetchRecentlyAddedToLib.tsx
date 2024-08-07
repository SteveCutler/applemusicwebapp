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
    const {
        musicKitInstance,
        setRecentlyAddedToLib,
        appleMusicToken,
        backendToken,
        recentlyAddedToLib,
    } = useStore(state => ({
        musicKitInstance: state.musicKitInstance,
        appleMusicToken: state.appleMusicToken,
        backendToken: state.backendToken,
        recentlyAddedToLib: state.recentlyAddedToLib,
        setRecentlyAddedToLib: state.setRecentlyAddedToLib,
    }))
    // const [recommendations, setRecommendations] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    // const musicKitLoaded = useMusicKit()
    const { musicInstance: music } = useMusickitContext()
    const recent: RecentlyAddedItem[] = []

    useEffect(() => {
        const fetchRecentlyAddedToLib = async (url: string) => {
            if (musicKitInstance) {
                try {
                    // console.log(music)
                    const queryParameters = { l: 'en-us', limit: 10 }
                    const res = await musicKitInstance.api.music(
                        url,
                        queryParameters
                    )

                    if (res.status !== 200) {
                        // console.log('error: ', res.body)
                    }
                    // console.log(res)

                    const data: RecentlyAddedItem[] = await res.data.data
                    recent.push(...data)

                    // console.log('recent lib: ', recent)
                    // setRecentlyAddedToLib((prevData: RecentlyAddedItem[]) => {
                    //     const updatedData = [...prevData, ...data]
                    //     console.log('updated data: ', updatedData)
                    //     return updatedData.slice(0, 30) // Limit to 30 items
                    // })

                    // Check if there is a next URL for pagination and the current data length is less than 30
                    if (res.data.next && recent.length <= 20) {
                        await fetchRecentlyAddedToLib(res.data.next)
                    } else {
                        setRecentlyAddedToLib(recent)
                    }
                } catch (error: any) {
                    console.error(error)
                    setError(error)
                } finally {
                    setLoading(false)
                }
            }
        }

        if (musicKitInstance && backendToken) {
            fetchRecentlyAddedToLib('/v1/me/library/recently-added')
        }
    }, [musicKitInstance, backendToken, appleMusicToken])

    return { loading, error }
}

export default FetchRecentlyAddedToLib
