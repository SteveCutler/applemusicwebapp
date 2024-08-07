import { useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../store/store'
import AppleDashboard from '../../components/Apple/AppleDashboard'

const useLogin = () => {
    const [loading, setLoading] = useState(false)
    const {
        setAuthorized,
        authorizeMusicKit,
        setBackendToken,
        backendToken,
        appleMusicToken,
        musicKitInstance,
        fetchAppleToken,
    } = useStore(state => ({
        authorizeMusicKit: state.authorizeMusicKit,
        musicKitInstance: state.musicKitInstance,
        appleMusicToken: state.appleMusicToken,
        backendToken: state.backendToken,
        fetchAppleToken: state.fetchAppleToken,
        setAuthorized: state.setAuthorized,
        setBackendToken: state.setBackendToken,
    }))
    const navigate = useNavigate()

    const login = async (email: string, password: string) => {
        try {
            setLoading(true)

            const res = await fetch(
                'https://mus-backend-b262ef3b1b65.herokuapp.com/api/auth/login',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                    credentials: 'include',
                }
            )

            const data = await res.json()

            if (!res.ok) {
                toast.error('Failed to log in')
                navigate('/login')
                return
            }

            localStorage.setItem('backendToken', data.id)
            setBackendToken(data.id)

            // Ensure MusicKit authorization happens only after backend token is set
            await fetchAppleToken()
            await authorizeMusicKit()

            setAuthorized(true)
            toast.success('Logged in successfully')

            navigate('/')
        } catch (error) {
            toast.error('Failed to log in')
            navigate('/login')
        } finally {
            setLoading(false)
        }
    }

    return { loading, login }
}

export default useLogin
