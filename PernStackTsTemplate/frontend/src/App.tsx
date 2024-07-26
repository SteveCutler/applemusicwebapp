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
import Favourites from './pages/Favourites'
import Settings from './pages/Settings'
import Podcast from './pages/Podcast'
import Podcasts from './pages/Podcasts'

import PodcastEpisode from './pages/PodcastEpisode'

function App() {
    const {
        backendToken,
        authorizeBackend,
        isPlayingPodcast,
        setAppleMusicToken,
        darkMode,
        appleMusicToken,
        setBackendToken,
        isAuthorized,
        authorizeMusicKit,
        musicKitInstance,
        queueToggle,
    } = useStore(state => ({
        isAuthorized: state.isAuthorized,
        darkMode: state.darkMode,
        authorizeMusicKit: state.authorizeMusicKit,
        backendToken: state.backendToken,
        isPlayingPodcast: state.isPlayingPodcast,
        setAppleMusicToken: state.setAppleMusicToken,
        musicKitInstance: state.musicKitInstance,
        queueToggle: state.queueToggle,
        appleMusicToken: state.appleMusicToken,
        authorizeBackend: state.authorizeBackend,
        setBackendToken: state.setBackendToken,
    }))
    const [checkingAuth, setCheckingAuth] = useState(true)
    // const [isCheckingAuth, setIsCheckingAuth] = useState(true)

    // console.log('backend token', backendToken)
    // console.log('apple token', appleMusicToken)

    useEffect(() => {
        const initializeTokens = async () => {
            if (!appleMusicToken) {
                try {
                    const appleToken = localStorage.getItem('musicUserToken')
                    setAppleMusicToken(appleToken)
                } catch (error) {}
            }
            if (!backendToken) {
                try {
                    const authToken = localStorage.getItem('backendToken')
                    setBackendToken(authToken)
                } catch (error) {}
            }
            if (!musicKitInstance && appleMusicToken) {
                await authorizeMusicKit()
            }
        }

        initializeTokens()
        setCheckingAuth(false)
    }, [setBackendToken, appleMusicToken, backendToken, authorizeMusicKit])

    // if (isCheckingAuth) {
    //     return <div>Loading...</div>
    // }

    return (
        <div
            style={{ transition: 'bg 0.5s ease-in-out' }}
            className={`flex-col justify-between bg-fixed flex min-h-screen  ${
                !backendToken
                    ? 'bg-gradient-to-b from-indigo-900 to-black'
                    : darkMode
                      ? 'bg-gradient-to-b from-indigo-950 to-black'
                      : 'bg-gradient-to-b from-blue-300 to-orange-900'
            }`}
        >
            {checkingAuth ? (
                <span className="loading loading-ring loading-lg"></span>
            ) : (
                <div className="flex flex-grow ">
                    {backendToken && appleMusicToken && musicKitInstance && (
                        <div className="sidebar  w-6/12 sm:w-4/12 md:w-3/12 2xl:w-2/12 overflow-y-auto h-1/2 ">
                            <Sidebar />
                        </div>
                    )}
                    {backendToken && appleMusicToken && musicKitInstance && (
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
                                    backendToken &&
                                    appleMusicToken &&
                                    musicKitInstance ? (
                                        <Home />
                                    ) : (
                                        <Navigate to="/login" />
                                    )
                                }
                            />
                            <Route
                                path="/signup"
                                element={
                                    backendToken ? (
                                        <SignUp />
                                    ) : (
                                        <Navigate to="/" />
                                    )
                                }
                            />
                            <Route
                                path="/search/"
                                element={
                                    backendToken &&
                                    appleMusicToken &&
                                    musicKitInstance ? (
                                        <Search />
                                    ) : (
                                        <Login />
                                    )
                                }
                            />
                            <Route
                                path="/new-playlist/"
                                element={
                                    backendToken &&
                                    appleMusicToken &&
                                    musicKitInstance ? (
                                        <NewPlaylist />
                                    ) : (
                                        <Login />
                                    )
                                }
                            />
                            <Route
                                path="/artist/:id"
                                element={
                                    backendToken &&
                                    appleMusicToken &&
                                    musicKitInstance ? (
                                        <Artist />
                                    ) : (
                                        <Login />
                                    )
                                }
                            />
                            <Route
                                path="/login"
                                element={
                                    backendToken &&
                                    appleMusicToken &&
                                    musicKitInstance ? (
                                        <Navigate to="/" />
                                    ) : (
                                        <Login />
                                    )
                                }
                            />
                            <Route
                                path="/library"
                                element={
                                    backendToken &&
                                    appleMusicToken &&
                                    musicKitInstance ? (
                                        <Library />
                                    ) : (
                                        <Login />
                                    )
                                }
                            />
                            <Route
                                path="/settings"
                                element={
                                    backendToken &&
                                    appleMusicToken &&
                                    musicKitInstance ? (
                                        <Settings />
                                    ) : (
                                        <Login />
                                    )
                                }
                            />
                            <Route
                                path="/podcasts"
                                element={
                                    backendToken &&
                                    appleMusicToken &&
                                    musicKitInstance ? (
                                        <Podcasts />
                                    ) : (
                                        <Login />
                                    )
                                }
                            />
                            <Route
                                path="/podcast/:id"
                                element={
                                    backendToken &&
                                    appleMusicToken &&
                                    musicKitInstance ? (
                                        <Podcast />
                                    ) : (
                                        <Login />
                                    )
                                }
                            />
                            <Route
                                path="/podcast-episode/:id"
                                element={
                                    backendToken &&
                                    appleMusicToken &&
                                    musicKitInstance ? (
                                        <PodcastEpisode />
                                    ) : (
                                        <Login />
                                    )
                                }
                            />
                            <Route
                                path="/playlist-display"
                                element={
                                    backendToken &&
                                    appleMusicToken &&
                                    musicKitInstance ? (
                                        <PlaylistDisplay />
                                    ) : (
                                        <Login />
                                    )
                                }
                            />
                            <Route
                                path="/favourites"
                                element={
                                    backendToken &&
                                    appleMusicToken &&
                                    musicKitInstance ? (
                                        <Favourites />
                                    ) : (
                                        <Login />
                                    )
                                }
                            />
                            <Route path="/stacks" element={<Stacks />} />
                            <Route
                                path="/album/:albumId/:type?"
                                element={
                                    backendToken &&
                                    appleMusicToken &&
                                    musicKitInstance ? (
                                        <Album />
                                    ) : (
                                        <Login />
                                    )
                                }
                            />
                            <Route
                                path="/station/:stationId/:type?"
                                element={
                                    backendToken &&
                                    appleMusicToken &&
                                    musicKitInstance ? (
                                        <Station />
                                    ) : (
                                        <Login />
                                    )
                                }
                            />
                            <Route
                                path="/song/:songId/:type?"
                                element={<Song />}
                            />

                            <Route
                                path="/playlist/:playlistId"
                                element={
                                    backendToken &&
                                    appleMusicToken &&
                                    musicKitInstance ? (
                                        <Playlist />
                                    ) : (
                                        <Login />
                                    )
                                }
                            />
                        </Routes>
                    </div>
                    {queueToggle && backendToken && appleMusicToken && (
                        <div className="sidebar w-3/12 2xl:w-2/12  rounded-lg m-1 h-fit bg-black">
                            <QueueDisplay />
                        </div>
                    )}
                </div>
            )}
            {backendToken &&
                appleMusicToken &&
                (isPlayingPodcast || musicKitInstance?.playbackState !== 0) && (
                    <div className="flex-shrink-0 z-20 sticky  flex bottom-0">
                        <Footer />
                    </div>
                )}
            <Toaster />
        </div>
    )
}
export default App
