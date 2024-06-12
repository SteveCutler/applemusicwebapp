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
        musicInstance,
        backendToken,
        appleMusicToken,
    } = useStore(state => ({
        fetchAppleToken: state.fetchAppleToken,
        authorizeMusicKit: state.authorizeMusicKit,
        musicInstance: state.musicKitInstance,
        generateAppleToken: state.generateAppleToken,
        backendToken: state.backendToken,
        appleMusicToken: state.appleMusicToken,
    }))
    // const { musicUserToken, setMusicUserToken } = useMusicTokenContext()
    //const musicKitLoaded = useMusicKit()
    authorizeMusicKit()
    //const [musicUserToken, setMusicUserToken] = useState<string | null>(null)
    // const { authUser } = useAuthContext()
    console.log('music instance: ', musicInstance)
    console.log('backend token: ', backendToken)
    console.log('backend token: ', backendToken)
    if (!backendToken) {
        return
    }
    //const userId = backendToken
    useEffect(() => {
        const initialize = async () => {
            if (musicInstance && backendToken) {
                fetchAppleToken()
                if (!appleMusicToken) {
                    await generateAppleToken()
                }
            }
        }
        if (!appleMusicToken) {
            initialize()
        }
    }, [musicInstance, backendToken, fetchAppleToken, generateAppleToken])

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
