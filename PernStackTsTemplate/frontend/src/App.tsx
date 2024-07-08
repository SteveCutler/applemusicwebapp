import { Routes, Navigate, Route } from 'react-router-dom'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import { useStore } from './store/store'
import { useEffect, useState } from 'react'

import { Toaster } from 'react-hot-toast'
import Album from './pages/Album'
import Footer from './components/Homepage/Footer'
import Sidebar from './pages/Sidebar'
import Playlist from './pages/Playlist'
import Library from './pages/Library'
import Stacks from './pages/Stacks'
import Search from './pages/Search'
import Artist from './pages/Artist'
import Song from './pages/Song'
import Station from './pages/Station'
import QueueDisplay from './components/Homepage/QueueDisplay'
import Header from './components/Homepage/Header'
import NewPlaylist from './pages/NewPlaylist'
import PlaylistDisplay from './pages/PlaylistDisplay'
import EditPlaylist from './pages/EditPlaylist'
import Favourites from './pages/Favourites'
import AppleMusicLogin from './components/Apple/AppleMusicLogin'
import Settings from './pages/Settings'
import Podcast from './pages/Podcast'
import Podcasts from './pages/Podcasts'

function App() {
    const {
        backendToken,
        authorizeBackend,
        setAppleMusicToken,
        darkMode,
        appleMusicToken,
        setBackendToken,
        musicKitInstance,
        queueToggle,
    } = useStore(state => ({
        darkMode: state.darkMode,
        backendToken: state.backendToken,
        setAppleMusicToken: state.setAppleMusicToken,
        musicKitInstance: state.musicKitInstance,
        queueToggle: state.queueToggle,
        appleMusicToken: state.appleMusicToken,
        authorizeBackend: state.authorizeBackend,
        setBackendToken: state.setBackendToken,
    }))

    // const [isCheckingAuth, setIsCheckingAuth] = useState(true)

    // console.log('backend token', backendToken)
    // console.log('apple token', appleMusicToken)

    useEffect(() => {
        if (!appleMusicToken) {
            const appleToken = localStorage.getItem('musicUserToken')
            setAppleMusicToken(appleToken)
        }

        if (!backendToken) {
            const authToken = localStorage.getItem('backendToken')
            setBackendToken(authToken)
        }
    }, [authorizeBackend, appleMusicToken, backendToken])

    // if (isCheckingAuth) {
    //     return <div>Loading...</div>
    // }

    return (
        <div
            style={{ transition: 'bg 0.5s ease-in-out' }}
            className={`flex-col justify-between bg-fixed flex min-h-screen ${
                !backendToken
                    ? 'bg-gradient-to-b from-indigo-900 to-black'
                    : darkMode
                      ? 'bg-gradient-to-b from-indigo-900 to-black'
                      : 'bg-gradient-to-b from-blue-300 to-orange-900'
            }`}
        >
            <div className="flex flex-grow ">
                {backendToken && (
                    <div className="sidebar overflow-y-auto  w-6/12 sm:w-4/12 md:w-3/12 2xl:w-2/12  h-1/2 ">
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
                                backendToken ? <Navigate to="/" /> : <SignUp />
                            }
                        />
                        <Route
                            path="/search/"
                            element={backendToken ? <Search /> : <Login />}
                        />
                        <Route
                            path="/new-playlist/"
                            element={backendToken ? <NewPlaylist /> : <Login />}
                        />
                        <Route
                            path="/artist/:Id"
                            element={backendToken ? <Artist /> : <Login />}
                        />
                        <Route
                            path="/login"
                            element={
                                backendToken ? <Navigate to="/" /> : <Login />
                            }
                        />
                        <Route
                            path="/library"
                            element={backendToken ? <Library /> : <Login />}
                        />
                        <Route
                            path="/settings"
                            element={backendToken ? <Settings /> : <Login />}
                        />
                        <Route
                            path="/podcasts"
                            element={backendToken ? <Podcasts /> : <Login />}
                        />
                        <Route
                            path="/podcast/:id"
                            element={backendToken ? <Podcast /> : <Login />}
                        />
                        <Route
                            path="/playlist-display"
                            element={
                                backendToken ? <PlaylistDisplay /> : <Login />
                            }
                        />
                        <Route
                            path="/favourites"
                            element={backendToken ? <Favourites /> : <Login />}
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
