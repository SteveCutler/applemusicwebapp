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
        let musicKitLoaded = false
        if (!musicKitInstance && musicKitLoaded === false) {
            console.log('Initializing MusicKit...')
            authorizeMusicKit()
            musicKitLoaded = true
        }

        if (!appleMusicToken && musicKitLoaded) {
            console.log('fetching Apple token...')
            fetchAppleToken()
        }
    }
    useEffect(() => {
        initialize()
    }, [appleMusicToken])

    if (!appleMusicToken) {
        return <div>Loading...</div>
    }

    return (
        <div className="flex-col  w-full md:max-w-screen-lg mb-40 rounded-lg ">
            {/* <AppleMusicLogin /> */}

            {appleMusicToken && musicKitInstance && <AppleDashboard />}
        </div>
    )
}
export default Home
