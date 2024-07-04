import { IoHomeSharp } from 'react-icons/io5'
import { FaSearch } from 'react-icons/fa'
import { LuLibrary } from 'react-icons/lu'
import { ImStack } from 'react-icons/im'
import { FaHistory } from 'react-icons/fa'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import SidebarPlaylists from './SidebarPlaylists'
import { LogOut } from 'lucide-react'
import FetchRecentHistory from '../Apple/FetchRecentHistory'
import LogoutButton from './LogoutButton'
// import SidebarSongHistory from './SidebarSongHistory'
import SidebarFavouriteSongs from './SidebarFavouriteSongs'
import { CiCirclePlus } from 'react-icons/ci'
import { IoSettingsSharp } from 'react-icons/io5'
import { useStore } from '../../store/store'
import SidebarActivity from './Activity'
import { useEffect, useState } from 'react'
import { FaHeartbeat } from 'react-icons/fa'
import { TbHistory } from 'react-icons/tb'
import { MdLibraryMusic } from 'react-icons/md'
import { IoLibrary } from 'react-icons/io5'
import { RiPlayListFill, RiPlayListAddLine } from 'react-icons/ri'
import { MdOutlineDarkMode } from 'react-icons/md'
import { MdDarkMode } from 'react-icons/md'
import FetchRecentlyAddedToLib from '../Apple/FetchRecentlyAddedToLib'

const Sidebar = () => {
    FetchRecentlyAddedToLib()
    FetchRecentHistory()
    const [isHovered, setIsHovered] = useState(false)

    const style = { fontSize: '1.5rem' }
    const stylePlaylist = {
        fontSize: '1.5rem',
        color: 'white',
    }
    const {
        queueToggle,
        albums,
        darkMode,
        setDarkMode,
        backendToken,
        setAlbums,
        fetchAppleToken,
        appleMusicToken,
    } = useStore(state => ({
        queueToggle: state.queueToggle,
        fetchAppleToken: state.fetchAppleToken,
        darkMode: state.darkMode,
        setDarkMode: state.setDarkMode,
        backendToken: state.backendToken,
        setAlbums: state.setAlbums,
        albums: state.albums,
        appleMusicToken: state.appleMusicToken,
    }))

    const userId = backendToken
    const navigate = useNavigate()

    const fetchLibrary = async () => {
        console.log('fetching library...')
        // setLoading(true)
        try {
            const res = await fetch(
                'http://localhost:5000/api/apple/get-library',
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

            const data = await res.json()
            // console.log(data)
            setAlbums(data.albums)

            // setLoading(false)
        } catch (error) {
            // setLoading(false)
        }
    }

    const handleMouseEnter = () => {
        setIsHovered(true)
    }

    const handleMouseLeave = () => {
        setIsHovered(false)
    }

    useEffect(() => {
        if (!appleMusicToken) {
            fetchAppleToken()
        }
        if (!albums && appleMusicToken) {
            fetchLibrary()
        }
    }, [appleMusicToken])

    const [viewType, setViewType] = useState('likes')

    return (
        <>
            <div className="flex-col m-1 flex  select-none h-full ">
                <div className="  flex-col py-3  bg-black rounded-lg w-full mb-1 mx-auto  border-slate-600 font-semibold text-slate-300 text-2xl items-center  justify-start text-center">
                    <div
                        className={`gap-2 pb-2 ${queueToggle ? `text-white` : darkMode ? `text-white` : `text-black`} absolute top-4 right-4 flex items-center`}
                        title="Log out"
                    >
                        <div
                            className=" hover:cursor-pointer hover:text-slate-500"
                            onClick={() => {
                                {
                                    darkMode
                                        ? setDarkMode(false)
                                        : setDarkMode(true)
                                }
                            }}
                        >
                            <MdOutlineDarkMode />
                        </div>
                        <div className=" hover:cursor-pointer hover:text-slate-500">
                            <IoSettingsSharp />
                        </div>
                        <div className="hover:text-slate-500">
                            <LogoutButton />
                        </div>
                    </div>
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `flex w-full mx-auto px-3 hover:text-slate-100 select-none cursor-default rounded-xl justify-center items-center ${
                                isActive ? 'text-white' : ''
                            }`
                        }
                    >
                        <IoHomeSharp />
                        <p className="p-2">Home</p>
                    </NavLink>

                    <NavLink
                        to="/search"
                        className={({ isActive }) =>
                            `flex w-full mx-auto px-3 hover:text-slate-100 select-none cursor-default rounded-xl justify-center items-center ${
                                isActive ? 'text-white' : ''
                            }`
                        }
                    >
                        <FaSearch />
                        <p className="p-2">Search</p>
                    </NavLink>
                    <NavLink
                        to="/library"
                        className={({ isActive }) =>
                            `flex w-full mx-auto px-3 hover:text-slate-100 select-none cursor-default rounded-xl justify-center items-center ${
                                isActive ? 'text-white' : ''
                            }`
                        }
                    >
                        <LuLibrary />
                        <p className="p-2">Library</p>
                    </NavLink>

                    <NavLink
                        to="/playlist-display"
                        className={({ isActive }) =>
                            `flex w-full mx-auto px-3 hover:text-slate-100 select-none cursor-default rounded-xl justify-center items-center ${
                                isActive ? 'text-white' : ''
                            }`
                        }
                    >
                        <RiPlayListFill />
                        <p className="p-2">Playlists</p>
                    </NavLink>
                    <NavLink
                        to="/favourites"
                        className={({ isActive }) =>
                            `flex w-full mx-auto px-3 hover:text-slate-100 select-none cursor-default rounded-xl justify-center items-center ${
                                isActive ? 'text-white' : ''
                            }`
                        }
                    >
                        <FaHeartbeat />
                        <p className="p-2">Favourites</p>
                    </NavLink>

                    {/* <NavLink
                        to="/"
                        className="flex w-full mx-auto px-3 hover:text-slate-100  cursor-default rounded-xl  justify-center items-center"
                    >
                        <TbHistory />
                        <p className="p-2">History</p>
                    </NavLink> */}

                    {/* <Link
                        to="/stacks"
                        className="flex w-full px-3 hover:text-slate-100  cursor-pointer rounded-xl  justify-center items-center"
                    >
                        <ImStack />
                        <p className="p-2">Stacks</p>
                    </Link> */}
                    {/* <div className="flex w-full select:none active:scale[0.90] px-3 hover:text-slate-100  cursor-pointer  rounded-xl  justify-center items-center">
                        <div>
                            <LogoutButton />
                        </div>
                        <span className="p-2 ">Logout</span>
                    </div> */}
                </div>
                <div className="flex-col bg-black p-1  rounded-lg w-full  border-slate-700    font-semibold text-slate-200  items-center mx-auto justify-start text-center">
                    <div className="div flex px-1  justify-around">
                        {/* likes */}
                        {/* activity */}
                        {/* history */}
                        <div
                            className={`flex w-1/4 justify-center hover:cursor-default  rounded-t-md py-1 gap-1 ${viewType === 'likes' ? 'bg-slate-700' : 'hover:bg-slate-800'}`}
                            onClick={() => setViewType('likes')}
                            title="Likes"
                        >
                            <FaHeartbeat style={style} />
                        </div>

                        <div
                            className={`flex w-1/4 justify-center hover:cursor-default  rounded-t-md py-1 gap-1 ${viewType === 'history' ? 'bg-slate-700' : 'hover:bg-slate-800'}`}
                            onClick={() => setViewType('history')}
                            title="History"
                        >
                            <TbHistory style={style} />
                        </div>

                        <div
                            className={`flex w-1/4 justify-center hover:cursor-default  rounded-t-md py-1 gap-1 ${viewType === 'library' ? 'bg-slate-700' : 'hover:bg-slate-800'} `}
                            onClick={() => setViewType('library')}
                            title="Library"
                        >
                            <LuLibrary style={style} />
                        </div>

                        <div
                            onClick={() => {
                                if (viewType === 'playlists') {
                                    navigate('/new-playlist/')
                                }
                                setViewType('playlists')
                            }}
                            className={`flex w-1/4 justify-center ${viewType == 'playlists' && 'cursor-pointer active:scale-95'}  rounded-t-md py-1 gap-1 ${viewType === 'playlists' ? 'bg-slate-700' : 'hover:bg-slate-800'}`}
                            title={`${viewType == 'playlists' ? 'Create Playlist' : 'Playlists'}`}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            {isHovered && viewType === 'playlists' ? (
                                <RiPlayListAddLine style={stylePlaylist} />
                            ) : (
                                <RiPlayListFill style={style} />
                            )}{' '}
                        </div>
                    </div>
                    {/* <SidebarSongHistory /> */}
                    <SidebarPlaylists />
                    <SidebarFavouriteSongs />
                    <SidebarActivity type={viewType} />
                </div>
                {/* <div className="flex-col mx-5 bg-black p-1 rounded-lg w-full border-b-2 py-5 border-slate-600    font-bold text-slate-200 text-2xl items-center mx-auto justify-start text-center">
                    <p className=" flex items-center justify-center  w-4/5 mx-auto pb-2 gap-2">
                        Recently Liked Songs:
                    </p>
                    
                </div>
                <div className="flex-col mx-5 bg-black w-full rounded-lg m-1 border-b-2 py-5 border-slate-600    font-bold text-slate-200 text-2xl items-center mx-auto justify-start text-center">
                    <p className=" flex items-center justify-center  w-4/5 mx-auto pb-2 gap-2">
                        <FaHistory /> History
                    </p>
                    <div>
                        
                    </div>
                </div>
                <div className="flex-col mx-5 m1 w-4/5 rounded-lg w-full bg-black flex py-5 font-bold text-slate-200 text-2xl items-center mx-auto justify-start text-center">
                    
                </div> */}
            </div>
        </>
    )
}

export default Sidebar
