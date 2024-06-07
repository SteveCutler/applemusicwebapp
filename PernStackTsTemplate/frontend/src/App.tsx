import { Routes, Navigate, Route } from 'react-router-dom'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import { useAuthContext } from './context/AuthContext'

import { Toaster } from 'react-hot-toast'
import Album from './pages/Album'
import Footer from './components/Homepage/Footer'

function App() {
    const { authUser, isLoading } = useAuthContext()
    // deconstruct setAuthUser
    if (isLoading) {
        return null
    }
    return (
        <div className="flex-col justify-between  h-screen">
            <div className=" flex items-center justify-center">
                <Routes>
                    <Route
                        path="/"
                        element={authUser ? <Home /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/signup"
                        element={!authUser ? <SignUp /> : <Navigate to="/" />}
                    />
                    <Route
                        path="/login"
                        element={!authUser ? <Login /> : <Navigate to="/" />}
                    />
                    <Route path="/album/:albumId" element={<Album />} />
                </Routes>
            </div>
            <Footer />
            <Toaster />
        </div>
    )
}
export default App
