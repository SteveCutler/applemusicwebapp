import React from 'react'
import { useStore } from '../../store/store'
import saveToken from '../Apple/saveToken'
import toast from 'react-hot-toast'
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

    const handleAuthorization = async () => {
        const token = await musicKitInstance?.authorize()
        if (token && backendToken) {
            saveToken(token, backendToken)
            setAppleMusicToken(token)
        } else {
            toast.error('There was an issue logging in to apple account..')
        }
    }

    return (
        <button onClick={handleAuthorization} className="btn btn-primary">
            Authorize Apple Music
        </button>
    )
}

export default AuthorizeButton
