import { useState, useEffect } from 'react'
import useMusicKit from './LoadMusickit'
import { useMusickitContext } from '../../context/MusickitContext'

const FetchHeavyRotation = (musicUserToken: String) => {
    const [heavyRotation, setHeavyRotation] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    const musicKitLoaded = useMusicKit()
    const { musicInstance: music } = useMusickitContext()

    useEffect(() => {
        const fetchHeavyRotation = async () => {
            if (music) {
                try {
                    console.log(music)

                    const res = await music.api.music(
                        '/v1/me/history/heavy-rotation',
                        {
                            headers: {
                                Authorization: `Bearer ${import.meta.env.VITE_MUSICKIT_DEVELOPER_TOKEN}`,
                                'music-user-token': musicUserToken,
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

        if (musicKitLoaded) {
            fetchHeavyRotation()
        }
    }, [musicUserToken, musicKitLoaded, music])

    return { heavyRotation, loading, error }
}

export default FetchHeavyRotation
