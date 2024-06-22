import { Routes, Navigate, Route } from 'react-router-dom'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import { useStore } from './store/store'
import { useEffect, useState } from 'react'

import { Toaster } from 'react-hot-toast'
import Album from './pages/Album'
import Footer from './components/Homepage/Footer'
import Sidebar from './components/Homepage/Sidebar'
import Playlist from './pages/Playlist'
import Library from './pages/Library'
import Stacks from './pages/Stacks'
import Search from './pages/Search'
import Artist from './pages/Artist'
import Song from './pages/Song'
import Station from './pages/Station'

function App() {
    const { backendToken, authorizeBackend, setBackendToken } = useStore(
        state => ({
            backendToken: state.backendToken,
            authorizeBackend: state.authorizeBackend,
            setBackendToken: state.setBackendToken,
        })
    )

    const [isCheckingAuth, setIsCheckingAuth] = useState(true)
    const authToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('authToken='))
        ?.split('=')[1]

    useEffect(() => {
        const checkAuth = async () => {
            if (authToken) {
                setBackendToken(authToken)
            } else {
                await authorizeBackend()
            }

            setIsCheckingAuth(false)
        }

        checkAuth()
    }, [authorizeBackend, setBackendToken])

    if (isCheckingAuth) {
        return <div>Loading...</div>
    }

    return (
        <div className="flex-col justify-between flex min-h-screen ">
            <div className="flex flex-grow">
                <div className="sidebar w-1/6  bg-black">
                    <Sidebar />
                </div>
                <div className="flex flex-col w-5/6 flex-grow items-center justify-start">
                    <Routes>
                        <Route
                            path="/"
                            element={
                                backendToken || authToken ? (
                                    <Home />
                                ) : (
                                    <Navigate to="/login" />
                                )
                            }
                        />
                        <Route
                            path="/signup"
                            element={
                                backendToken || authToken ? (
                                    <Navigate to="/" />
                                ) : (
                                    <SignUp />
                                )
                            }
                        />
                        <Route
                            path="/search/"
                            element={
                                backendToken || authToken ? (
                                    <Search />
                                ) : (
                                    <Login />
                                )
                            }
                        />
                        <Route
                            path="/artist/:Id"
                            element={
                                backendToken || authToken ? (
                                    <Artist />
                                ) : (
                                    <Login />
                                )
                            }
                        />
                        <Route
                            path="/login"
                            element={
                                backendToken || authToken ? (
                                    <Navigate to="/" />
                                ) : (
                                    <Login />
                                )
                            }
                        />
                        <Route
                            path="/library"
                            element={
                                backendToken || authToken ? (
                                    <Library />
                                ) : (
                                    <Login />
                                )
                            }
                        />
                        <Route path="/stacks" element={<Stacks />} />
                        <Route
                            path="/album/:albumId/:type?"
                            element={<Album />}
                        />
                        <Route
                            path="/station/:stationId/:type?"
                            element={<Station />}
                        />
                        <Route path="/song/:songId/:type?" element={<Song />} />
                        <Route
                            path="/playlist/:playlistId"
                            element={<Playlist />}
                        />
                    </Routes>
                </div>
            </div>
            <div className="flex-shrink-0 sticky bottom-0">
                <Footer />
            </div>
            <Toaster />
        </div>
    )
}
export default App
