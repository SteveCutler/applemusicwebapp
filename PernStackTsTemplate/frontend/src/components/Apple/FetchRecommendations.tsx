import { useState, useEffect } from 'react'
import useMusicKit from './LoadMusickit'
import { useMusickitContext } from '../../context/MusickitContext'
import { useStore } from '../../store/store'

const FetchRecommendations = () => {
    const { musicKitInstance, recommendations, setRecommendations } = useStore(
        state => ({
            musicKitInstance: state.musicKitInstance,
            recommendations: state.recommendations,
            setRecommendations: state.setRecommendations,
        })
    )
    // const [recommendations, setRecommendations] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    // const musicKitLoaded = useMusicKit()
    const { musicInstance: music } = useMusickitContext()

    useEffect(() => {
        const fetchRecommendations = async () => {
            if (musicKitInstance) {
                try {
                    console.log(music)
                    const queryParameters = { l: 'en-us', limit: 5 }
                    const res = await musicKitInstance.api.music(
                        '/v1/me/recommendations',
                        queryParameters
                    )

                    if (!res.ok) {
                        console.log('error: ', res.body)
                    }
                    console.log(res)

                    const data = await res.data.data
                    setRecommendations(data)
                } catch (error: any) {
                    console.error(error)
                    setError(error)
                } finally {
                    setLoading(false)
                }
            }
        }

        if (musicKitInstance) {
            fetchRecommendations()
        }
    }, [musicKitInstance])

    return { recommendations, loading, error }
}

export default FetchRecommendations
