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
    } = useStore(state => ({
        authorizeMusicKit: state.authorizeMusicKit,
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
