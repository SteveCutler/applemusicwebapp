// reducer.ts
import { Action, ActionTypes } from './Actions'

interface Song {
    id: string
    attributes: {
        name: string
        trackNumber: number
        artistName: string
        albumName: string
        durationInMillis: number
    }
}

interface State {
    isAuthorized: boolean
    currentSongIndex: number | null // Use index for easier navigation
    searchTerm: string
    playlist: Song[]
    currentSong: string | null
    currentSongTitle: string | null
    //timeElapsed: number // in millis

    isPlaying: boolean
}

export const initialState: State = {
    isAuthorized: false,
    searchTerm: '',
    playlist: [],
    currentSong: null,
    currentSongIndex: null,
    currentSongTitle: '',

    isPlaying: false,
}

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case ActionTypes.AUTHORIZE:
            return { ...state, isAuthorized: true }
        case ActionTypes.SEARCH:
            return { ...state, searchTerm: action.payload }
        case ActionTypes.SET_SONGS:
            return { ...state, playlist: action.payload }
        case ActionTypes.PLAY:
            return {
                ...state,
                index: action.payload,
                isPlaying: true,
            }

        case ActionTypes.SET_TITLE:
            return { ...state, currentSongTitle: action.payload }
        case ActionTypes.PAUSE:
            return { ...state, isPlaying: false }
        case ActionTypes.NEXT:
            if (
                state.currentSongIndex !== null &&
                state.currentSongIndex < state.playlist.length - 1
            ) {
                return {
                    ...state,
                    currentSongIndex: state.currentSongIndex + 1,
                    isPlaying: true,
                }
            }
            return state
        case ActionTypes.PREVIOUS:
            if (state.currentSongIndex !== null && state.currentSongIndex > 0) {
                return {
                    ...state,
                    currentSongIndex: state.currentSongIndex - 1,
                    isPlaying: true,
                }
            }
            return state

        case ActionTypes.UPDATE_PLAYBACK:
            return {
                ...state,
                currentSongIndex: action.payload.currentSongIndex,
                isPlaying: true,
            }
        default:
            return state
    }
}

export default reducer
