import { useState, useEffect } from 'react'
import { useStore } from '../../store/store'
const FetchHeavyRotation = () => {
    const {
        appleMusicToken,
        musicKitInstance,
        heavyRotation,
        setHeavyRotation,
    } = useStore(state => ({
        appleMusicToken: state.appleMusicToken,
        heavyRotation: state.heavyRotation,
        setHeavyRotation: state.setHeavyRotation,
        musicKitInstance: state.musicKitInstance,
    }))
    // const [heavyRotation, setHeavyRotation] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchHeavyRotation = async () => {
            if (musicKitInstance) {
                try {
                    const res = await musicKitInstance.api.music(
                        '/v1/me/history/heavy-rotation',
                        {
                            headers: {
                                Authorization: `Bearer ${import.meta.env.VITE_MUSICKIT_DEVELOPER_TOKEN}`,
                                //'music-user-token': appleMusicToken,
                            },
                        }
                    )

                    const data = await res.data.data
                    console.log('heavy rotation data: ', data)
                    {
                        data.length >= 1 && setHeavyRotation(data)
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
            fetchHeavyRotation()
        }
    }, [musicKitInstance])

    return { heavyRotation, loading, error }
}

export default FetchHeavyRotation
