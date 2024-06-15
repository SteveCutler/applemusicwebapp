import { useEffect } from 'react'
import { useStore } from '../store/store'
import { useParams } from 'react-router-dom'
import useFetchArtistData from '../components/Apple/FetchArtistData'

const Artist = () => {
    const {
        musicKitInstance,
        authorizeMusicKit,
        fetchAppleToken,
        appleMusicToken,
    } = useStore(state => ({
        musicKitInstance: state.musicKitInstance,
        authorizeMusicKit: state.authorizeMusicKit,
        fetchAppleToken: state.fetchAppleToken,
        appleMusicToken: state.appleMusicToken,
    }))
    const { Id } = useParams<{ Id: string }>()
    const { artistData, loading, error } = useFetchArtistData(Id)
    console.log('artistData: ', artistData[0])
    const initialize = async () => {
        let musicKitLoaded = false
        if (musicKitLoaded === false) {
            console.log('Initializing MusicKit...')
            await authorizeMusicKit()
            musicKitLoaded = true
        }

        if (!appleMusicToken && musicKitLoaded) {
            console.log('fetching Apple token...')
            await fetchAppleToken()
        }
    }

    useEffect(() => {
        if (!musicKitInstance) {
            initialize()
        }
    }, [musicKitInstance])

    return <>{artistData && <p>Artist data!</p>}</>
}

export default Artist
