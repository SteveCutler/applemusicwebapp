import { useStore } from '../store/store'
import { useEffect, useRef, useState } from 'react'
import AppleMusicLogin from '../components/Apple/AppleMusicLogin'
import AppleDashboard from '../components/Apple/AppleDashboard'
import useMusicKit from '../components/Apple/LoadMusickit'
import AuthorizeButton from '../components/Homepage/RequestAuthorization'
const Home = () => {
    const {
        authorizeBackend,
        appleMusicToken,
        isAuthorized,
        backendToken,
        authorizeMusicKit,
        setBackendToken,
        musicKitInstance,
        fetchAppleToken,
        generateAppleToken,
    } = useStore(state => ({
        appleMusicToken: state.appleMusicToken,
        setBackendToken: state.setBackendToken,
        authorizeBackend: state.authorizeBackend,
        backendToken: state.backendToken,
        authorizeMusicKit: state.authorizeMusicKit,
        musicKitInstance: state.musicKitInstance,
        isAuthorized: state.isAuthorized,
        fetchAppleToken: state.fetchAppleToken,
        generateAppleToken: state.generateAppleToken,
    }))

    const initialize = async () => {
        if (!musicKitInstance) {
            console.log('Initializing MusicKit...')
            authorizeMusicKit()
        }
        // if (!appleMusicToken && musicKitInstance) {
        //     console.log('fetching Apple token...')
        //     fetchAppleToken()
        // }
    }

    useEffect(() => {
        if (!musicKitInstance || !appleMusicToken) {
            initialize()
        }
    }, [
        setBackendToken,
        musicKitInstance,
        appleMusicToken,
        backendToken,
        isAuthorized,
    ])

    if (!appleMusicToken) {
        return (
            <div>
                <AuthorizeButton />
            </div>
        )
    }

    return (
        <div className="flex-col mx-auto flex pt-5 relative z-10 w-full  mb-40 rounded-lg ">
            {appleMusicToken && musicKitInstance && backendToken && (
                <AppleDashboard />
            )}
        </div>
    )
}
export default Home
