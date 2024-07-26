import { create } from 'zustand'
import { toast } from 'react-hot-toast'
import { saveToken } from '../components/Apple/saveToken'
import e from 'express'
import { CloudHail } from 'lucide-react'
import { TrackHTMLAttributes } from 'react'
import 'react-h5-audio-player/lib/styles.css'
import AudioPlayer from 'react-h5-audio-player'

type AuthUserType = {
    id: string
    fullName: string
    email: string
    username: string
    message?: string
}

type AlbumTypeObject = {
    attributes?: {
        artistName: string
        artwork?: {
            url: string
            bgColor: string
        }
        dateAdded: string
        genreNames: Array<string>
        name: string
        releaseDate: string
        trackCount: number
    }
    relationships?: RelationshipObject
    id: string
}
type RelationshipObject = {
    tracks: TracksObject
    artists?: { data: ArtistObject[] }
}

type TracksObject = {
    data: Array<Track>
}
type Track = {
    attributes: TrackAttributeObject
}

type ArtistObject = {
    id: string
}

interface Song {
    id: string
    href?: string
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
        artwork?: {
            bgColor: string
            url: string
        }
        ratedAt?: Date
    }
}
// interface MusickitInstanceType {
//     MusickitInstance: any
// }

interface MusicKit {
    Player: {
        ShuffleMode: {
            off: string
            songs: string
        }
    }
}

interface MusickitInstance {
    api: {
        music: (endpoint: string, options?: object) => Promise<any>
    }
    storefrontId: string
    PlayerShuffleMode: {
        off: string
        songs: string
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
            albumId?: string
            artwork: {
                url: string
            }
        }
    }
    setMusicUserToken: () => void
    mute: () => void
    unmute: () => Promise<void>
    nowPlayingItemIndex: number
    repeatMode: () => void
    shuffleMode: () => void
    isPlaying: boolean
    changeToMediaItem: (index: number) => Promise<void>
    queue: {
        prepend: (object: any) => void
        items: Song[]
    }
    Queue: {
        items?: any
    }

    volume: number
    currentPlaybackTime: () => void
    seekToTime: (elapsedTime: number) => Promise<void>
    playNext: () => Promise<void>
    stop: () => Promise<void>
    changeToMediaAtIndex: (trackNumber: number) => Promise<void>
    player: {
        nowPlayingItem: MusicKitDescriptor
        queue: QueueMethods
        shuffleMode: string
        setQueue: (options: SetQueueOptions) => Promise<void>
    }
    setQueue: (options: SetQueueOptions) => Promise<void>
    playbackState: number
    play: () => Promise<void>
    pause: () => Promise<void>
    skipToNextItem: () => Promise<void>
    skipToPreviousItem: () => Promise<void>
}

interface SetQueueOptions {
    album?: string | undefined
    song?: string | undefined
    songs?: Array<string> | undefined
    playlist?: string | undefined
    musicVideo?: string | undefined
    items?: Array<MusicKitDescriptor>
    startWith?: number | undefined
    station?: string
    startPlaying?: boolean
    url?: string
}

interface QueueMethods {
    jumpToItem: (trackNumber: number) => Promise<void>
}

interface SearchResults {
    albums?: {
        data: SearchResultAlbum[]
    }
    artists?: {
        data: Artist[]
    }
    songs?: {
        data: Song[]
    }
    podcasts?: {
        data: podcastInfo[]
    }
}

type Artist = {
    attributes: {
        artwork?: {
            bgColor: string
            url: string
        }
        genreNames: Array<string>
        name: string
        url: string
    }
    relationships?: {
        albums?: {
            href: string
            data: Array<AlbumRelationships>
        }
    }
    id: string
    type: string
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

interface MusicKitDescriptor {
    id: string
    type: string
}

interface AlbumRelationships {
    href: string
    id: string
    type: string
}

type playlist = {
    attributes: {
        artwork?: {
            bgColor: string
            url: string
        }
        description?: string
        curatorName?: string
        canEdit: boolean
        playlistType?: string
        dataAdded: string
        isPublic: boolean
        lastModifiedDate: string
        name: string
    }
    href: string
    id: string
    type: string
}

interface podcastEpisode {
    dateCrawled: number
    datePublished: number
    datePublishedPretty: string
    description: string
    duration: number
    enclosureLength: number
    enclosureType: string
    enclosureUrl: string
    episodeType: string
    explicit: number
    feedDead: number
    feedDuplicateOf: number
    feedId: number
    feedImage: string
    feedItunesId: number
    feedLanguage: string
    feedUrl: string
    guid: string
    id: number
    image: string
    link: string
    podcastGuid: string
    season: number
    title: string
    released?: string
    timeSinceRelease?: number
    showTitle?: string
}

type podcastInfo = {
    artwork: string
    author: string
    categories: {
        [key: number]: string
    }
    contentType: string
    crawlErrors: number
    dead: number
    description: string
    episodeCount: number
    explicit: boolean
    generator: string
    id: number
    image: string
    imageUrlHash: number
    inPollingQueue: number
    itunesId: number
    language: string
    lastCrawlTime: number
    lastGoodHttpStatusTime: number
    lastHttpStatus: number
    lastParseTime: number
    lastUpdateTime: number
    link: string
    locked: number
    medium: string
    newestItemPubdate: number
    originalUrl: string
    ownerName: string
    parseErrors: number
    podcastGuid: string
    priority: number
    title: string
    type: number
    url: string
}

type AlbumType = {
    attributes: {
        artistName: string
        artwork?: {
            height: number
            width: number
            url: string
        }
        dateAdded: string
        genreNames: Array<string>
        name: string
        releasedDate: string
        trackCount: number
    }
    id: string
    type: string
}

type AttributeObject = {
    artistName: string
    artwork?: ArtworkObject
    dateAdded: string
    genreNames: Array<string>
    name: string
    releasedDate: string
    trackCount: number
}

type ArtworkObject = {
    height: number
    width: number
    url: string
}
interface Album {
    attributes: {
        artistName: string
        artwork?: { height: number; width: number; url?: string }
        dateAdded: string
        genreNames: Array<string>
        name: string
        releaseDate: string
        trackCount: number
    }
    id: string
    type: string
}

interface HeavyRotAlbum {
    href: string
    id: string
    type: string
}

interface RecommendationType {
    attributes: {
        title: {
            stringForDisplay: string
            contentIds?: string[]
        }
    }
    relationships: {
        contents: {
            data: Array<playlist | AlbumType | StationType>
        }
    }
}

interface StationType {
    attributes: {
        artwork: {
            bgColor: string
            url: string
        }
        mediaKind: string
        name: string
        url: string
        playParams: {
            format: string
            id: string
            kind: string
            stationHash: string
        }
    }
    id: String
    type: string
}

interface favouriteSong {
    songId: string
    ratedAt: Date
}

type RecentlyAddedItem = AlbumType | playlist | StationType | Song

type podSub = {
    title: string
    id: string
    artwork: string
}

type podCompletion = {
    episodeId: number
    progress: string
    completed: boolean
}

// STATE INTERFACE

interface State {
    isAuthorized: boolean
    backendToken: string | null
    musicKitInstance: MusickitInstance | null
    appleMusicToken: string | null
    searchTerm: string
    albums: Array<Album> | null
    albumData: AlbumTypeObject | null
    volume: number
    searchResults: SearchResults
    playlist: Song[]
    gridDisplay: boolean
    currentSongIndex: number
    currentSongId: string | null
    currentSongDuration: number | null
    currentElapsedTime: number | null
    isPlaying: boolean
    libraryPlaylists: Array<playlist> | null
    scrubTime: number | null
    muted: boolean
    heavyRotation: AlbumType[] | null
    recentlyPlayed: AlbumType[] | null
    recommendations: AlbumType[] | null
    recentlyPlayedAlbums: RecommendationType | null
    albumArtUrl: string | null
    personalizedPlaylists: RecommendationType | null
    themedRecommendations: RecommendationType | null
    moreLikeRecommendations: RecommendationType | null
    stationsForYou: RecommendationType | null
    recentlyAddedToLib: RecentlyAddedItem[]
    recentHistory: Song[]
    songData: Song | null
    playlistData: Song[]
    shuffle: boolean
    repeat: number
    queueToggle: boolean
    favouriteSongs: Array<Song> | null
    recentActivity: Array<Song | playlist | Album | StationType> | null
    darkMode: boolean
    trackData: Song[]
    isPlayingPodcast: boolean
    podcastUrl: string
    currentPodcastTime: number
    podcastDuration: number
    podcastAudio: HTMLAudioElement
    currentTime: number
    podcastArtist: string
    podcastEpTitle: string
    podcastArtUrl: string
    showId: number
    scrubPod: number | null
    podcastVolume: number
    podcastMuted: boolean
    podSubs: podSub[] | null
    recentEps: podcastEpisode[] | null
    epId: number
    podcastPlayerInit: boolean
    progressLoaded: boolean
    podcastProgress: podCompletion[] | null
    storefrontId: string | null
    queueOpen: boolean
}

interface Actions {
    authorizeBackend: () => Promise<void>
    setBackendToken: (token: string | null) => void
    setMusicKitInstance: (musicKitInstance: MusickitInstance) => void
    setCurrentElapsedTime: (elapsedTime: number | null) => void
    setAuthorized: (isAuthorized: boolean) => void
    setCurrentSongIndex: (currentSongIndex: number) => void
    setCurrentSongId: () => void
    setCurrentVolume: (volume: number) => void
    authorizeMusicKit: () => Promise<void>
    switchTrack: (trackNumber: number) => Promise<void>
    setGridDisplay: (bool: boolean) => void
    fetchAppleToken: () => Promise<void>
    generateAppleToken: () => Promise<void>
    setAlbumArtUrl: (url: string | null) => void
    setSearchTerm: (term: string) => void
    setAlbumData: (album: AlbumTypeObject | null) => void
    setPlaylist: (
        songs: Song[],
        index: number,
        startPlaying: boolean,
        type?: string
    ) => void
    playSong: () => void
    pauseSong: () => Promise<void>
    nextSong: () => void
    setLibraryPlaylists: (playlists: Array<playlist> | null) => void
    previousSong: () => void
    updatePlayback: (index: number, isPlaying: boolean) => void
    getCurrentSongTitle: () => string | null
    setScrubTime: (time: number | null) => void
    setMuted: (muted: boolean) => void
    setAlbums: (albums: Array<Album> | null) => void
    setSearchResults: (results: SearchResults) => void
    setHeavyRotation: (albums: AlbumType[] | null) => void
    setRecentlyPlayed: (albums: AlbumType[] | null) => void
    setRecommendations: (albums: AlbumType[] | null) => void
    setThemedRecommendations: (items: RecommendationType | null) => void
    setPersonalizedPlaylists: (playlists: RecommendationType | null) => void
    setRecentlyPlayedAlbums: (albums: RecommendationType | null) => void
    setMoreLikeRecommendations: (items: RecommendationType | null) => void
    setStationsForYou: (stations: RecommendationType | null) => void

    setRecentlyAddedToLib: (
        items:
            | RecentlyAddedItem[]
            | ((prevItems: RecentlyAddedItem[]) => RecentlyAddedItem[])
    ) => void
    setRecentHistory: (songs: Song[] | ((prevItems: Song[]) => Song[])) => void
    setSongData: (song: Song | null) => void
    setPlaylistData: (songs: Song[]) => void
    setShuffle: () => void
    setRepeat: () => void
    setQueueToggle: () => void
    setTrackData: (tracks: Song[]) => void
    setRecentActivity: (
        items: Array<Song | playlist | Album | StationType> | null
    ) => void
    setFavouriteSongs: (songs: Array<Song>) => void
    setDarkMode: (toggle: boolean) => void
    setAppleMusicToken: (token: string | null) => void
    playPodcast: (
        url: string,
        time: number,
        artUrl: string,
        trackName: string,
        collectionCensoredName: string,
        showId: number,
        episodeId: number
    ) => void

    stopPodcast: () => void
    updatePodcastTime: (time: number) => void
    pausePodcast: () => void

    setPodcastDuration: (duration: number) => void
    setCurrentTime: () => void
    seekPodcast: (time: number) => void
    setScrubPod: (time: number | null) => void
    setPodcastVolume: (vol: number) => void
    setPodcastMuted: (toggle: boolean) => void
    setPodSubs: (subs: podSub[] | null) => void
    setRecentEps: (eps: podcastEpisode[] | null) => void
    setAudioListeners: () => void
    saveEpisodeProgress: (currentProgress: string, episodeId: number) => void
    setPodcastProgress: (podcastProgress: podCompletion[] | null) => void
    fetchPodcastProgress: () => void
}

type Store = State & Actions

export const useStore = create<Store>((set, get) => ({
    // State

    isAuthorized: false,
    scrubTime: null,
    albumArtUrl: null,
    volume: 0.75,
    backendToken: null,
    albums: null,
    albumData: null,
    musicKitInstance: null,
    appleMusicToken: '',
    trackData: [],
    searchResults: {},
    searchTerm: '',
    playlist: [],
    recentlyPlayed: null,
    heavyRotation: null,
    libraryPlaylists: null,
    currentSongIndex: 0,
    currentSongDuration: null,
    currentElapsedTime: null,
    currentSongId: '',
    muted: false,
    gridDisplay: true,
    isPlaying: false,
    recommendations: null,
    themedRecommendations: null,
    personalizedPlaylists: null,
    recentlyPlayedAlbums: null,
    moreLikeRecommendations: null,
    stationsForYou: null,
    recentlyAddedToLib: [],
    recentHistory: [],
    songData: null,
    playlistData: [],
    shuffle: false,
    repeat: 0,
    queueToggle: false,
    favouriteSongs: null,
    recentActivity: null,
    darkMode: false,
    isPlayingPodcast: false,
    podcastUrl: '',
    currentPodcastTime: 0,
    podcastDuration: 0,
    currentTime: 0,
    podcastArtist: '',
    podcastEpTitle: '',
    podcastArtUrl: '',
    showId: 0,
    epId: 0,
    scrubPod: null,
    podcastMuted: false,
    podcastAudio: new Audio(),
    podcastPlayerInit: false,
    podcastVolume: 0.75,
    podSubs: null,
    recentEps: null,
    progressLoaded: false,
    podcastProgress: null,
    storefrontId: null,
    queueOpen: false,

    // Actions

    setRecentEps: (eps: podcastEpisode[] | null) => set({ recentEps: eps }),
    setPodcastProgress: (podcastProgress: podCompletion[] | null) =>
        set({ podcastProgress }),
    fetchPodcastProgress: async () => {
        const { backendToken } = get()
        const userId = backendToken
        try {
            const response = await fetch(
                'https://mus-backend-b262ef3b1b65.herokuapp.com/api/podcast/get-progress',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId }),
                    credentials: 'include',
                }
            )
            const data = await response.json()
            console.log('podcast Progress', data)
            set({ progressLoaded: true, podcastProgress: data })
        } catch (error: any) {
            console.error('error retrievein podcast progress: ', error)
        }
    },
    setPodSubs: (subs: podSub[] | null) => set({ podSubs: subs }),
    saveEpisodeProgress: async (episodeProgress: string, id: number) => {
        const { backendToken, podcastProgress } = get()
        const userId = backendToken
        const episodeId = String(id)
        const progress = Number(episodeProgress)
        try {
            const response = await fetch(
                'https://mus-backend-b262ef3b1b65.herokuapp.com/api/podcast/save-progress',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ episodeId, progress, userId }),
                    credentials: 'include',
                }
            )

            if (!response.ok) {
                throw new Error('Failed to save progress')
            }

            set(state => {
                const existingIndex = state.podcastProgress.findIndex(
                    episode => String(episode.episodeId) === episodeId
                )

                let updatedPodcastProgress

                if (existingIndex !== -1) {
                    // Update the existing progress
                    updatedPodcastProgress = state.podcastProgress.map(
                        (episode, index) =>
                            index === existingIndex
                                ? {
                                      ...episode,
                                      progress: String(progress),
                                      completed: progress > 99,
                                  }
                                : episode
                    )
                } else {
                    // Add new progress
                    updatedPodcastProgress = [
                        ...state.podcastProgress,
                        {
                            episodeId: String(episodeId),
                            progress: String(progress),
                            completed: progress > 98,
                        },
                    ]
                }

                return {
                    podcastProgress: updatedPodcastProgress,
                }
            })
        } catch (error) {
            console.error('Error saving episode progress:', error)
        }
    },

    setAudioListeners: () => {
        const {
            podcastAudio,
            podcastPlayerInit,
            saveEpisodeProgress,
            isPlayingPodcast,
        } = get()

        if (!podcastPlayerInit) {
            podcastAudio.addEventListener('pause', () => {
                const { podcastDuration, isPlayingPodcast, currentTime, epId } =
                    get()
                if (isPlayingPodcast) {
                    const currentProgress =
                        (currentTime / podcastDuration) * 100

                    saveEpisodeProgress(currentProgress.toFixed(0), epId)
                }
            })
            podcastAudio.addEventListener('ended', () => {
                const { podcastDuration, isPlayingPodcast, currentTime, epId } =
                    get()
                if (isPlayingPodcast) {
                    const currentProgress =
                        (currentTime / podcastDuration) * 100

                    saveEpisodeProgress(currentProgress.toFixed(0), epId)
                }
            })
            // podcastAudio.addEventListener('seeked', () => {
            //     const { podcastDuration, isPlayingPodcast, currentTime, epId } =
            //         get()
            //     if (isPlayingPodcast) {
            //         const currentProgress =
            //             (currentTime / podcastDuration) * 100

            //         saveEpisodeProgress(currentProgress.toFixed(0), epId)
            //     }
            // })
            podcastAudio.addEventListener('stalled', () => {
                const { podcastDuration, isPlayingPodcast, currentTime, epId } =
                    get()
                if (isPlayingPodcast) {
                    const currentProgress =
                        (currentTime / podcastDuration) * 100

                    saveEpisodeProgress(currentProgress.toFixed(0), epId)
                }
            })
            // podcastAudio.addEventListener('timeupdate', () => {
            //     saveEpisodeProgress(currentProgress, epId)
            // })
            // podcastAudio.addEventListener('seeking', () => {
            //     const { podcastDuration, isPlayingPodcast, currentTime, epId } =
            //         get()
            //     if (isPlayingPodcast) {
            //         const currentProgress =
            //             (currentTime / podcastDuration) * 100

            //         saveEpisodeProgress(currentProgress.toFixed(0), epId)
            //     }
            // })
            set({ podcastPlayerInit: true })
        }
    },

    setPodcastVolume: (vol: number) => {
        const { podcastAudio } = get()
        podcastAudio.volume = vol
    },

    // Media Session API setup
    // updateMediaSession: (
    //     type: string,
    //     mediaElement: HTMLAudioElement,
    //     metadata: any
    // ) => {
    //     const { musicKitInstance } = get()
    //     if ('mediaSession' in navigator) {
    //         navigator.mediaSession.metadata = new MediaMetadata({
    //             title: metadata.title,
    //             artist: metadata.artist,
    //             album: metadata.album,
    //             artwork: [
    //                 {
    //                     src: metadata.artUrl,
    //                     sizes: '512x512',
    //                     type: 'image/png',
    //                 },
    //             ],
    //         })

    //         navigator.mediaSession.setActionHandler('play', () => {
    //             set(state => {
    //                 if (type === 'music') {
    //                     musicKitInstance?.play()
    //                 } else if (type === 'podcast') {
    //                     mediaElement.play()
    //                 }
    //                 return {
    //                     isPlaying: type === 'music',
    //                     isPlayingPodcast: type === 'podcast',
    //                 }
    //             })
    //         })

    //         navigator.mediaSession.setActionHandler('pause', () => {
    //             set(state => {
    //                 if (type === 'music') {
    //                     musicKitInstance?.pause()
    //                 } else if (type === 'podcast') {
    //                     mediaElement.pause()
    //                 }
    //                 return { isPlaying: false, isPlayingPodcast: false }
    //             })
    //         })

    //         // Optionally, set other media session actions like 'seekbackward', 'seekforward', etc.
    //     }
    // },

    setPodcastMuted: (toggle: boolean) => set({ podcastMuted: toggle }),
    setCurrentTime: () =>
        set(state => ({ currentTime: state.podcastAudio.currentTime })),

    setScrubPod: (time: number | null) => set({ scrubPod: time }),

    seekPodcast: (time: number) => {
        set(state => {
            state.podcastAudio.currentTime = time
            // state.scrubPod = 0
            return { ...state }
        })
        set({ scrubPod: null })
    },

    playPodcast: async (
        url,
        time,
        artUrl,
        trackName,
        collectionName,
        showId,
        epId
    ) => {
        const {
            musicKitInstance,
            podcastPlayerInit,
            setAudioListeners,

            podcastAudio,
        } = get()

        if (!podcastPlayerInit) {
            setAudioListeners()
        }

        if (musicKitInstance) {
            set({ isPlaying: false })
            musicKitInstance.playbackState !== 0 && musicKitInstance.stop()
        }

        const fetchFinalUrl = async (initialUrl: string) => {
            try {
                const response = await fetch(
                    `https://mus-backend-b262ef3b1b65.herokuapp.com/api/apple/resolve-url?url=${encodeURIComponent(initialUrl)}`
                )
                console.log('response', response)
                const data = await response.json()
                console.log('finalUrlData', data)
                return data.finalUrl
            } catch (error) {
                console.error('Failed to fetch final URL:', error)
                return null
            }
        }

        const finalUrl = await fetchFinalUrl(url)

        const getEpisodeProgress = (episodeId, listenedEpisodes) => {
            const episode = listenedEpisodes.find(
                episode => episode.episodeId === episodeId
            )
            return episode ? episode.progress : 0
        }

        podcastAudio.addEventListener('loadedmetadata', () => {
            const { podcastProgress } = get()

            console.log('podcast progress', podcastProgress)

            const progressPercent = getEpisodeProgress(
                String(epId),
                podcastProgress
            )
            const progress = Number(time) * Number(progressPercent) * 0.01
            console.log('progress', progress)

            Number(progressPercent) < 100
                ? (podcastAudio.currentTime = progress)
                : (podcastAudio.currentTime = 0)
        })

        if ('mediaSession' in navigator) {
            navigator.mediaSession.setActionHandler('play', () => {
                podcastAudio.play()
            })

            navigator.mediaSession.setActionHandler('pause', () => {
                podcastAudio.pause()
            })

            navigator.mediaSession.setActionHandler(
                'previoustrack',
                details => {
                    podcastAudio.currentTime -= 15
                }
            )

            navigator.mediaSession.setActionHandler('nexttrack', details => {
                podcastAudio.currentTime += 15
            })

            // navigator.mediaSession.setActionHandler('nexttrack', () => {
            //     // Implement previous track logic
            // })

            // navigator.mediaSession.setActionHandler('nexttrack', () => {
            //     // Implement next track logic
            // })
        }

        // console.log(url, time, artUrl, trackName, collectionName)
        set(state => {
            if (state.podcastAudio) {
                state.podcastAudio.src = finalUrl
                // state.podcastAudio.onplay = () => {
                //     set({
                //         currentTime: progress,
                //     })
                // }
                state.podcastAudio.ontimeupdate = () => {
                    set({
                        currentTime: state.podcastAudio.currentTime,
                        scrubPod: null,
                        queueToggle: false,
                    })
                }
                state.podcastAudio.play()
            }
            return {
                isPlayingPodcast: true,
                podcastUrl: url,
                currentTime: state.podcastAudio.currentTime,
                podcastDuration: time,
                podcastArtist: collectionName,
                podcastEpTitle: trackName,
                podcastArtUrl: artUrl,
                showId,
                epId,
            }
        })
    },
    pausePodcast: () =>
        set(state => {
            if (state.podcastAudio) {
                state.podcastAudio.pause()
            }
            return { isPlayingPodcast: false }
        }),
    stopPodcast: () =>
        set(state => {
            if (state.podcastAudio) {
                state.podcastAudio.pause()
                // state.podcastAudio.currentTime = 0
            }
            return {
                isPlayingPodcast: false,
                podcastUrl: '',
                // podcastDuration: 0,
                podcastArtist: '',
                podcastEpTitle: '',
                showId: 0,
                podcastArtUrl: '',
            }
        }),

    updatePodcastTime: time => set({ currentPodcastTime: time }),
    setPodcastDuration: duration => set({ podcastDuration: duration }),

    authorizeBackend: async () => {
        try {
            const res = await fetch(
                'https://mus-backend-b262ef3b1b65.herokuapp.com/api/auth/me',
                {
                    credentials: 'include',
                }
            )
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

    setAppleMusicToken: (token: string | null) =>
        set({ appleMusicToken: token }),

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

    setTrackData: (tracks: Song[]) => set({ trackData: tracks }),

    setDarkMode: (toggle: boolean) => set({ darkMode: toggle }),
    setRecentActivity: (
        items: Array<Song | playlist | Album | StationType> | null
    ) => set({ recentActivity: items }),
    setShuffle: () => {
        const { musicKitInstance, shuffle } = get()

        if (musicKitInstance) {
            const MusicKit = (window as any).MusicKit

            if (shuffle === true) {
                musicKitInstance.shuffleMode = MusicKit.PlayerShuffleMode.off
                set({ shuffle: false })
            } else {
                musicKitInstance.shuffleMode = MusicKit.PlayerShuffleMode.songs
                set({ shuffle: true })
            }
        }
    },

    setRepeat: () => {
        const { musicKitInstance, repeat } = get()

        if (musicKitInstance) {
            const MusicKit = (window as any).MusicKit

            if (repeat === 1) {
                musicKitInstance.repeatMode = MusicKit.PlayerRepeatMode.one
                set({ repeat: 2 })
            } else if (repeat === 2) {
                musicKitInstance.repeatMode = MusicKit.PlayerRepeatMode.none
                set({ repeat: 0 })
            } else {
                musicKitInstance.repeatMode = MusicKit.PlayerRepeatMode.all
                set({ repeat: 1 })
            }
        }
    },

    setQueueToggle: () => {
        const { queueToggle } = get()
        if (queueToggle) {
            set({ queueToggle: false })
        } else {
            set({ queueToggle: true })
        }
    },

    setSongData: (songData: Song | null) => set({ songData }),
    setFavouriteSongs: (songs: Array<Song> | null) =>
        set({ favouriteSongs: songs }),
    setPlaylistData: (songs: Song[]) => set({ playlistData: songs }),

    setStationsForYou: (stations: RecommendationType | null) =>
        set({ stationsForYou: stations }),
    setThemedRecommendations: (items: RecommendationType | null) =>
        set({ themedRecommendations: items }),
    setHeavyRotation: (albums: AlbumType[] | null) =>
        set({ heavyRotation: albums }),
    setRecommendations: (albums: AlbumType[] | null) =>
        set({ recommendations: albums }),
    setRecentlyPlayed: (albums: AlbumType[] | null) =>
        set({ recentlyPlayed: albums }),
    setRecentlyAddedToLib: items =>
        set(state => ({
            recentlyAddedToLib:
                typeof items === 'function'
                    ? items(state.recentlyAddedToLib || [])
                    : items,
        })),

    setRecentHistory: songs =>
        set(state => ({
            recentHistory:
                typeof songs === 'function'
                    ? songs(state.recentHistory || [])
                    : songs,
        })),

    setAlbums: (albums: Array<Album> | null) => set({ albums: albums }),
    setMoreLikeRecommendations: (items: RecommendationType | null) =>
        set({ moreLikeRecommendations: items }),

    setGridDisplay: (bool: boolean) => set({ gridDisplay: bool }),
    setSearchResults: (results: SearchResults) =>
        set({ searchResults: results }),

    setLibraryPlaylists: (playlists: Array<playlist> | null) =>
        set({ libraryPlaylists: playlists }),
    setCurrentSongId: async () => {
        const { musicKitInstance } = get()
        if (musicKitInstance) {
            set({ currentSongId: musicKitInstance.nowPlayingItem.id })
        }
    },
    setCurrentVolume: async (volume: number) => {
        const {
            musicKitInstance,
            podcastAudio,
            isPlayingPodcast,
            podcastVolume,
        } = get()
        if (isPlayingPodcast) {
            podcastAudio.muted = false
            set({ podcastVolume: volume })
            podcastAudio.volume = volume
        } else if (musicKitInstance) {
            musicKitInstance.volume = volume
            set({ volume })
        }
    },

    setPersonalizedPlaylists: (
        personalizedPlaylists: RecommendationType | null
    ) => set({ personalizedPlaylists }),

    setAlbumArtUrl: (url: string | null) => set({ albumArtUrl: url }),
    setRecentlyPlayedAlbums: (albums: RecommendationType | null) =>
        set({ recentlyPlayedAlbums: albums }),

    setAlbumData: (album: AlbumTypeObject | null) => set({ albumData: album }),
    setBackendToken: (token: string | null) => set({ backendToken: token }),
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
        const {
            musicKitInstance,
            appleMusicToken,
            backendToken,
            generateAppleToken,
        } = get()

        if (!appleMusicToken && backendToken) {
            try {
                console.log('getting music token from backend')
                // let cookieArr = document.cookie
                // console.log('cookie', cookieArr)
                const res = await fetch(
                    'https://mus-backend-b262ef3b1b65.herokuapp.com/api/apple/get-token',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            userId: backendToken,
                        }),
                        credentials: 'include', // Include credentials in the request
                    }
                )
                console.log('music token retrieval: ', res)

                const { appleMusicToken, tokenExpiryDate } = await res.json()

                if (appleMusicToken === null || tokenExpiryDate === null) {
                    console.log('Apple music token doesnt exist')
                    return
                }

                const now = new Date()

                if (now < new Date(tokenExpiryDate)) {
                    console.log('setting apple music token: ', appleMusicToken)

                    set({ appleMusicToken: appleMusicToken })
                    localStorage.setItem('musicUserToken', appleMusicToken)

                    localStorage.setItem(
                        'music.w5y3b689nm.media-user-token',
                        appleMusicToken
                    )
                    return
                } else {
                    console.log('Token expired')
                    generateAppleToken()
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
            console.log('generating token')
            const music = await (window as any).MusicKit.configure({
                developerToken: import.meta.env.VITE_MUSICKIT_DEVELOPER_TOKEN,
                app: {
                    name: 'AppleMusicDashboard',
                    build: '1.0.0',
                },
            })
            if (music && backendToken && !appleMusicToken) {
                await music.authorize()
                const newToken = music.musicUserToken
                set({ appleMusicToken: newToken })
                localStorage.setItem('musicUserToken', newToken)
                saveToken(newToken, backendToken)
            }
        } catch (error) {
            console.error(error)
        }
    },

    authorizeMusicKit: async () => {
        const {
            appleMusicToken,
            fetchAppleToken,
            isPlayingPodcast,
            podcastAudio,
            stopPodcast,
        } = get()
        console.log('initializing with music token: ', appleMusicToken)

        const initializeMusicKit = async () => {
            if (!appleMusicToken) {
                fetchAppleToken()
            }

            const music = await (window as any).MusicKit.configure({
                developerToken: import.meta.env.VITE_MUSICKIT_DEVELOPER_TOKEN,
                'Music-User-Token': appleMusicToken,
                app: {
                    name: 'AppleMusicDashboard',
                    build: '1.0.0',
                },
            })

            if (music) {
                console.log('adding event listeners...')

                const updateState = async () => {
                    const { playbackState, nowPlayingItem } = music

                    const constructImageUrl = (url: string, size: number) => {
                        return url
                            .replace('{w}', size.toString())
                            .replace('{h}', size.toString())
                    }

                    const isPlaying =
                        playbackState === 2 || 1 || 6 ? true : false
                    const currentSongId = nowPlayingItem?.id
                    const currentSongDuration =
                        nowPlayingItem?.attributes.durationInMillis || null

                    if (
                        nowPlayingItem &&
                        nowPlayingItem.attributes.artwork?.url
                    ) {
                        const displayArt =
                            nowPlayingItem.attributes.artwork?.url
                        if (displayArt) {
                            const displayArtUrl = constructImageUrl(
                                displayArt,
                                100
                            )
                            useStore.setState({ albumArtUrl: displayArtUrl })
                        } else {
                            useStore.setState({ albumArtUrl: null })
                        }
                    } else {
                        useStore.setState({ albumArtUrl: null })
                    }

                    useStore.setState({
                        isPlaying,
                        currentSongId,
                        currentSongDuration,
                        scrubTime: null,
                    })
                }

                // Remove existing listeners to avoid duplicate listeners
                music.removeEventListener('playbackStateDidChange', updateState)
                music.removeEventListener(
                    'nowPlayingItemDidChange',
                    updateState
                )
                music.removeEventListener('playbackTimeDidChange', updateState)
                music.removeEventListener('queueEnded', updateState)

                music.autoplayEnabled = true

                music.addEventListener(
                    'playbackStateDidChange',
                    ({ oldState, state }: any) => {
                        const {
                            saveEpisodeProgress,
                            podcastDuration,
                            isPlayingPodcast,
                            currentTime,
                            queueToggle,
                            queueOpen,
                            epId,
                        } = get()

                        if (!queueOpen) {
                            set({ queueToggle: true, queueOpen: true })
                        }

                        if (isPlayingPodcast) {
                            const currentProgress =
                                (currentTime / podcastDuration) * 100
                            saveEpisodeProgress(
                                currentProgress.toFixed(0),
                                epId
                            )
                            set({ isPlayingPodcast: false })
                            stopPodcast()
                        }

                        console.log(
                            `Changed the playback state from ${oldState} to ${state}`
                        )
                        updateState()
                    }
                )
                music.addEventListener('queueItemsDidChange', () => {
                    // console.log('stopping podcast')

                    if (music) {
                        const currentQueue = music.queue.items
                        set({ playlist: currentQueue })
                    }
                })

                music.addEventListener('playbackTimeDidChange', () => {
                    if (music) {
                        const { playbackState } = music
                        if (playbackState) {
                            const currentElapsedTime =
                                music.currentPlaybackTime * 1000
                            useStore.setState({ currentElapsedTime })
                        }
                    }
                })

                set({ musicKitInstance: music })
                console.log('MusicKit instance: ', music)

                // if (appleMusicToken) {
                //     music.setMusicUserToken(appleMusicToken)
                // } else {
                //     await music.authorize()
                //     const musicUserToken = music.appleMusicToken
                //     localStorage.setItem('musicUserToken', musicUserToken)
                // }
            }
        }

        if (!(window as any).MusicKit) {
            const script = document.createElement('script')
            script.src =
                'https://js-cdn.music.apple.com/musickit/v3/musickit.js'
            script.onload = async () => {
                document.addEventListener('musickitloaded', async () => {
                    console.log('creating musickit')
                    await initializeMusicKit()
                })
            }
            document.body.appendChild(script)
            console.log('MusicKit script loaded')
        } else {
            console.log('musickit instance already exists')
            initializeMusicKit()
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
            let songIds: Array<string> = []

            songs.forEach(song => {
                songIds.push(song.id)
            })

            console.log('setting playlist and start position')
            await musicKitInstance.setQueue({
                songs: songIds,
                startWith: index,
                startPlaying: startPlaying,
            })
        }
        if (startPlaying && musicKitInstance?.nowPlayingItem) {
            set({ isPlaying: true })
        }
        set({ currentSongIndex: index })
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
        const { musicKitInstance, playlist, repeat, shuffle } = get()

        if (musicKitInstance) {
            try {
                if (
                    musicKitInstance.nowPlayingItemIndex ===
                        playlist.length - 1 &&
                    repeat === 0 &&
                    shuffle === false
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
