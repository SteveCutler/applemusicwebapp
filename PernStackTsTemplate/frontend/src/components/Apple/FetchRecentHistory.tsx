import { useState, useEffect } from 'react'
import useMusicKit from './LoadMusickit'
import { useMusickitContext } from '../../context/MusickitContext'
import { useStore } from '../../store/store'

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

const FetchRecentHistory = () => {
    const { musicKitInstance, setRecentHistory, recentHistory } = useStore(
        state => ({
            musicKitInstance: state.musicKitInstance,
            recentlyAddedToLib: state.recentlyAddedToLib,
            setRecentHistory: state.setRecentHistory,
            recentHistory: state.recentHistory,
        })
    )
    // const [recommendations, setRecommendations] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    // const musicKitLoaded = useMusicKit()
    const { musicInstance: music } = useMusickitContext()

    useEffect(() => {
        const fetchRecentHistory = async (url: string) => {
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
                    console.log(res)

                    const data: Song[] = await res.data.data
                    setRecentHistory((prevData: Song[] = []) => {
                        const updatedData = [...prevData, ...data]
                        return updatedData.slice(0, 30) // Limit to 30 items
                    })

                    // Check if there is a next URL for pagination and the current data length is less than 30
                    if (res.data.next && recentHistory.length < 30) {
                        await fetchRecentHistory(res.data.next)
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
            fetchRecentHistory('/v1/me/recent/played/tracks')
        }
    }, [musicKitInstance, setRecentHistory])

    return { loading, error }
}

export default FetchRecentHistory
