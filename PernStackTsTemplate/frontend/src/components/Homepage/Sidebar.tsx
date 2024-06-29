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

const Sidebar = () => {
    return (
        <>
            <div className="flex-col rounded-lg  m-1  flex bg-black px-1 select-none h-full ">
                <div className="  flex-col pt-5 pb-5 w-4/5   border-b-2 border-slate-600 font-semibold text-slate-200 text-2xl items-center  justify-start text-center">
                    <Link
                        to="/"
                        className="flex w-full  px-3 hover: select:none cursor-pointer rounded-xl hover:bg-slate-600 justify-center items-center"
                    >
                        <IoHomeSharp />
                        <p className="p-2">Home</p>
                    </Link>

                    <Link
                        to="/search"
                        className="flex w-full px-3 hover: cursor-pointer rounded-xl hover:bg-slate-600 justify-center items-center"
                    >
                        <FaSearch />
                        <p className="p-2">Search</p>
                    </Link>
                    <Link
                        to="/library"
                        className="flex w-full px-3 hover: cursor-pointer rounded-xl hover:bg-slate-600 justify-center items-center"
                    >
                        <LuLibrary />
                        <p className="p-2">Library</p>
                    </Link>
                    <Link
                        to="/stacks"
                        className="flex w-full px-3 hover: cursor-pointer rounded-xl hover:bg-slate-600 justify-center items-center"
                    >
                        <ImStack />
                        <p className="p-2">Stacks</p>
                    </Link>
                    <div className="flex w-full select:none active:scale[0.90] px-3 hover: cursor-pointer  rounded-xl hover:bg-slate-600 justify-center items-center">
                        <div>
                            <LogoutButton />
                        </div>
                        <span className="p-2 ">Logout</span>
                    </div>
                </div>
                <div className="flex-col mx-5 bg-black p-1 rounded-lg w-full border-b-2 pb-5 border-slate-600    font-bold text-slate-200 text-2xl items-center mx-auto justify-start text-center">
                    <p className=" flex items-center justify-center  w-4/5 mx-auto pb-2 gap-2">
                        Recently Liked Songs:
                    </p>
                    <SidebarFavouriteSongs />
                </div>
                <div className="flex-col mx-5  w-full border-b-2 pb-5 border-slate-600    font-bold text-slate-200 text-2xl items-center mx-auto justify-start text-center">
                    <p className=" flex items-center justify-center  w-4/5 mx-auto pb-2 gap-2">
                        <FaHistory /> History
                    </p>
                    <div>
                        <SidebarSongHistory />
                    </div>
                </div>
                <div className="flex-col mx-5 my-2 w-4/5 flex font-bold text-slate-200 text-2xl items-center mx-auto justify-start text-center">
                    <SidebarPlaylists />
                </div>
            </div>
        </>
    )
}

export default Sidebar
