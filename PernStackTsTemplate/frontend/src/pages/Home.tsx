import { useAuthContext } from '../context/AuthContext'

import AppleMusicLogin from '../components/Apple/AppleMusicLogin'

const Home = () => {
    const { authUser } = useAuthContext()

    if (!authUser) {
        return <div>Loading...</div>
    }

    return (
        <div className="flex-col h-screen w-full md:max-w-screen-lg mb-40 rounded-lg ">
            <AppleMusicLogin />
        </div>
    )
}
export default Home
