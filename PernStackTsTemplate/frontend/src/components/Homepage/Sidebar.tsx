import { IoHomeSharp } from 'react-icons/io5'
import { FaSearch } from 'react-icons/fa'
import { LuLibrary } from 'react-icons/lu'
import { ImStack } from 'react-icons/im'
import { Link } from 'react-router-dom'

const Sidebar = () => {
    return (
        <>
            <div className="flex-col ">
                <div className="flex-col m-5 pt-5 w-4/5 pb-5 px-3 border-b-2 border-slate-600 font-semibold text-slate-200 text-2xl items-center mx-auto justify-start text-center">
                    <Link
                        to="/"
                        className="flex w-full px-3 hover: select:none cursor-pointer rounded-xl hover:bg-slate-600 justify-left items-center"
                    >
                        <IoHomeSharp />
                        <p className="p-2">Home</p>
                    </Link>

                    <Link
                        to="/search"
                        className="flex w-full px-3 hover: cursor-pointer rounded-xl hover:bg-slate-600 justify-left items-center"
                    >
                        <FaSearch />
                        <p className="p-2">Search</p>
                    </Link>
                    <Link
                        to="/library"
                        className="flex w-full px-3 hover: cursor-pointer rounded-xl hover:bg-slate-600 justify-left items-center"
                    >
                        <LuLibrary />
                        <p className="p-2">Library</p>
                    </Link>
                    <Link
                        to="/stacks"
                        className="flex w-full px-3 hover: cursor-pointer rounded-xl hover:bg-slate-600 justify-left items-center"
                    >
                        <ImStack />
                        <p className="p-2">Stacks</p>
                    </Link>
                </div>
                <div className="flex-col m-5 py-5 w-4/5 border-b-2 border-slate-600 font-bold text-slate-200 text-2xl items-center mx-auto justify-start text-center">
                    <p>test</p>
                    <p>test</p>
                    <p>test</p>
                    <p>test</p>
                    <p>test</p>
                    <p>test</p>
                </div>
            </div>
        </>
    )
}

export default Sidebar
