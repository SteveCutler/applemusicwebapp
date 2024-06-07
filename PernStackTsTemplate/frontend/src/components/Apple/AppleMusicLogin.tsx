import { useEffect } from 'react'
import useMusicKit from './LoadMusickit'
import saveToken from '../../hooks/apple/saveToken'
import fetchToken from '../../hooks/apple/fetchToken'
import { useAuthContext } from '../../context/AuthContext'
import AppleDashboard from './AppleDashboard'
import { useMusicTokenContext } from '../../context/MusicTokenContext'

const AppleMusicLogin = () => {
    const { musicUserToken, setMusicUserToken } = useMusicTokenContext()
    const musicKitLoaded = useMusicKit()
    //const [musicUserToken, setMusicUserToken] = useState<string | null>(null)
    const { authUser } = useAuthContext()

    if (!authUser) {
        return
    }
    const userId = authUser.id
    useEffect(() => {
        const initialize = async () => {
            if (musicKitLoaded && userId) {
                const token = await fetchToken(userId)
                if (!token) {
                    await createToken()
                } else {
                    setMusicUserToken(token)
                }
            }
        }

        initialize()
    }, [musicKitLoaded, userId])

    const createToken = async () => {
        if (!musicKitLoaded) {
            return
        }
        try {
            const music = (window as any).MusicKit.getInstance()

            const token = await music.authorize()

            saveToken(token, userId)
            setMusicUserToken(token)
        } catch (error) {
            console.error('Authorization failed:', error)
        }
    }

    return (
        <div>
            {musicUserToken && (
                <AppleDashboard musicUserToken={musicUserToken} />
            )}
        </div>
    )
}

export default AppleMusicLogin
