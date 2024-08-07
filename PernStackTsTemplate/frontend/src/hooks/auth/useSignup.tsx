import { useState } from 'react'
import { useAuthContext } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../store/store'

type SignupInputs = {
    signupPassword: string
    signupconfirmPassword: string
    signupEmail: string
}

const useSignup = () => {
    const [loading, setLoading] = useState(false)
    const {
        authorizeBackend,
        setAuthorized,
        authorizeMusicKit,
        setBackendToken,
    } = useStore(state => ({
        authorizeBackend: state.authorizeBackend,
        authorizeMusicKit: state.authorizeMusicKit,
        setBackendToken: state.setBackendToken,
        setAuthorized: state.setAuthorized,
    }))
    // const { setAuthUser } = useAuthContext()
    const navigate = useNavigate()

    const signup = async (inputs: SignupInputs) => {
        const { signupPassword, signupconfirmPassword, signupEmail } = inputs
        try {
            setLoading(true)
            const res = await fetch(
                'https://mus-backend-b262ef3b1b65.herokuapp.com/api/auth/signup',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        password: signupPassword,
                        confirmPassword: signupconfirmPassword,
                        email: signupEmail,
                    }),
                    credentials: 'include',
                }
            )
            const data = await res.json()

            if (!res.ok) {
                toast.error(data.error)
                navigate('/login')
                return
            }
            localStorage.setItem('backendToken', data.id)
            setBackendToken(data.id)

            // await authorizeBackend()
            await authorizeMusicKit()

            // setAuthorized(true)
            toast.success('New account created!')
            navigate('/signup')

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
