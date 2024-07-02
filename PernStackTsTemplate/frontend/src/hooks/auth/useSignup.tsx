import { useState } from 'react'
import { useAuthContext } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../store/store'

type SignupInputs = {
    fullName: string
    username: string
    password: string
    confirmPassword: string
    email: string
}

const useSignup = () => {
    const [loading, setLoading] = useState(false)
    const { authorizeBackend } = useStore(state => ({
        authorizeBackend: state.authorizeBackend,
    }))
    // const { setAuthUser } = useAuthContext()
    const navigate = useNavigate()

    const signup = async (inputs: SignupInputs) => {
        try {
            setLoading(true)
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(inputs),
            })
            const data = await res.json()

            if (!res.ok) throw new Error(data.error)
            toast.success('New account created!')
            await authorizeBackend()
            navigate('/')
            // setAuthUser(data)
        } catch (error: any) {
            console.error(error.message)
            toast.error('Please fill in all fields')
            // .error(error.message)
        } finally {
            setLoading(false)
        }
    }

    return { loading, signup }
}
export default useSignup
