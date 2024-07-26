import React from 'react'
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
        setAuthorized,
    } = useStore(state => ({
        authorizeMusicKit: state.authorizeMusicKit,
        setAuthorized: state.setAuthorized,
        backendToken: state.backendToken,
        setAppleMusicToken: state.setAppleMusicToken,
        musicKitInstance: state.musicKitInstance,
    }))

    const navigate = useNavigate()
    const handleAuthorization = async () => {
        const token = await musicKitInstance?.authorize()
        if (token && backendToken) {
            saveToken(token, backendToken)
            setAppleMusicToken(token)
            localStorage.setItem('musicUserToken', token)
            localStorage.setItem('music.w5y3b689nm.media-user-token', token)
            await authorizeMusicKit()
            setAuthorized(true)
            navigate('/')
        } else {
            toast.error('There was an issue logging in to apple account..')
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
