// MusicContext.tsx
import React, { createContext, useReducer, useContext, ReactNode } from 'react'
import reducer, { initialState } from '../reducers/PlayerReducers'
import { useMusickitContext } from './MusickitContext'
import {
    Action,
    play,
    pause,
    setCurrentSong,
    setCurrentTitle,
    setSongs,
    ActionTypes,
} from '../reducers/Actions'

//import { authorize as authorizeAction, Action } from '../reducers/Actions';

type Song = {
    id: string
    attributes: {
        name: string
        trackNumber: number
        artistName: string
        albumName: string
        durationInMillis: number
    }
}

type PlayParameterObject = {
    catalogId: string
    id: string
    isLibrary: Boolean
    kind: string
}
interface PlayerContextProps {
    state: typeof initialState
    dispatch: React.Dispatch<Action>
    // authorizeUser: () => Promise<void>;
    playSong: (songId: string, songTitle: string) => Promise<void>
    pauseSong: () => void
    togglePlayPause: (songId: string | null, songTitle: string) => void
    nextSong: () => void
    previousSong: () => void
    loadPlaylist: (playlist: Song[]) => void
}

const PlayerContext = createContext<PlayerContextProps | undefined>(undefined)

interface PlayerContextProviderProps {
    children: ReactNode
}

export const PlayerContextProvider: React.FC<PlayerContextProviderProps> = ({
    children,
}) => {
    const [state, dispatch] = useReducer(reducer, initialState)
    const { musicInstance } = useMusickitContext()

    // const authorizeUser = async () => {
    //     const music = MusicKit.getInstance();
    //     try {
    //       await music.authorize();
    //       dispatch(authorizeAction());
    //       console.log('User authorized');
    //     } catch (error) {
    //       console.error('Authorization failed:', error);
    //     }
    //   };

    const playSong = async (songId: string, songTitle: string) => {
        // const music = musicInstance.getInstance()

        await musicInstance.setQueue({ song: songId })
        musicInstance.play()
        console.log('now playing ', songTitle)

        dispatch(play(songId))
        dispatch(setCurrentTitle(songTitle))
    }

    const pauseSong = () => {
        //const music = musicInstance.getInstance()
        musicInstance.pause()
        dispatch(pause())
    }

    const togglePlayPause = (
        songId: string | null,
        songTitle: string | null
    ) => {
        if (state.isPlaying) {
            musicInstance.pause()
            dispatch(pause())
        } else {
            if (state.currentSong && state.isPlaying === false) {
                musicInstance.play()
                dispatch(play(state.currentSong))
                console.log('playtest')
            } else if (songId && songTitle) {
                playSong(songId, songTitle)
            } else if (songId) {
                console.log('toggle play pause error')
            }
        }
    }

    const loadPlaylist = async (playlist: Song[]) => {
        const trackIds = playlist.map(track => track.id) // Changed to map track ids

        dispatch(setSongs(playlist)) // Dispatch setSongs with the playlist
        await musicInstance.setQueue({ songs: trackIds }) // Set the queue with the track ids
        // musicInstance.play() // Start playing the playlist
    }
    const nextSong = () => {
        //const music = MusicKit.getInstance();
        console.log('Next song')
        musicInstance.skipToNextItem()
        dispatch(setCurrentSong(musicInstance.nowPlayingItem.id))

        dispatch(setCurrentTitle(musicInstance.nowPlayingItem.attributes.name))
    }

    const previousSong = () => {
        console.log('prev song')
        //  const music = MusicKit.getInstance();
        musicInstance.skipToPreviousItem()
    }

    return (
        <PlayerContext.Provider
            value={{
                state,
                dispatch,
                playSong,
                pauseSong,
                togglePlayPause,
                nextSong,
                previousSong,
                loadPlaylist,
            }}
        >
            {children}
        </PlayerContext.Provider>
    )
}

export const usePlayerContext = (): PlayerContextProps => {
    const context = useContext(PlayerContext)
    if (context === undefined) {
        throw new Error('useMusicContext must be used within a MusicProvider')
    }
    return context
}
