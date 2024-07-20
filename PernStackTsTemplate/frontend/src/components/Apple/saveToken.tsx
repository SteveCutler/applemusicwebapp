//import { useAuthContext } from '../../context/AuthContext'

import toast from 'react-hot-toast'

export const saveToken = async (userToken: string, userId: String | null) => {
    try {
        const now = new Date()
        const tokenExpiryDate = new Date(now.setDate(now.getDate() + 15))

        const res = await fetch(
            'https://mus-backend-b262ef3b1b65.herokuapp.com/api/apple/save-token',
            {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    userToken,
                    tokenExpiryDate,
                }),
                credentials: 'include',
            }
        )
        // const data = await res.json()

        // console.log(res)
        const data = await res.json()
        console.log('data: ', data)

        toast.success('Apple auth saved succesfully')
    } catch (error) {
        // console.error(error)
        // toast.error('Issue saving token')
    }
}
export default saveToken
