import { IoHomeSharp } from 'react-icons/io5'
import { FaSearch } from 'react-icons/fa'
import { LuLibrary } from 'react-icons/lu'
import { ImStack } from 'react-icons/im'
import { FaHistory } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import SidebarPlaylists from './SidebarPlaylists'
import { LogOut } from 'lucide-react'
import LogoutButton from './LogoutButton'
import SidebarSongHistory from './SidebarSongHistory'
import SidebarFavouriteSongs from './SidebarFavouriteSongs'
import { CiCirclePlus } from 'react-icons/ci'
import { IoSettingsSharp } from 'react-icons/io5'
import { useStore } from '../../store/store'

const Sidebar = () => {
    const style = { fontSize: '1.2rem' }
    const { queueToggle } = useStore(state => ({
        queueToggle: state.queueToggle,
    }))
    return (
        <>
            <div className="flex-col   m-1  flex  select-none h-full ">
                <div className="  flex-col pt-5 pb-5  bg-black rounded-lg w-full mb-1 mx-auto border-b-2 border-slate-600 font-semibold text-slate-300 text-2xl items-center  justify-start text-center">
                    <div
                        className={`gap-2 pb-2 ${queueToggle ? `text-white` : `text-black`} absolute top-4 right-4 flex items-center`}
                        title="Log out"
                    >
                        <div className="hover:text-white hover:cursor-pointer">
                            <IoSettingsSharp />
                        </div>
                        <div className="hover:text-white">
                            <LogoutButton />
                        </div>
                    </div>
                    <Link
                        to="/"
                        className="flex w-fit mx-auto  px-3 hover:text-slate-100  select:none cursor-pointer rounded-xl  justify-center items-center"
                    >
                        <IoHomeSharp />
                        <p className="p-2">Home</p>
                    </Link>

                    <Link
                        to="/search"
                        className="flex w-fit mx-auto px-3 hover:text-slate-100  cursor-pointer rounded-xl  justify-center items-center"
                    >
                        <FaSearch />
                        <p className="p-2">Search</p>
                    </Link>
                    <Link
                        to="/library"
                        className="flex w-fit mx-auto px-3 hover:text-slate-100  cursor-pointer rounded-xl  justify-center items-center"
                    >
                        <LuLibrary />
                        <p className="p-2">Library</p>
                    </Link>

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
                <div className="flex-col bg-black p-1 rounded-lg w-full border-b-2 py-5 border-slate-600    font-semibold text-slate-300  items-center mx-auto justify-start text-center">
                    <p className=" flex items-center justify-left text-xl  w-full px-5 mx-auto pb-2 gap-2">
                        Recent Activity:
                    </p>
                    <SidebarFavouriteSongs />
                </div>
                {/* <div className="flex-col mx-5 bg-black p-1 rounded-lg w-full border-b-2 py-5 border-slate-600    font-bold text-slate-200 text-2xl items-center mx-auto justify-start text-center">
                    <p className=" flex items-center justify-center  w-4/5 mx-auto pb-2 gap-2">
                        Recently Liked Songs:
                    </p>
                    <SidebarFavouriteSongs />
                </div>
                <div className="flex-col mx-5 bg-black w-full rounded-lg m-1 border-b-2 py-5 border-slate-600    font-bold text-slate-200 text-2xl items-center mx-auto justify-start text-center">
                    <p className=" flex items-center justify-center  w-4/5 mx-auto pb-2 gap-2">
                        <FaHistory /> History
                    </p>
                    <div>
                        <SidebarSongHistory />
                    </div>
                </div>
                <div className="flex-col mx-5 m1 w-4/5 rounded-lg w-full bg-black flex py-5 font-bold text-slate-200 text-2xl items-center mx-auto justify-start text-center">
                    <SidebarPlaylists />
                </div> */}
            </div>
        </>
    )
}

export default Sidebar
