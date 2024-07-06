import React from 'react'
import { useStore } from '../../store/store'

const AuthorizeButton = () => {
    const { authorizeMusicKit, musicKitInstance } = useStore(state => ({
        authorizeMusicKit: state.authorizeMusicKit,
        musicKitInstance: state.musicKitInstance,
    }))

    const handleAuthorization = async () => {
        await musicKitInstance?.play()
    }

    return (
        <button onClick={handleAuthorization} className="btn btn-primary">
            Authorize Apple Music
        </button>
    )
}

export default AuthorizeButton
