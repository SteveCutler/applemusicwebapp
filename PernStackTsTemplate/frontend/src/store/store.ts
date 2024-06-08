import { create } from 'zustand'
import { toast } from 'react-hot-toast'
import { saveToken } from '../components/Apple/saveToken'

type AuthUserType = {
    id: string
    fullName: string
    email: string
    username: string
    message?: string
}

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

// interface MusickitInstanceType {
//     MusickitInstance: any
// }
interface MusickitInstance {
    api: {
        music: (endpoint: string, options?: object) => Promise<any>
    }
}

interface State {
    isAuthorized: boolean
    backendToken: string | null
    musicKitInstance: MusickitInstance | null
    appleMusicToken: string | null
    searchTerm: string
    playlist: Song[]
    currentSongIndex: number | null
    isPlaying: boolean
}

interface Actions {
    authorizeBackend: () => Promise<void>
    setBackendToken: (token: string) => void
    setAuthorized: (isAuthorized: boolean) => void
    authorizeMusicKit: () => Promise<void>
    fetchAppleToken: () => Promise<void>
    generateAppleToken: () => Promise<void>
    setSearchTerm: (term: string) => void
    setPlaylist: (songs: Song[]) => void
    playSong: (index: number) => void
    pauseSong: () => void
    nextSong: () => void
    previousSong: () => void
    updatePlayback: (index: number, isPlaying: boolean) => void
    getCurrentSongTitle: () => string | null
}

type Store = State & Actions

export const useStore = create<Store>((set, get) => ({
    // State
    isAuthorized: false,
    backendToken: null,
    musicKitInstance: null,
    appleMusicToken: '',
    searchTerm: '',
    playlist: [],
    currentSongIndex: null,
    isPlaying: false,

    // Actions
    authorizeBackend: async () => {
        try {
            const res = await fetch('http://localhost:5000/api/auth/me', {
                credentials: 'include',
            })
            const data: AuthUserType = await res.json()

            if (!res.ok) {
                throw new Error(data.message)
            }
            const { id } = data

            set({ backendToken: id, isAuthorized: true })
            console.log('succesfully authorized user')
        } catch (error) {
            console.log(error)
            console.log('error in authorize backend')
        }
    },

    setBackendToken: (token: string) => set({ backendToken: token }),
    setAuthorized: (isAuthorized: boolean) => set({ isAuthorized }),

    fetchAppleToken: async () => {
        const { musicKitInstance } = get()
        const { backendToken } = get()
        if (musicKitInstance) {
            try {
                const res = await fetch(
                    'http://localhost:5000/api/apple/get-token',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            userId: backendToken,
                        }),
                        credentials: 'include',
                    }
                )
                //console.log(res)

                if (!res.ok) {
                    console.log(res.body)
                    toast.error('Error fetching apple auth')
                }

                const { appleMusicToken, tokenExpiryDate } = await res.json()
                if (appleMusicToken === null || tokenExpiryDate === null) {
                    console.log('Apple music token doesnt exist')
                }

                const now = new Date()

                if (now < new Date(tokenExpiryDate)) {
                    set({ appleMusicToken: appleMusicToken })
                } else {
                    console.log('Token expired')
                    toast.error('Token expired')
                }
            } catch (error) {
                console.error('Error fetching token:', error)
                toast.error('Error fetching apple auth')
            }
        }
    },

    generateAppleToken: async () => {
        const { backendToken } = get()
        try {
            const music = await (window as any).MusicKit.configure({
                developerToken: import.meta.env.VITE_MUSICKIT_DEVELOPER_TOKEN,
                app: {
                    name: 'AppleMusicDashboard',
                    build: '1.0.0',
                },
            })
            if (music) {
                const userToken = await music.authorize()
                set({ appleMusicToken: userToken })
                saveToken(userToken, backendToken)
            }
        } catch (error) {
            console.error(error)
        }
    },

    authorizeMusicKit: async () => {
        //Check if instance of musicKit exists already:
        if ((window as any).MusicKit) {
            console.log('instance already exists')
            // MusicKit script already loaded
            const music = await (window as any).MusicKit.configure({
                developerToken: import.meta.env.VITE_MUSICKIT_DEVELOPER_TOKEN,
                app: {
                    name: 'AppleMusicDashboard',
                    build: '1.0.0',
                },
            })
            console.log('succesfully authorized musickit')
            set({ musicKitInstance: music })

            return
        }

        // Check for token on on server, if valid move on, if not - generate one and save it on server.

        const script = document.createElement('script')
        script.src = 'https://js-cdn.music.apple.com/musickit/v3/musickit.js'
        script.onload = () => {
            document.addEventListener('musickitloaded', async () => {
                try {
                    const music = await (window as any).MusicKit.configure({
                        developerToken: import.meta.env
                            .VITE_MUSICKIT_DEVELOPER_TOKEN,
                        app: {
                            name: 'AppleMusicDashboard',
                            build: '1.0.0',
                        },
                    })
                    if (music) {
                        set({ musicKitInstance: music })
                    }
                } catch (error) {
                    console.error(error)
                }
            })
        }
        document.body.appendChild(script)
        console.log('succesfully authorized musickit')
        return
    },

    setSearchTerm: (term: string) => set({ searchTerm: term }),
    setPlaylist: (songs: Song[]) => set({ playlist: songs }),
    playSong: (index: number) => {
        // const songId = get().playlist[index].id
        // const music = get().musicKitInstance
        // if (music) {
        //     music.setQueue({ song: songId }).then(() => {
        //         music.play()
        //         set({ currentSongIndex: index, isPlaying: true })
        //     })
        // }
    },
    pauseSong: () => {
        // const music = get().musicKitInstance
        // if (music) {
        //     music.pause()
        //     set({ isPlaying: false })
        // }
    },
    nextSong: () =>
        set(state => {
            const nextIndex =
                state.currentSongIndex !== null &&
                state.currentSongIndex < state.playlist.length - 1
                    ? state.currentSongIndex + 1
                    : state.currentSongIndex
            if (nextIndex && nextIndex !== state.currentSongIndex) {
                get().playSong(nextIndex)
            }
            return { currentSongIndex: nextIndex, isPlaying: true }
        }),
    previousSong: () =>
        set(state => {
            const prevIndex =
                state.currentSongIndex !== null && state.currentSongIndex > 0
                    ? state.currentSongIndex - 1
                    : state.currentSongIndex
            if (prevIndex && prevIndex !== state.currentSongIndex) {
                get().playSong(prevIndex)
            }
            return { currentSongIndex: prevIndex, isPlaying: true }
        }),
    updatePlayback: (index: number, isPlaying: boolean) =>
        set({ currentSongIndex: index, isPlaying }),

    getCurrentSongTitle: () => {
        return null
        // const music = get().musicKitInstance
        // const currentItem = music?.player.nowPlayingItem
        // return currentItem ? currentItem.attributes.name : null
    },
}))
