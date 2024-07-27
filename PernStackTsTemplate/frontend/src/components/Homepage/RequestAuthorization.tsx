import React, { useState } from 'react'
import { useStore } from '../../store/store'
import saveToken from '../Apple/saveToken'
import toast from 'react-hot-toast'
import { FaApple } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const AuthorizeButton = () => {
    const {
        authorizeMusicKit,
        musicKitInstance,
        backendToken,
        setAppleMusicToken,
        appleMusicToken,
        setAuthorized,
    } = useStore(state => ({
        authorizeMusicKit: state.authorizeMusicKit,
        setAuthorized: state.setAuthorized,
        appleMusicToken: state.appleMusicToken,
        backendToken: state.backendToken,
        setAppleMusicToken: state.setAppleMusicToken,
        musicKitInstance: state.musicKitInstance,
    }))

    const navigate = useNavigate()
    const [auth, setAuth] = useState<any | null>(null)

    const handleAuthorization = async () => {
        try {
            let token = await musicKitInstance?.authorize()
            // console.log('token:', token)
            // console.log('backendToken:', backendToken)
            // console.log('musicKitInstance:', musicKitInstance)
            // console.log(
            //     'Bearer:',
            //     import.meta.env.VITE_MUSICKIT_DEVELOPER_TOKEN
            // )
            if (token && backendToken) {
                // Check subscription status by accessing the user's library

                try {
                    const queryParameters = {
                        l: 'en-us',
                        limit: 20,
                    }
                    const res = await musicKitInstance.api.music(
                        '/v1/me/recommendations/',
                        queryParameters
                    )

                    console.log('response', res)

                    if (res.response.status == 200) {
                        console.log('response ok')
                        saveToken(token, backendToken)
                        setAppleMusicToken(token)
                        localStorage.setItem('musicUserToken', token)
                        localStorage.setItem(
                            'music.w5y3b689nm.media-user-token',
                            token
                        )
                        console.log(
                            'musicKit',
                            musicKitInstance,
                            'apple token',
                            appleMusicToken,
                            'backend',
                            backendToken
                        )
                        // await authorizeMusicKit()
                        if (musicKitInstance && token && backendToken) {
                            console.log('navigating home')
                            setAuthorized(true)
                            navigate('/')
                        }
                    } else {
                        toast.error(
                            'You do not have an active Apple Music subscription.'
                        )
                    }
                } catch (error: any) {}
            } else {
                toast.error(
                    'There was an issue logging in to the Apple account.'
                )
            }
        } catch (error) {
            console.error(error)
            toast.error('Failed to authorize with Apple Music.')
        }
    }

    const style = { fontSize: '1.3rem', transform: 'translateY(-2px)' }

    return (
        <button
            onClick={handleAuthorization}
            className="rounded-full bg-white flex active:scale-95 items-center justify-center gap-1 text-black p-2 px-4 font-semibold hover:shadow-lg text-sm w-56"
        >
            <FaApple style={style} />
            Authorize Apple Music
        </button>
    )
}

export default AuthorizeButton
