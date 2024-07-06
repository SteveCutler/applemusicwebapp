import { useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../store/store'

const useLogin = () => {
    const [loading, setLoading] = useState(false)
    const { isAuthorized, setAuthorized, setBackendToken, fetchAppleToken } =
        useStore(state => ({
            isAuthorized: state.isAuthorized,
            fetchAppleToken: state.fetchAppleToken,
            setAuthorized: state.setAuthorized,
            setBackendToken: state.setBackendToken,
        }))
    const navigate = useNavigate()

    const login = async (email: string, password: string) => {
        try {
            setLoading(true)

            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })

            const data = await res.json()

            if (!res.ok) {
                toast.error('Failed to log in')
                navigate('/login')
                return
            }

            toast.success('Logged in successfully')

            // Save tokens to local storage
            localStorage.setItem('backendToken', data.id)
            setBackendToken(data.id)
            fetchAppleToken()
            setAuthorized(true)

            // navigate('/dashboard') // or any other route after successful login
        } catch (error: any) {
            toast.error('Failed to log in')
            navigate('/login')
            return
        } finally {
            setLoading(false)
        }
    }

    return { loading, login }
}

export default useLogin
