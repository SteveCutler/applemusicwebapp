import { useState, useEffect } from 'react'
import useMusicKit from './LoadMusickit'
import { useMusickitContext } from '../../context/MusickitContext'

const FetchRecentlyPlayed = (musicUserToken: String) => {
    const [recentlyPlayed, setRecentlyPlayed] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    const musicKitLoaded = useMusicKit()
    const { musicInstance: music } = useMusickitContext()

    useEffect(() => {
        const fetchRecentlyPlayed = async () => {
            if (music) {
                try {
                    console.log(music)
                    const queryParameters = { l: 'en-us', limit: 5 }
                    const res = await music.api.music(
                        '/v1/me/recent/played',
                        queryParameters
                    )

                    if (!res.ok) {
                        console.log('error: ', res.body)
                    }
                    console.log(res)

                    const data = await res.data.data
                    setRecentlyPlayed(data)
                } catch (error: any) {
                    console.error(error)
                    setError(error)
                } finally {
                    setLoading(false)
                }
            }
        }

        if (musicKitLoaded) {
            fetchRecentlyPlayed()
        }
    }, [musicUserToken, musicKitLoaded, music])

    return { recentlyPlayed, loading, error }
}

export default FetchRecentlyPlayed
