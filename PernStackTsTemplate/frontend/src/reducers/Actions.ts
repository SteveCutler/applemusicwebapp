// actions.ts
export enum ActionTypes {
    AUTHORIZE = 'AUTHORIZE',
    SEARCH = 'SEARCH',
    SET_SONGS = 'SET_SONGS',
    PLAY = 'PLAY',
    PAUSE = 'PAUSE',
    NEXT = 'NEXT',
    PREVIOUS = 'PREVIOUS',
    SET_CURRENT_SONG = 'SET_CURRENT_SONG',
}

export type Song = {
    id: string
    attributes: {
        name: string
        trackNumber: number
        artistName: string
        albumName: string
        durationInMillis: number
    }
}

interface AuthorizeAction {
    type: ActionTypes.AUTHORIZE
}

interface SearchAction {
    type: ActionTypes.SEARCH
    payload: string
}

interface SetSongsAction {
    type: ActionTypes.SET_SONGS
    payload: Song[]
}
interface PlayAction {
    type: ActionTypes.PLAY
    payload: string
}

interface PauseAction {
    type: ActionTypes.PAUSE
}

interface SetCurrentSongAction {
    type: ActionTypes.SET_CURRENT_SONG
    payload: string
}

interface NextAction {
    type: ActionTypes.NEXT
}

interface PreviousAction {
    type: ActionTypes.PREVIOUS
}

export type Action =
    | AuthorizeAction
    | SearchAction
    | SetSongsAction
    | PlayAction
    | PauseAction
    | SetCurrentSongAction
    | NextAction
    | PreviousAction

export const authorize = (): AuthorizeAction => ({
    type: ActionTypes.AUTHORIZE,
})
export const search = (term: string): SearchAction => ({
    type: ActionTypes.SEARCH,
    payload: term,
})
export const setSongs = (songs: Song[]): SetSongsAction => ({
    type: ActionTypes.SET_SONGS,
    payload: songs,
})
export const play = (songId: string): PlayAction => ({
    type: ActionTypes.PLAY,
    payload: songId,
})
export const pause = (): PauseAction => ({ type: ActionTypes.PAUSE })
export const setCurrentSong = (songId: string): SetCurrentSongAction => ({
    type: ActionTypes.SET_CURRENT_SONG,
    payload: songId,
})
export const next = (): NextAction => ({ type: ActionTypes.NEXT })
export const previous = (): PreviousAction => ({ type: ActionTypes.PREVIOUS })
