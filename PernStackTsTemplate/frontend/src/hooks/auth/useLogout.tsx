import { useState } from 'react'
import { useAuthContext } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const useLogout = () => {
    const [loading, setLoading] = useState(false)
    const { setAuthUser } = useAuthContext()

    const logout = async () => {
        try {
            setLoading(true)
            const res = await fetch('/api/auth/logout', {
                method: 'POST',
            })
            const data = await res.json()

            if (!res.ok) throw new Error(data.error)
            toast.success('Logged out succesfully')
            setAuthUser(null)
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
