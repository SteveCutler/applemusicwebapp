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
import QueueDisplay from './components/Homepage/QueueDisplay'
import Header from './components/Homepage/Header'

function App() {
    const { backendToken, authorizeBackend, setBackendToken, queueToggle } =
        useStore(state => ({
            backendToken: state.backendToken,
            queueToggle: state.queueToggle,
            authorizeBackend: state.authorizeBackend,
            setBackendToken: state.setBackendToken,
        }))

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
            <div className="flex flex-grow ">
                {backendToken && (
                    <div className="sidebar overflow-y-auto w-3/12 2xl:w-2/12  h-1/2 ">
                        <Sidebar />
                    </div>
                )}
                {backendToken && (
                    <div className="">
                        <Header />
                    </div>
                )}
                <div
                    className={`flex flex-col ${queueToggle ? 'w-5/12 2xl:6/12' : 'w-8/12 2xl:w-8/12 '}  flex-grow items-center pt-20 justify-start`}
                >
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
                {queueToggle && backendToken && (
                    <div className="sidebar w-3/12 2xl:w-2/12  rounded-lg m-1 h-fit bg-black">
                        <QueueDisplay />
                    </div>
                )}
            </div>
            {backendToken && (
                <div className="flex-shrink-0 z-20 sticky  flex bottom-0">
                    <Footer />
                </div>
            )}
            <Toaster />
        </div>
    )
}
export default App
