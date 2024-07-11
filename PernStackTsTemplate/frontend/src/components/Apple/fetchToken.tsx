//import { useAuthContext } from '../../context/AuthContext'

import toast from 'react-hot-toast'
import { MusicUserTokenContextProvdider } from '../../context/MusicTokenContext'

export const fetchToken = async (userId: String | null) => {
    // const [loading, setLoading] = useState(false)
    console.log('fetching token')
    try {
        const res = await fetch(
            'https://mus-backend-b262ef3b1b65.herokuapp.com/api/apple/get-token',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                }),
                credentials: 'include',
            }
        )
        console.log(res)

        const { appleMusicToken, tokenExpiryDate } = await res.json()
        if (appleMusicToken === null) {
            return null
        }

        if (!res.ok) {
            console.log(res.body)
            toast.error('Error fetching apple auth')
            return null
        }

        const now = new Date()

        if (now < new Date(tokenExpiryDate)) {
            return appleMusicToken
        } else {
            console.error('Token expired')
            toast.error('Token expired')
            return null
        }
    } catch (error) {
        console.error('Error fetching token:', error)
        toast.error('Error fetching apple auth')
        return null
    }
}

export default fetchToken
