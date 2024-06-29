import { LogOut } from 'lucide-react'
import useLogout from '../../hooks/auth/useLogout'
import { HiOutlineLogout } from 'react-icons/hi'

const LogoutButton = () => {
    const { logout } = useLogout()
    const style = { fontSize: '0.5rem' }

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
