import { useState, useEffect } from 'react'
import useMusicKit from './LoadMusickit'
// import { useMusickitContext } from '../../context/MusickitContext'
import { useStore } from '../../store/store'

type playlist = {
    attributes: {
        canEdit: boolean
        dataAdded: string
        isPublic: boolean
        lastModifiedDate: string
        name: string
        artwork?: {
            url: string
        }
    }
    href: string
    id: string
    type: string
}

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

const FetchPlaylistData = (playlistId: string | undefined) => {
    const [playlistData, setPlaylistData] = useState<playlist | null>(null)
    const [playlistTrackData, setPlaylistTrackData] = useState<Song[] | null>(
        null
    )
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    // const musicKitLoaded = useMusicKit()
    const musicKitInstance = useStore(state => state.musicKitInstance)
    const authorizeMusicKit = useStore(state => state.authorizeMusicKit)

    useEffect(() => {
        const fetchPlaylistData = async () => {
            if (!musicKitInstance) {
                await authorizeMusicKit()
                return
            }
            if (!musicKitInstance || !playlistId) {
                return
            }

            try {
                // console.log('music kit instance and album id')
                // console.log('music kit instance: ', musicKitInstance)
                // console.log('playlistId: ', playlistId)

                if (playlistId.startsWith('pl')) {
                    try {
                        const queryParameters = { l: 'en-us' }
                        const trackRes = await musicKitInstance.api.music(
                            `/v1/catalog/ca/playlists/${playlistId}/tracks`,

                            queryParameters
                        )
                        const playlistRes = await musicKitInstance.api.music(
                            `/v1/catalog/ca/playlists/${playlistId}/`,

                            queryParameters
                        )

                        const playlistData = await playlistRes.data.data
                        const trackData = await trackRes.data.data

                        setPlaylistTrackData(trackData)
                        setPlaylistData(playlistData[0])
                    } catch (error: any) {
                        if (error.response?.status === 404) {
                            setPlaylistTrackData([])
                        } else {
                            console.error(error)
                            setError(error.message)
                        }
                    } finally {
                        setLoading(false)
                    }
                } else if (playlistId.startsWith('p')) {
                    try {
                        const trackRes = await musicKitInstance.api.music(
                            `/v1/me/library/playlists/${playlistId}/tracks`
                        )
                        const playlistRes = await musicKitInstance.api.music(
                            `/v1/me/library/playlists/${playlistId}/`
                        )

                        const trackData = await trackRes.data.data
                        const playlistData = await playlistRes.data.data

                        setPlaylistTrackData(trackData)
                        setPlaylistData(playlistData[0])
                    } catch (error: any) {
                        if (error.response?.status === 404) {
                            setPlaylistTrackData([])
                        } else {
                            console.error(error)
                            setError(error.message)
                        }
                    } finally {
                        setLoading(false)
                    }
                }
            } catch (error: any) {
                console.error(error)
                console.log('error in fetchPlaylistData')
            } finally {
                setLoading(false)
            }
        }

        fetchPlaylistData()
    }, [musicKitInstance, playlistId, authorizeMusicKit])

    return { playlistData, playlistTrackData, loading, error }
}

export default FetchPlaylistData
