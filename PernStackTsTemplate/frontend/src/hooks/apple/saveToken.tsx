//import { useAuthContext } from '../../context/AuthContext'

import toast from 'react-hot-toast'

export const saveToken = async (userToken: string, userId: String | null) => {
    try {
        const now = new Date()
        const tokenExpiryDate = new Date(now.setDate(now.getDate() + 15))

        console.log(
            'user token:',
            userToken,
            'userID:',
            userId,
            'expiry date:',
            tokenExpiryDate
        )

        const res = await fetch('/api/apple/' + 'save-token', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                userId,
                userToken,
                tokenExpiryDate,
            }),
        })
        // const data = await res.json()
        if (!res.ok) {
            toast.error('Issue saving token')
        }
        console.log(res)
        console.log(res.json())

        toast.success('Apple auth saved succesfully')
    } catch (error) {
        console.error(error)
        toast.error('Issue saving token')
    }
}
export default saveToken
