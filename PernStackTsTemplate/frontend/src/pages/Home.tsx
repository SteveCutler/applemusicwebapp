import { useStore } from '../store/store'
import { useEffect, useRef } from 'react'
import AppleMusicLogin from '../components/Apple/AppleMusicLogin'
import AppleDashboard from '../components/Apple/AppleDashboard'
import useMusicKit from '../components/Apple/LoadMusickit'

const Home = () => {
    const {
        authorizeBackend,
        appleMusicToken,
        backendToken,
        authorizeMusicKit,
        musicKitInstance,
        fetchAppleToken,
        generateAppleToken,
    } = useStore(state => ({
        appleMusicToken: state.appleMusicToken,
        authorizeBackend: state.authorizeBackend,
        backendToken: state.backendToken,
        authorizeMusicKit: state.authorizeMusicKit,
        musicKitInstance: state.musicKitInstance,
        fetchAppleToken: state.fetchAppleToken,
        generateAppleToken: state.generateAppleToken,
    }))

    const initialize = async () => {
        if (!musicKitInstance) {
            console.log('Initializing MusicKit...')
            authorizeMusicKit()
        }

        if (!appleMusicToken && musicKitInstance) {
            console.log('fetching Apple token...')
            fetchAppleToken()
        }
    }
    useEffect(() => {
        if (!musicKitInstance || !appleMusicToken) {
            initialize()
        }
    }, [musicKitInstance, appleMusicToken])

    if (!appleMusicToken) {
        return <div>Loading...</div>
    }

    return (
        <div className="flex-col mx-auto flex pt-5  w-full  mb-40 rounded-lg ">
            {appleMusicToken && musicKitInstance && <AppleDashboard />}
        </div>
    )
}
export default Home
