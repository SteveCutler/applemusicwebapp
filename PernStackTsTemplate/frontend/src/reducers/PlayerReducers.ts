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
    searchTerm: string
    playlist: Song[]
    currentSong: string | null
    //timeElapsed: number // in millis
    isPlaying: boolean
}

export const initialState: State = {
    isAuthorized: false,
    searchTerm: '',
    playlist: [],
    currentSong: null,
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
            return { ...state, currentSong: action.payload, isPlaying: true }
        case ActionTypes.PAUSE:
            return { ...state, isPlaying: false }
        case ActionTypes.NEXT:
            // Logic for next song
            return state
        case ActionTypes.PREVIOUS:
            // Logic for previous song
            return state
        default:
            return state
    }
}

export default reducer
