import { useState, useEffect } from 'react'
import useMusicKit from './LoadMusickit'
import { useMusickitContext } from '../../context/MusickitContext'
import { useStore } from '../../store/store'

const FetchRecommendations = () => {
    const {
        musicKitInstance,
        recommendations,
        setPersonalizedPlaylists,
        setThemedRecommendations,
        setRecommendations,
        setStationsForYou,
        setRecentlyPlayedAlbums,
        setMoreLikeRecommendations,
    } = useStore(state => ({
        musicKitInstance: state.musicKitInstance,
        setStationsForYou: state.setStationsForYou,
        setMoreLikeRecommendations: state.setMoreLikeRecommendations,
        setThemedRecommendations: state.setThemedRecommendations,
        setRecentlyPlayedAlbums: state.setRecentlyPlayedAlbums,
        setPersonalizedPlaylists: state.setPersonalizedPlaylists,
        recommendations: state.recommendations,
        setRecommendations: state.setRecommendations,
    }))
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
                    // console.log(res)

                    const data = await res.data.data
                    // console.log(
                    //     'first group: ',
                    //     data[0].relationships.contents.data
                    // )

                    setPersonalizedPlaylists(data[0])
                    setRecentlyPlayedAlbums(data[1])
                    setThemedRecommendations(data[2])
                    setMoreLikeRecommendations(data[3])
                    setStationsForYou(data[4])
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
