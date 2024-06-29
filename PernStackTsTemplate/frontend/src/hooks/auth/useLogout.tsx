import { useState } from 'react'
import { useAuthContext } from '../../context/AuthContext'
import { Navigate, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useStore } from '../../store/store'

const useLogout = () => {
    const [loading, setLoading] = useState(false)
    // const { setAuthUser } = useAuthContext()
    const { setBackendToken } = useStore(state => ({
        setBackendToken: state.setBackendToken,
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
            toast.success('Logged out succesfully')
            // setAuthUser(null)
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
