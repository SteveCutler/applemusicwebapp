import { create } from 'zustand'
import { toast } from 'react-hot-toast'
import { saveToken } from '../components/Apple/saveToken'
import e from 'express'
import { CloudHail } from 'lucide-react'

type AuthUserType = {
    id: string
    fullName: string
    email: string
    username: string
    message?: string
}

interface Song {
    id: string
    type: string
    attributes: {
        id?: string
        name: string
        trackNumber: number
        artistName: string
        albumName: string
        durationInMillis: number
        playParams: {
            catalogId: string
        }
    }
}
// interface MusickitInstanceType {
//     MusickitInstance: any
// }
interface MusickitInstance {
    api: {
        music: (endpoint: string, options?: object) => Promise<any>
    }
    nowPlayingItem: {
        id: string
        container: {
            id: string
        }
        attributes: {
            name: string
            durationInMillis: number
            trackNumber: number
        }
    }
    mute: () => void
    unmute: () => Promise<void>
    nowPlayingItemIndex: number
    isPlaying: boolean
    changeToMediaItem: (index: number) => Promise<void>
    Queue: {
        items: any
    }
    volume: number
    seekToTime: (elapsedTime: number) => Promise<void>
    playNext: () => Promise<void>
    stop: () => Promise<void>
    changeToMediaAtIndex: (trackNumber: number) => Promise<void>
    player: {
        nowPlayingItem: MusicKitDescriptor
        queue: QueueMethods
    }
    setQueue: (options: SetQueueOptions) => Promise<void>
    play: () => Promise<void>
    pause: () => Promise<void>
    skipToNextItem: () => Promise<void>
    skipToPreviousItem: () => Promise<void>
}

interface QueueMethods {
    jumpToItem: (trackNumber: number) => Promise<void>
}

interface SearchResults {
    albums?: {
        data: SearchResultAlbum[]
    }
    artists?: {
        data: SearchResultArtist[]
    }
    songs?: {
        data: SearchResultsSong[]
    }
}

interface SearchResultArtist {
    attributes: {
        artwork: {
            bgColor: string
            url: string
        }
        genreNames: Array<string>
        name: string
        url: string
    }
    href: string
    id: string
    relationships: {
        albums: AlbumRelationships[]
    }
    type: string
}

interface SearchResultsSong {
    href: string
    id: string
    type: string
    attributes: {
        albumName: string
        artistName: string
        artwork: {
            bgColor: string
            url: string
        }
        composerName: string
        durartionInMillis: number
        genreNames: Array<string>
        name: string
        playParams: {
            id: string
            kind: string
        }
        releaseDate: string
        trackNumber: number
        url: string
    }
}
interface SearchResultAlbum {
    attributes: {
        artistName: string
        artwork: {
            bgColor: string
            url: string
        }
        contentRating: string
        copyright: string
        editorialNotes: {
            short: string
            tagline: string
            standard: string
        }
        genreNames: Array<string>
        name: string
        recordLabel: string
        releaseDate: string
        trackCount: 17
        playParans: {
            id: string
            kind: string
        }
    }
    href: string
    id: string
    type: string
}
interface SetQueueOptions {
    album?: string | undefined
    items?: Array<MusicKitDescriptor>
    startWith?: number | undefined
    startPlaying?: boolean
}
interface MusicKitDescriptor {
    id: string
    type: string
}

interface AlbumRelationships {
    href: string
    id: string
    type: string
}

interface Album {
    id: string
    albumId: string
    name: string
    artistName: string
    artworkUrl: string
    trackCount: number
}

interface State {
    isAuthorized: boolean
    backendToken: string | null
    musicKitInstance: MusickitInstance | null
    appleMusicToken: string | null
    searchTerm: string
    albums: Array<Album> | null
    albumData: Song[]
    volume: number
    searchResults: SearchResults
    playlist: Song[]
    currentSongIndex: number
    currentSongId: string | null
    currentSongDuration: number | null
    currentElapsedTime: number | null
    isPlaying: boolean
    scrubTime: number | null
    muted: boolean
}

interface Actions {
    authorizeBackend: () => Promise<void>
    setBackendToken: (token: string) => void
    setMusicKitInstance: (musicKitInstance: MusickitInstance) => void
    setCurrentElapsedTime: (elapsedTime: number | null) => void
    setAuthorized: (isAuthorized: boolean) => void
    setCurrentSongIndex: (currentSongIndex: number) => void
    setCurrentSongId: () => void
    setCurrentVolume: (volume: number) => void
    authorizeMusicKit: () => Promise<void>
    switchTrack: (trackNumber: number) => Promise<void>
    fetchAppleToken: () => Promise<void>
    generateAppleToken: () => Promise<void>
    setSearchTerm: (term: string) => void
    setAlbumData: (album: Song[]) => void
    setPlaylist: (songs: Song[], index: number, startPlaying: boolean) => void
    playSong: () => void
    pauseSong: () => Promise<void>
    nextSong: () => void
    previousSong: () => void
    updatePlayback: (index: number, isPlaying: boolean) => void
    getCurrentSongTitle: () => string | null
    setScrubTime: (time: number | null) => void
    setMuted: (muted: boolean) => void
    setAlbums: (albums: Array<Album>) => void
    setSearchResults: (results: SearchResults) => void
}

type Store = State & Actions

export const useStore = create<Store>((set, get) => ({
    // State
    isAuthorized: false,
    scrubTime: null,
    volume: 0.75,
    backendToken: null,
    albums: null,
    albumData: [],
    musicKitInstance: null,
    appleMusicToken: '',
    searchResults: {},
    searchTerm: '',
    playlist: [],
    currentSongIndex: 0,
    currentSongDuration: null,
    currentElapsedTime: null,
    currentSongId: '',
    muted: false,
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

    setMuted: async (muted: boolean) => {
        const { musicKitInstance } = get()
        if (musicKitInstance && muted) {
            musicKitInstance.mute()
            set({ volume: 0 })
        } else if (musicKitInstance) {
            await musicKitInstance.unmute()

            set({ volume: musicKitInstance.volume })
        }

        set({ muted })
    },

    setAlbums: (albums: Array<Album>) => set({ albums: albums }),

    setSearchResults: (results: SearchResults) =>
        set({ searchResults: results }),

    setCurrentSongId: async () => {
        const { musicKitInstance } = get()
        if (musicKitInstance) {
            set({ currentSongId: musicKitInstance.nowPlayingItem.id })
        }
    },
    setCurrentVolume: async (volume: number) => {
        const { musicKitInstance } = get()
        if (musicKitInstance) {
            musicKitInstance.volume = volume
            set({ volume })
        }
    },

    setAlbumData: (album: Song[]) => set({ albumData: album }),
    setBackendToken: (token: string) => set({ backendToken: token }),
    setAuthorized: (isAuthorized: boolean) => set({ isAuthorized }),
    setCurrentSongIndex: async (currentSongIndex: number) => {
        const { musicKitInstance, playlist } = get()
        if (musicKitInstance && playlist) {
            console.log('changing start position to index: ', currentSongIndex)
            console.log('playlist: ', playlist)
            await musicKitInstance.setQueue({
                startWith: currentSongIndex,
            })
        }
        set({ currentSongIndex: currentSongIndex })
    },
    setCurrentElapsedTime: (elapsedTime: number | null) =>
        set({ currentElapsedTime: elapsedTime }),

    setScrubTime: (time: number | null) => set({ scrubTime: time }),

    setMusicKitInstance: (musicKitInstance: any) => {
        // Ensure the event listeners are attached
        // const updateState = () => {
        //     const { playbackState, nowPlayingItem } = musicKitInstance.player
        //     const isPlaying = playbackState === MusicKit.PlaybackState.playing
        //     const currentSongId = nowPlayingItem?.id || null
        //     const currentSongDuration =
        //         nowPlayingItem?.attributes.durationInMillis || null
        //     set({ isPlaying, currentSongId, currentSongDuration })
        //     console.log('       update state')
        // }

        // // Add playback state change event listener
        // musicKitInstance.player.addEventListener(
        //     'playbackStateDidChange',
        //     updateState
        // )

        // // Add now playing item change event listener
        // musicKitInstance.player.addEventListener(
        //     'nowPlayingItemDidChange',
        //     updateState
        // )

        // // Add playback progress change event listener
        // musicKitInstance.player.addEventListener(
        //     'playbackProgressDidChange',
        //     () => {
        //         const currentElapsedTime =
        //             musicKitInstance.player.currentPlaybackTime
        //         set({ currentElapsedTime })
        //     }
        // )

        set({ musicKitInstance })
    },

    fetchAppleToken: async () => {
        const { musicKitInstance, appleMusicToken } = get()
        const { backendToken } = get()
        if (!appleMusicToken) {
            try {
                console.log('getting token from backend')
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
                console.log(res)

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
                    console.log('setting apple music token')
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
        const { backendToken, appleMusicToken } = get()
        try {
            const music = await (window as any).MusicKit.configure({
                developerToken: import.meta.env.VITE_MUSICKIT_DEVELOPER_TOKEN,
                app: {
                    name: 'AppleMusicDashboard',
                    build: '1.0.0',
                },
            })
            if (music && !appleMusicToken) {
                const userToken = music.authorize()
                set({ appleMusicToken: userToken })
                //saveToken(userToken, backendToken)
            }
        } catch (error) {
            console.error(error)
        }
    },

    authorizeMusicKit: async () => {
        if (!(window as any).MusicKit) {
            const script = document.createElement('script')
            script.src =
                'https://js-cdn.music.apple.com/musickit/v3/musickit.js'
            script.onload = () => {
                document.addEventListener('musickitloaded', async () => {
                    try {
                        console.log('creating musickit')
                        const music = await (window as any).MusicKit.configure({
                            developerToken: import.meta.env
                                .VITE_MUSICKIT_DEVELOPER_TOKEN,
                            app: {
                                name: 'AppleMusicDashboard',
                                build: '1.0.0',
                            },
                        })
                        if (music) {
                            console.log('adding event listeners...')
                            // Attach event listeners here
                            const updateState = () => {
                                const { playbackState, nowPlayingItem } = music

                                const isPlaying =
                                    playbackState === 2 ? true : false

                                console.log('is it playing? :', music.layer)
                                const currentSongId = nowPlayingItem?.id
                                const currentSongDuration =
                                    nowPlayingItem?.attributes
                                        .durationInMillis || null
                                useStore.setState({
                                    isPlaying,
                                    currentSongId,
                                    currentSongDuration,
                                    scrubTime: null,
                                })
                            }

                            music.addEventListener(
                                'playbackStateDidChange',
                                ({ oldState, state }: any) => {
                                    console.log(
                                        `Changed the playback state from ${oldState} to ${state}`
                                    )
                                    updateState()
                                    // if (music) {
                                    //     const { playbackState } = music
                                    //     useStore.setState({
                                    //         isPlaying: playbackState,
                                    //     })
                                    // }
                                }
                            )
                            music.addEventListener(
                                'nowPlayingItemDidChange',
                                () => {
                                    if (music) {
                                        // Attach event listeners here

                                        const { nowPlayingItem } = music

                                        const currentSongId = nowPlayingItem?.id
                                        const currentSongDuration =
                                            nowPlayingItem?.attributes
                                                .durationInMillis || null
                                        useStore.setState({
                                            currentSongId,
                                            currentSongDuration,
                                            currentElapsedTime: 0,
                                            scrubTime: null,
                                        })
                                    }
                                }
                            )
                            music.addEventListener(
                                'playbackTimeDidChange',
                                () => {
                                    if (music) {
                                        const { playbackState } = music

                                        if (playbackState) {
                                            const currentElapsedTime =
                                                music.currentPlaybackTime * 1000
                                            useStore.setState({
                                                currentElapsedTime,
                                            })
                                        }
                                    }
                                }
                            )
                        }

                        set({ musicKitInstance: music })
                        console.log('MusicKit instance: ', music)
                    } catch (error) {
                        console.error(error)
                    }
                })
            }
            document.body.appendChild(script)
            console.log('MusicKit script loaded')
        } else {
            console.log('musickit instance already exists')
            const music = await (window as any).MusicKit.configure({
                developerToken: import.meta.env.VITE_MUSICKIT_DEVELOPER_TOKEN,
                app: {
                    name: 'AppleMusicDashboard',
                    build: '1.0.0',
                },
            })
            set({ musicKitInstance: music })
            console.log('MusicKit instance: ', music)
        }
    },

    setSearchTerm: (term: string) => set({ searchTerm: term }),

    setPlaylist: async (
        songs: Song[],
        index: number,
        startPlaying: boolean
    ) => {
        console.log('set playlist')
        const { musicKitInstance, playlist } = get()

        if (musicKitInstance) {
            const songDescriptors = songs.map(song => ({
                id: song.id,
                type: 'song',
            }))
            console.log('setting playlist and start position')
            await musicKitInstance.setQueue({
                items: songDescriptors,
                startWith: index,
                startPlaying: startPlaying,
            })
        }
        set({ playlist: songs, currentSongIndex: index })
    },

    playSong: async () => {
        const { musicKitInstance, playlist } = get()
        console.log('attempting to play song')
        console.log('musicKitIns: ', musicKitInstance, ' playlist: ', playlist)

        if (musicKitInstance && playlist) {
            console.log('playing song')
            // musicKitInstance.setQueue({
            //     items: playlist.map(song => ({ id: song.id, type: song.type })),
            //     startPosition: 1,
            // })

            await musicKitInstance.play()
            const currentSongDuration =
                musicKitInstance.nowPlayingItem?.attributes.durationInMillis
            //set({ currentSongDuration })
            set({
                isPlaying: true,
                currentSongDuration,
                currentSongId: musicKitInstance.nowPlayingItem.id,
            })
        }
    },

    switchTrack: async (trackNumber: number) => {
        const { musicKitInstance, playlist } = get() // Replace with the correct way to get your musicKitInstance

        if (musicKitInstance && playlist[trackNumber]) {
            try {
                // Change to the new track
                await musicKitInstance.changeToMediaAtIndex(trackNumber)
                const currentSongDuration =
                    musicKitInstance.nowPlayingItem?.attributes.durationInMillis
                console.log(`Changed to track at index: ${trackNumber}`)
                const track = playlist[trackNumber]
                set({
                    // currentSongDuration,
                    isPlaying: true,
                    currentSongIndex: trackNumber,
                    currentSongId: track.id,
                })
                // Play the new track

                // await musicKitInstance.play()
                console.log('Playing new track')
            } catch (error) {
                console.error('Error switching tracks:', error)
            }
        }
    },

    pauseSong: async () => {
        const { musicKitInstance } = get()
        // const music = get().musicKitInstance

        if (musicKitInstance) {
            console.log('pausing')
            await musicKitInstance.pause()
            // set({ isPlaying: false })
        }
    },
    nextSong: async () => {
        const { musicKitInstance, playlist } = get()

        if (musicKitInstance) {
            try {
                if (
                    musicKitInstance.nowPlayingItemIndex ===
                    playlist.length - 1
                ) {
                    console.log('currently on last song - stopping player')
                    await musicKitInstance.stop()
                    set({
                        isPlaying: false,
                        currentSongId: playlist[0].id,
                        currentSongIndex: 0,
                    })
                } else {
                    // Change to the new track
                    await musicKitInstance.skipToNextItem()
                    const currentSongDuration =
                        musicKitInstance.nowPlayingItem?.attributes
                            .durationInMillis

                    console.log(`skipping to next track`)
                    // Play the new track
                    set({
                        // currentSongDuration,
                        isPlaying: true,
                        //currentSongId: musicKitInstance.nowPlayingItem.id,
                    })
                    // await musicKitInstance.play()
                    console.log('Playing new track')
                }
            } catch (error) {
                console.error('Error switching tracks:', error)
            }
        }
    },
    previousSong: async () => {
        const { musicKitInstance } = get()

        if (musicKitInstance) {
            try {
                // Change to the new track
                await musicKitInstance.skipToPreviousItem()
                console.log(`skipping to previous track`)
                const currentSongDuration =
                    musicKitInstance.nowPlayingItem?.attributes.durationInMillis

                // Play the new track
                set({
                    // currentSongDuration,
                    isPlaying: true,
                    // currentSongId: musicKitInstance.nowPlayingItem.id,
                })
                // await musicKitInstance.play()
                console.log('Playing new track')
            } catch (error) {
                console.error('Error switching tracks:', error)
            }
        }
    },
    updatePlayback: (index: number, isPlaying: boolean) =>
        set({ currentSongIndex: index, isPlaying }),

    getCurrentSongTitle: () => {
        return null
        // const music = get().musicKitInstance
        // const currentItem = music?.player.nowPlayingItem
        // return currentItem ? currentItem.attributes.name : null
    },
}))
