import { useState, useEffect } from 'react'
import { useStore } from '../../store/store'
const FetchHeavyRotation = () => {
    const { appleMusicToken, musicKitInstance } = useStore(state => ({
        appleMusicToken: state.appleMusicToken,
        musicKitInstance: state.musicKitInstance,
    }))
    const [heavyRotation, setHeavyRotation] = useState<any[]>([])
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
                                'music-user-token': appleMusicToken,
                            },
                        }
                    )

                    if (!res.ok) {
                        console.log('error: ', res.body)
                    }
                    console.log(res)

                    const data = await res.data.data
                    setHeavyRotation(data)
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
    }, [appleMusicToken, musicKitInstance])

    return { heavyRotation, loading, error }
}

export default FetchHeavyRotation
