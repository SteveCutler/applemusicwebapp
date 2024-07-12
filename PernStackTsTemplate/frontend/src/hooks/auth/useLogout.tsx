import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useStore } from '../../store/store'
const useLogout = () => {
    const [loading, setLoading] = useState(false)
    const {
        setBackendToken,
        setLibraryPlaylists,
        setRecentHistory,
        setRecentlyAddedToLib,
        recentActivity,
        musicKitInstance,
        setPersonalizedPlaylists,
        setAppleMusicToken,
    } = useStore(state => ({
        setBackendToken: state.setBackendToken,
        setPersonalizedPlaylists: state.setPersonalizedPlaylists,
        recentActivity: state.recentActivity,
        setRecentHistory: state.setRecentHistory,
        setRecentlyAddedToLib: state.setRecentlyAddedToLib,
        setAppleMusicToken: state.setAppleMusicToken,
        setLibraryPlaylists: state.setLibraryPlaylists,
        musicKitInstance: state.musicKitInstance,
    }))
    const navigate = useNavigate()

    const logout = async () => {
        try {
            setLoading(true)
            const res = await fetch(
                'https://mus-backend-b262ef3b1b65.herokuapp.com/api/auth/logout',
                {
                    method: 'POST',
                    credentials: 'include',
                }
            )
            const data = await res.json()

            if (!res.ok) throw new Error(data.error)
            toast.success('Logged out successfully')

            // Clear all relevant local storage and session storage items
            localStorage.clear()
            sessionStorage.clear()

            // Clear state in your store
            useStore.setState({
                heavyRotation: [],
                recentlyPlayed: null,
                recommendations: null,
                isAuthorized: false,
                recentlyPlayedAlbums: null,
                personalizedPlaylists: null,
                themedRecommendations: null,
                moreLikeRecommendations: null,
                stationsForYou: null,
                recentlyAddedToLib: [],
                recentHistory: [],
                playlistData: [],
                recentActivity: null,
                podSubs: null,
                recentEps: null,
                trackData: [],
                appleMusicToken: null,
                backendToken: null,
                musicKitInstance: null,
                favouriteSongs: null,
                libraryPlaylists: null,
                albumData: null,
                albums: null,
                // Clear any other user-specific state
            })

            await musicKitInstance?.stop()

            setBackendToken(null)
            setAppleMusicToken(null)
            setLibraryPlaylists(null)
            setPersonalizedPlaylists(null)
            setRecentHistory([])
            setRecentlyAddedToLib([])
            recentActivity
            navigate('/login')
        } catch (error: any) {
            console.error(error.message)
            toast.error('Error logging out')
        } finally {
            setLoading(false)
        }
    }

    return { loading, logout }
}

export default useLogout
