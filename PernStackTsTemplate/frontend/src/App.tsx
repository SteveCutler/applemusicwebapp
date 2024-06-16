import { Routes, Navigate, Route } from 'react-router-dom'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import { useStore } from './store/store'
import { useEffect } from 'react'

import { Toaster } from 'react-hot-toast'
import Album from './pages/Album'
import Footer from './components/Homepage/Footer'
import Sidebar from './components/Homepage/Sidebar'
import Playlist from './pages/Playlist'
import Library from './pages/Library'
import Stacks from './pages/Stacks'
import Search from './pages/Search'
import Artist from './pages/Artist'

function App() {
    const { backendToken, authorizeBackend } = useStore(state => ({
        backendToken: state.backendToken,
        authorizeBackend: state.authorizeBackend,
    }))
    useEffect(() => {
        const authBackend = async () => {
            console.log('authorizing backend')
            authorizeBackend()
        }
        if (!backendToken) {
            authBackend()
        }
        console.log('backend previously authorized')
    }, [authorizeBackend])
    return (
        <div className="flex-col justify-between h-screen ">
            <div className="flex">
                <div className="sidebar w-1/6 bg-black">
                    <Sidebar />
                </div>
                <div className="flex items-top w-4/5 justify-center">
                    <Routes>
                        <Route
                            path="/"
                            element={
                                backendToken ? (
                                    <Home />
                                ) : (
                                    <Navigate to="/login" />
                                )
                            }
                        />
                        <Route
                            path="/signup"
                            element={
                                !backendToken ? <SignUp /> : <Navigate to="/" />
                            }
                        />
                        <Route
                            path="/search/"
                            element={!backendToken ? <Login /> : <Search />}
                        />
                        <Route
                            path="/artist/:Id"
                            element={!backendToken ? <Login /> : <Artist />}
                        />
                        <Route
                            path="/login"
                            element={
                                !backendToken ? <Login /> : <Navigate to="/" />
                            }
                        />
                        <Route
                            path="/library"
                            element={!backendToken ? <Login /> : <Library />}
                        />
                        <Route path="/stacks" element={<Stacks />} />
                        <Route
                            path="/album/:albumId/:type?"
                            element={<Album />}
                        />
                        <Route
                            path="/playlist/:playlistId"
                            element={<Playlist />}
                        />
                    </Routes>
                </div>
            </div>
            <div className="flex sticky bottom-0">
                <Footer />
            </div>
            <Toaster />
        </div>
    )
}
export default App
