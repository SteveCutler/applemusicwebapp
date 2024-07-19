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
        appleMusicToken,
        setMoreLikeRecommendations,
    } = useStore(state => ({
        musicKitInstance: state.musicKitInstance,
        setStationsForYou: state.setStationsForYou,
        appleMusicToken: state.appleMusicToken,
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

    const shuffle = (array: any[]) => {
        console.log('array', array)
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[array[i], array[j]] = [array[j], array[i]]
        }
        return array
    }

    useEffect(() => {
        const fetchRecommendations = async () => {
            if (musicKitInstance) {
                try {
                    console.log(music)
                    const queryParameters = {
                        l: 'en-us',
                        limit: 20,
                    }
                    const res = await musicKitInstance.api.music(
                        '/v1/me/recommendations/',
                        queryParameters
                    )

                    // if (!res.ok) {
                    //     console.log('error: ', res.body)
                    // }
                    // console.log(res)

                    const data = await res.data.data
                    console.log('recommendations: ', data)
                    // console.log(
                    //     'first group: ',
                    //     data[0].relationships.contents.data
                    // )

                    setPersonalizedPlaylists(data[0])

                    const newList = [
                        data[1],
                        data[6],
                        data[0],
                        data[11],
                        data[10],
                        data[3],
                        data[12],
                        data[8],
                        data[9],
                        data[7],
                        data[2],
                        data[4],
                        data[5],
                        data[13],
                    ]

                    setRecommendations(newList)
                } catch (error: any) {
                    console.error(error)
                    setError(error)
                } finally {
                    setLoading(false)
                }
            }
        }

        if (musicKitInstance && !recommendations && appleMusicToken) {
            fetchRecommendations()
        }
    }, [musicKitInstance])

    return { recommendations, loading, error }
}

export default FetchRecommendations
