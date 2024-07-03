import { useState, useEffect } from 'react'
import useMusicKit from './LoadMusickit'
// import { useMusickitContext } from '../../context/MusickitContext'
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

interface TrackAlbumData {
    attributes: {
        artistName: string
        name: string
        releaseDate: string
    }
    id: string
}

const FetchSongData = (songId: string | undefined) => {
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [trackAlbumData, setTrackAlbumData] = useState(null)
    const [trackArtistData, setTrackArtistData] = useState(null)

    // const musicKitLoaded = useMusicKit()
    const { musicKitInstance, authorizeMusicKit, songData, setSongData } =
        useStore(state => ({
            musicKitInstance: state.musicKitInstance,
            authorizeMusicKit: state.authorizeMusicKit,
            songData: state.songData,
            setSongData: state.setSongData,
        }))
    // const musicKitInstance = useStore(state => state.musicKitInstance)
    // const authorizeMusicKit = useStore(state => state.authorizeMusicKit)

    useEffect(() => {
        const fetchSongData = async () => {
            if (!musicKitInstance) {
                await authorizeMusicKit()
                return
            }
            if (!musicKitInstance || !songId) {
                return
            }

            try {
                // console.log('music kit instance and album id')
                // console.log('music kit instance: ', musicKitInstance)
                console.log('songId: ', songId)

                if (songId.startsWith('i')) {
                    try {
                        //track data api call
                        const res = await musicKitInstance.api.music(
                            `/v1/me/library/songs/${songId}`
                        )
                        // track album data api call
                        const resAlbum = await musicKitInstance.api.music(
                            `/v1/me/library/songs/${songId}/albums`
                        )
                        // track artist data api call
                        const resArtist = await musicKitInstance.api.music(
                            `/v1/me/library/songs/${songId}/artists`
                        )

                        // console.log('track album: ', await resAlbum)

                        const trackAlbumData = await resAlbum.data.data[0]
                        const trackArtistData = await resArtist.data.data[0]

                        console.log('track album data: ', trackAlbumData)
                        console.log('track artist data: ', trackArtistData)

                        const data: Song = await res.data.data[0]
                        console.log(res)
                        // return { data, trackAlbumData }
                        setTrackAlbumData(trackAlbumData)
                        setTrackArtistData(trackArtistData)
                        setSongData(data)
                    } catch (error: any) {
                        console.error(error)
                        setError(error)
                    } finally {
                        setLoading(false)
                    }
                } else {
                    try {
                        console.log('fetching song data')
                        // const queryParameters = { l: 'en-us' }
                        // const res = await musicKitInstance.api.music(
                        //     `/v1/catalog/ca/songs/${songId}`,

                        //     queryParameters
                        // )

                        const resAlbum = await musicKitInstance.api.music(
                            `/v1/catalog/ca/songs/${songId}/albums`
                        )
                        const resArtist = await musicKitInstance.api.music(
                            `/v1/catalog/ca/songs/${songId}/artists`
                        )

                        // console.log('track album: ', await resAlbum)
                        const trackAlbumData = await resAlbum.data.data[0]
                        const trackArtistData = await resArtist.data.data[0]

                        // const data: Song = await res.data.data[0]

                        // console.log('song data: ', data)
                        // return { data, trackAlbumData }
                        setTrackAlbumData(trackAlbumData)
                        setTrackArtistData(trackArtistData)

                        // setSongData(data)
                    } catch (error: any) {
                        console.error(error)
                        setError(error)
                    } finally {
                        setLoading(false)
                    }
                }
            } catch (error: any) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }

        fetchSongData()
    }, [musicKitInstance, songId, authorizeMusicKit])

    return { trackAlbumData, trackArtistData, loading, error }
}

export default FetchSongData
