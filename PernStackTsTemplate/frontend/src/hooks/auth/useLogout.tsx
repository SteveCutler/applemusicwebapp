import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useStore } from '../../store/store'
const useLogout = () => {
    const [loading, setLoading] = useState(false)
    const { setBackendToken, musicKitInstance } = useStore(state => ({
        setBackendToken: state.setBackendToken,
        musicKitInstance: state.musicKitInstance,
    }))
    const navigate = useNavigate()

    const logout = async () => {
        try {
            setLoading(true)
            const res = await fetch('/api/auth/logout', {
                method: 'POST',
            })
            const data = await res.json()

            if (!res.ok) throw new Error(data.error)
            toast.success('Logged out successfully')

            // Clear all relevant local storage and session storage items
            localStorage.clear() // Clear all local storage
            sessionStorage.clear() // Clear all session storage

            // Clear state in your store
            useStore.setState({
                appleMusicToken: null,
                backendToken: null,
                musicKitInstance: null,
                heavyRotation: [],
                // Clear any other user-specific state
            })

            await musicKitInstance?.stop()
            setBackendToken(null)
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
