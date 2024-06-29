import LogoutButton from './LogoutButton'
import { useAuthContext } from '../../context/AuthContext'
import { IoArrowBackCircle, IoArrowForwardCircle } from 'react-icons/io5'
import { useNavigate, useLocation, useNavigationType } from 'react-router-dom'
import { useEffect, useState } from 'react'

function Header() {
    const [canGoBack, setCanGoBack] = useState(false)
    const [canGoForward, setCanGoForward] = useState(false)
    // const { authUser } = useAuthContext()
    const location = useLocation()
    const navigationType = useNavigationType()
    const style = { fontSize: '2rem' }
    const navigate = useNavigate()
    const navigateBack = () => {
        navigate(-1)
    }
    const navigateForward = () => {
        navigate(1)
    }

    useEffect(() => {
        const updateNavigationState = () => {
            const history = window.history
            console.log('history: ', history)
            setCanGoBack(history.state?.idx > 0)
            setCanGoForward(history.state?.idx > history.length)
        }

        updateNavigationState()

        // Listen for changes in navigation state
        window.addEventListener('popstate', updateNavigationState)
        return () => {
            window.removeEventListener('popstate', updateNavigationState)
        }
    }, [location])

    return (
        <div className=" top-0  flex items-start w-3/5 absolute justify-between h-20 pt-2 text-black">
            <div className="flex gap-2 ">
                <button
                    className={`${canGoBack ? 'hover:text-slate-500' : ' disabled hover:text-black cursor-normal'} `}
                    onClick={navigateBack}
                    disabled={!canGoBack}
                >
                    <IoArrowBackCircle style={style} />
                </button>
                <button
                    className={`${canGoForward ? 'hover:text-slate-500' : 'disabled hover:text-black cursor-normal'} `}
                    onClick={navigateForward}
                    disabled={!canGoForward}
                >
                    <IoArrowForwardCircle style={style} />
                </button>
            </div>
        </div>
    )
}

export default Header
