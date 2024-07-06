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

    const [isCheckingAuth, setIsCheckingAuth] = useState(true)
    const authToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('authToken='))
        ?.split('=')[1]

    useEffect(() => {
        const checkAuth = async () => {
            if (authToken) {
                setBackendToken(authToken)
            } else {
                await authorizeBackend()
            }

            setIsCheckingAuth(false)
        }
        if (!musicKitInstance || !appleMusicToken) {
            initialize()
        }

        checkAuth()
    }, [authorizeBackend, setBackendToken, musicKitInstance, appleMusicToken])

    if (isCheckingAuth) {
        return <div>Loading...</div>
    }

    if (!appleMusicToken) {
        return <div>Loading...</div>
    }

    return (
        <div className="flex-col mx-auto flex pt-5 relative z-10 w-full  mb-40 rounded-lg ">
            {appleMusicToken && musicKitInstance ? (
                <AppleDashboard />
            ) : (
                <AuthorizeButton />
            )}
        </div>
    )
}
export default Home
