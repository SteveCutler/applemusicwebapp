// import { useAuthContext } from '../../context/AuthContext'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../store/store'

const useLogin = () => {
    const [loading, setLoading] = useState(false)
    const { isAuthorized, backendToken, setAuthorized, setBackendToken } =
        useStore(state => ({
            isAuthorized: state.isAuthorized,
            backendToken: state.backendToken,
            setAuthorized: state.setAuthorized,
            setBackendToken: state.setBackendToken,
        }))
    // const { setAuthUser } = useAuthContext()
    const Navigate = useNavigate()

    const login = async (email: String, password: String) => {
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
                Navigate('/login')
                return
            }
            toast.success('Logged in succesfully')
            setBackendToken(data.id)
            setAuthorized(true)
        } catch (error: any) {
            toast.error('Failed to log in')
            Navigate('/login')
            return
        } finally {
            setLoading(false)
        }
    }

    return { loading, login }
}

export default useLogin
