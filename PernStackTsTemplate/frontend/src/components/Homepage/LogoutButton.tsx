import { HiOutlineLogout } from 'react-icons/hi'
import useLogout from '../../hooks/auth/useLogout'

const LogoutButton = () => {
    const style = { fontSize: '0.5rem' }
    const { logout } = useLogout()

    return (
        <div className="mt-auto">
            <HiOutlineLogout
                className="w-6 h-6 cursor-pointer"
                style={style}
                onClick={logout}
            />
        </div>
    )
}

export default LogoutButton
