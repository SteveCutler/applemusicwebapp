import LogoutButton from './LogoutButton'
import { useAuthContext } from '../../context/AuthContext'

function Header() {
    const { authUser } = useAuthContext()

    return (
        <div className="header top-0 p-5 flex items-center justify-between h-20 bg-slate-900">
            <div className="flex-col">
                <p className="font-bold text-xl">Logged in as:</p>
                <p className=" text-xl">{authUser && authUser.email}</p>
            </div>
            <div className="">
                <LogoutButton />
            </div>
        </div>
    )
}

export default Header
