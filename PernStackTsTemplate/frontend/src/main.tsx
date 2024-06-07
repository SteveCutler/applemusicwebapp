import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AuthContextProvdider } from './context/AuthContext.tsx'
import { MusickitContextProvdider } from './context/MusickitContext'
import { MusicUserTokenContextProvdider } from './context/MusicTokenContext.tsx'
import { PlayerContextProvider } from './context/PlayerContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthContextProvdider>
                <MusicUserTokenContextProvdider>
                    <MusickitContextProvdider>
                        <PlayerContextProvider>
                            <App />
                        </PlayerContextProvider>
                    </MusickitContextProvdider>
                </MusicUserTokenContextProvdider>
            </AuthContextProvdider>
        </BrowserRouter>
    </React.StrictMode>
)
