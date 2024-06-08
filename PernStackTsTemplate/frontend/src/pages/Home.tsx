import { useStore } from '../store/store'
import { useEffect } from 'react'
import AppleMusicLogin from '../components/Apple/AppleMusicLogin'
import AppleDashboard from '../components/Apple/AppleDashboard'
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

    useEffect(() => {
        const initialize = () => {
            console.log('use effect')
            authorizeBackend()
            authorizeMusicKit()
            // if (!appleMusicToken) {
            //     fetchAppleToken()
            //     if (!backendToken) {
            //         generateAppleToken()
            //     }
            // }
        }
        initialize()
    }, [
        authorizeBackend,

        authorizeMusicKit,

        fetchAppleToken,
        generateAppleToken,
    ])
    //const { authUser } = useAuthContext()

    if (!backendToken) {
        return <div>Loading...</div>
    }

    return (
        <div className="flex-col h-screen w-full md:max-w-screen-lg mb-40 rounded-lg ">
            <AppleMusicLogin />
            {appleMusicToken && <AppleDashboard />}
        </div>
    )
}
export default Home
