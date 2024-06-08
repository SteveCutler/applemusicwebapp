import { useState, useEffect } from 'react'
import useMusicKit from './LoadMusickit'
// import { useMusickitContext } from '../../context/MusickitContext'
import { useStore } from '../../store/store'

const FetchRecentlyPlayed = () => {
    const musicKitInstance = useStore(state => state.musicKitInstance)
    const [recentlyPlayed, setRecentlyPlayed] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchRecentlyPlayed = async () => {
            if (musicKitInstance) {
                try {
                    const queryParameters = { l: 'en-us', limit: 5 }
                    const res = await musicKitInstance.api.music(
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

        if (musicKitInstance) {
            fetchRecentlyPlayed()
        }
    }, [musicKitInstance])

    return { recentlyPlayed, loading, error }
}

export default FetchRecentlyPlayed
