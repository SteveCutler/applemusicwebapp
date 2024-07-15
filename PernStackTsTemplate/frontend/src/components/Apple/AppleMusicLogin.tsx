import { useEffect } from 'react'
import useMusicKit from './LoadMusickit'
// import saveToken from './saveToken'
// import fetchToken from './fetchToken'
// import { useAuthContext } from '../../context/AuthContext'
// import AppleDashboard from './AppleDashboard'
// import { useMusicTokenContext } from '../../context/MusicTokenContext'
import { useStore } from '../../store/store'
const AppleMusicLogin = () => {
    const {
        fetchAppleToken,
        generateAppleToken,
        authorizeMusicKit,
        musicKitInstance,
        backendToken,
        appleMusicToken,
    } = useStore(state => ({
        fetchAppleToken: state.fetchAppleToken,
        authorizeMusicKit: state.authorizeMusicKit,
        musicKitInstance: state.musicKitInstance,
        generateAppleToken: state.generateAppleToken,
        backendToken: state.backendToken,
        appleMusicToken: state.appleMusicToken,
    }))
    // const { musicUserToken, setMusicUserToken } = useMusicTokenContext()
    //const musicKitLoaded = useMusicKit()
    if (!musicKitInstance) {
        authorizeMusicKit()
    }
    //const [musicUserToken, setMusicUserToken] = useState<string | null>(null)
    // const { authUser } = useAuthContext()
    console.log('music instance: ', musicKitInstance)
    console.log('backend token: ', backendToken)
    console.log('backend token: ', backendToken)
    if (!backendToken) {
        return
    }
    //const userId = backendToken
    useEffect(() => {
        const initialize = async () => {
            if (musicKitInstance && backendToken && !appleMusicToken) {
                fetchAppleToken()
                if (!appleMusicToken) {
                    await generateAppleToken()
                }
            }
        }
        if (!appleMusicToken) {
            initialize()
        }
    }, [musicKitInstance, backendToken, fetchAppleToken, generateAppleToken])

    // const createToken = async () => {
    //     if (!musicKitLoaded) {
    //         return
    //     }
    //     try {
    //         const music = (window as any).MusicKit.getInstance()

    //         const token = await music.authorize()

    //         saveToken(token, userId)
    //         setMusicUserToken(token)
    //     } catch (error) {
    //         console.error('Authorization failed:', error)
    //     }
    // }

    return <div></div>
}

export default AppleMusicLogin
