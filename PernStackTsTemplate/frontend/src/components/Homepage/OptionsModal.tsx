import React, { useState } from 'react'
import { SlOptions } from 'react-icons/sl'
import { useStore } from '../../store/store'
import { toast } from 'react-hot-toast'
import { IoHeartDislikeCircleOutline } from 'react-icons/io5'
import { IoHeartCircleOutline } from 'react-icons/io5'

interface OptionsProps {
    object: Song | AlbumType | playlist | Artist
    small?: boolean
    big?: boolean
}

interface songDetailsObject {
    songId: string
    songName?: string
    artistName?: string
    albumName?: string
    artworkUrl?: string
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
    }
}

type AlbumType = {
    attributes: {
        artistName: String
        artwork?: { height: Number; width: Number; url?: String }
        dateAdded: String
        genreNames: Array<String>
        name: String
        releaseDate: String
        trackCount: Number
    }
    relationships: {
        tracks?: {
            data: Array<Song>
        }
    }
    id: String
    type: string
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

type AlbumRelationships = {
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

const OptionsModal: React.FC<OptionsProps> = ({ object, small, big }) => {
    const style = { fontSize: '1.5rem', color: 'white' }
    const styleDark = { fontSize: '1.5rem', color: 'black' }

    const [isHovered, setIsHovered] = useState(false)

    const {
        musicKitInstance,
        authorizeMusicKit,
        darkMode,
        fetchAppleToken,
        libraryPlaylists,
        appleMusicToken,
        backendToken,
    } = useStore(state => ({
        darkMode: state.darkMode,
        fetchAppleToken: state.fetchAppleToken,
        libraryPlaylists: state.libraryPlaylists,
        authorizeMusicKit: state.authorizeMusicKit,
        backendToken: state.backendToken,
        appleMusicToken: state.appleMusicToken,
        musicKitInstance: state.musicKitInstance,
    }))

    const userId = backendToken
    console.log('object', object)

    const addToLibrary = async (e: React.MouseEvent) => {
        e.stopPropagation()
        if (!musicKitInstance) {
            return
        }
        if (
            object.id.startsWith('l') ||
            object.id.startsWith('i') ||
            (object.id.startsWith('p') && !object.id.startsWith('pl'))
        ) {
            toast.error(`${name} is already in your library!`)
            return
        }
        try {
            const params = { [object.type]: [object.id] }
            const queryParameters = { ids: params }
            const { response } = await musicKitInstance.api.music(
                '/v1/me/library',
                queryParameters,
                { fetchOptions: { method: 'POST' } }
            )

            if ((await response.status) === 202) {
                toast.success(`${name} added to library!`)
                return
            }
        } catch (error) {
            toast.error(`Error adding ${name} to library...`)
            return
        }
    }

    const prepareSongDetails = (songs: Array<Song>) => {
        return songs.map(song => ({
            songId: song.id,
            songName: song.attributes.name,
            artistName: song.attributes.artistName,
            albumName: song.attributes.albumName,
            artworkUrl: song.attributes.artwork?.url,
            catalogId: song.attributes.playParams.catalogId,
        }))
    }

    const addToFavourites = async (songDetails: Array<songDetailsObject>) => {
        console.log('song details: ', songDetails)
        try {
            const res = await fetch(
                'http://localhost:5000/api/apple/add-songs-to-ratings',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId,
                        songDetails,
                    }),
                    credentials: 'include',
                }
            )

            // const data = await res.json();
            console.log(res)
            // setAlbums(data.albums);
        } catch (error) {
            console.log(error)
        }
    }

    const styleSmall = { fontSize: '1rem' }
    const styleBig = { fontSize: '2.3rem' }

    const handleAddToPlaylist = async (id: string, name: string) => {
        if (!musicKitInstance) {
            await authorizeMusicKit()
        }

        if (!appleMusicToken) {
            await fetchAppleToken()
        }

        if (object.type === 'songs' || object.type === 'library-songs') {
            try {
                const response = await fetch(
                    `https://api.music.apple.com/v1/me/library/playlists/${id}/tracks`,
                    {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${
                                import.meta.env.VITE_MUSICKIT_DEVELOPER_TOKEN
                            }`,
                            'Music-User-Token': appleMusicToken ?? '', // Add Music User Token here
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            data: [
                                {
                                    id: object.id, // The unique identifier of the song
                                    type: 'songs', // The type of the resource
                                },
                            ],
                        }),
                    }
                )

                console.log(response)

                if (response.status === 204) {
                    toast.success(`Added to ${name}`)
                }
            } catch (error: any) {
                console.error(error)
                toast.error('An error occurred..')
            }
        } else if (
            object.type === 'albums' ||
            object.type === 'library-albums'
        ) {
            if (object.relationships) {
                try {
                    const tracks = object.relationships.tracks.data.map(
                        (track: Song) => ({
                            id: track.id, // The unique identifier of the song
                            type: 'songs', // The type of the resource
                        })
                    )

                    console.log('tracks:', tracks)

                    const response = await fetch(
                        `https://api.music.apple.com/v1/me/library/playlists/${id}/tracks`,
                        {
                            method: 'POST',
                            headers: {
                                Authorization: `Bearer ${
                                    import.meta.env
                                        .VITE_MUSICKIT_DEVELOPER_TOKEN
                                }`,
                                'Music-User-Token': appleMusicToken ?? '', // Add Music User Token here
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                data: tracks,
                            }),
                        }
                    )

                    console.log(response)

                    if (response.status === 204) {
                        toast.success(`Added to ${name}`)
                    }
                } catch (error: any) {
                    console.error(error)
                    toast.error('An error occurred..')
                }
            } else {
                if (object.id.startsWith('l')) {
                    try {
                        const catRes = await musicKitInstance?.api.music(
                            `v1/me/library/albums/${object.id}/catalog`
                        )

                        const catalogId = await catRes.data.data[0].id

                        const res = await musicKitInstance?.api.music(
                            `/v1/catalog//ca/albums/${catalogId}/tracks`
                        )

                        const trackData = await res.data.data

                        const tracks = trackData.map((track: Song) => ({
                            id: track.id, // The unique identifier of the song
                            type: 'songs', // The type of the resource
                        }))

                        console.log('tracks:', tracks)

                        const response = await fetch(
                            `https://api.music.apple.com/v1/me/library/playlists/${id}/tracks`,
                            {
                                method: 'POST',
                                headers: {
                                    Authorization: `Bearer ${
                                        import.meta.env
                                            .VITE_MUSICKIT_DEVELOPER_TOKEN
                                    }`,
                                    'Music-User-Token': appleMusicToken ?? '', // Add Music User Token here
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    data: tracks,
                                }),
                            }
                        )

                        console.log(response)

                        if (response.status === 204) {
                            toast.success(`Added to ${name}`)
                        }
                    } catch (error: any) {
                        console.error(error)
                        toast.error('An error occurred..')
                    }
                } else {
                    try {
                        const queryParameters = { l: 'en-us' }
                        const res = await musicKitInstance?.api.music(
                            `/v1/catalog//ca/albums/${object.id}/tracks`,

                            queryParameters
                        )

                        console.log(res)

                        const trackData = await res.data.data

                        const tracks = trackData.map((track: Song) => ({
                            id: track.id, // The unique identifier of the song
                            type: 'songs', // The type of the resource
                        }))

                        console.log('tracks:', tracks)

                        const response = await fetch(
                            `https://api.music.apple.com/v1/me/library/playlists/${id}/tracks`,
                            {
                                method: 'POST',
                                headers: {
                                    Authorization: `Bearer ${
                                        import.meta.env
                                            .VITE_MUSICKIT_DEVELOPER_TOKEN
                                    }`,
                                    'Music-User-Token': appleMusicToken ?? '', // Add Music User Token here
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    data: tracks,
                                }),
                            }
                        )

                        console.log(response)

                        if (response.status === 204) {
                            toast.success(`Added to ${name}`)
                        }
                    } catch (error: any) {
                        console.error(error)
                        toast.error('An error occurred..')
                    }
                }
            }
        }
    }

    const addFavorite = async (e: React.MouseEvent) => {
        console.log('song: ', object)
        e.stopPropagation()
        if (!musicKitInstance) {
            return
        }
        if (!appleMusicToken) {
            toast.error('Apple Music Token is missing')
            fetch
            return
        }

        const url = `https://api.music.apple.com/v1/me/ratings/${object.type}/${object.id}`

        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${
                        import.meta.env.VITE_MUSICKIT_DEVELOPER_TOKEN
                    }`,
                    'Music-User-Token': appleMusicToken, // Add Music User Token here
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: 'rating',
                    attributes: {
                        value: 1,
                    },
                }),
            })

            //api.music.apple.com/v1/me/ratings/albums/1138988512

            console.log('response: ', response)

            if (response.status === 200) {
                toast.success(`${name} added to favorites`)
                if (
                    object.type === 'songs' ||
                    object.type === 'library-songs'
                ) {
                    const songData = prepareSongDetails([object])

                    addToFavourites(songData)
                } else if (
                    object.type === 'albums' ||
                    object.type === 'library-albums'
                ) {
                    if (object.id.startsWith('l')) {
                        try {
                            const res = await musicKitInstance.api.music(
                                `/v1/me/library/albums/${object.id}/tracks`
                            )

                            console.log(res)

                            const data: Array<Song> = await res.data.data
                            // let ids: Array<string> = []
                            // data.map(item => ids.push(item.id))
                            const songData = prepareSongDetails(data)

                            addToFavourites(songData)
                            return
                        } catch (error: any) {
                            console.error(error)
                        }
                    } else {
                        try {
                            const queryParameters = { l: 'en-us' }
                            const res = await musicKitInstance.api.music(
                                `/v1/catalog//ca/albums/${object.id}/tracks`,

                                queryParameters
                            )

                            console.log(res)

                            const data: Array<Song> = await res.data.data
                            const songData = prepareSongDetails(data)

                            addToFavourites(songData)
                            return
                        } catch (error: any) {
                            console.error(error)
                        }
                    }
                }
            } else {
                toast.error(`Error adding ${name} to favorites...`)
            }
        } catch (error) {
            toast.error(`Error adding ${name} to favorites...`)
        }
    }

    const addDislike = async (e: React.MouseEvent) => {
        e.stopPropagation()
        if (!musicKitInstance) {
            return
        }
        if (!appleMusicToken) {
            toast.error('Apple Music Token is missing')
            return
        }

        try {
            const response = await fetch(
                `https://api.music.apple.com/v1/me/ratings/${object.type}/${object.id}`,
                {
                    method: 'PUT',

                    headers: {
                        Authorization: `Bearer ${
                            import.meta.env.VITE_MUSICKIT_DEVELOPER_TOKEN
                        }`,
                        'Music-User-Token': appleMusicToken, // Add Music User Token here
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        type: 'rating',
                        attributes: {
                            value: -1,
                        },
                    }),
                }
            )

            //api.music.apple.com/v1/me/ratings/albums/1138988512

            console.log('response: ', response)

            if (response.status === 200) {
                toast.success(`${name} added to dislikes`)
            } else {
                toast.error(`Error adding ${name} to dislikes...`)
            }
        } catch (error) {
            toast.error(`Error adding ${name} to dislikes...`)
        }
    }

    const handleClick = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        e.preventDefault()
        e.stopPropagation() // Prevents the click from propagating to the parent elements

        addToLibrary(e)
        console.log('click')
    }

    return (
        <div
            onClick={async e => {
                e.preventDefault()
                e.stopPropagation() // Prevents the link's default behavior
                // await FetchAlbumData(albumId)
                // handlePlayPause()
            }}
            className={`dropdown ${darkMode ? 'text-slate-900 ' : 'text-white '} relative`}
        >
            <div className="relative z-10">
                <div
                    tabIndex={0}
                    role="button"
                    className="bg-slate-400 transform rounded-full relative justify-right hover:scale-110 active:scale-95 transition-transform duration-100 easy-ease p-1"
                    onClick={async e => {
                        e.preventDefault()
                        e.stopPropagation() // Prevents the link's default behavior
                        // await FetchAlbumData(albumId)
                        // handlePlayPause()
                    }}
                >
                    {small ? (
                        <SlOptions style={styleSmall} />
                    ) : big ? (
                        <SlOptions style={styleBig} />
                    ) : (
                        <SlOptions style={style} />
                    )}
                </div>
            </div>
            <ul
                tabIndex={0}
                className={`dropdown-content ${darkMode ? 'bg-slate-300' : 'bg-slate-800'} fixed z-50 font-bold -right-20 -top-20 menu w-40 p-2 shadow-md rounded-box`}
            >
                <li className="w-full flex justify-between items-center">
                    <a
                        className=" justify-center items-center w-full"
                        onClick={async e => {
                            addFavorite(e)
                            addToLibrary(e)
                        }}
                    >
                        Like{' '}
                        <IoHeartCircleOutline
                            style={darkMode ? styleDark : style}
                        />
                    </a>
                    <a
                        className=" justify-center items-center w-full"
                        onClick={async e => {
                            addDislike(e)
                        }}
                    >
                        Dislike{' '}
                        <IoHeartDislikeCircleOutline
                            style={darkMode ? styleDark : style}
                        />
                    </a>
                </li>
                <li
                    onClick={e => {
                        addToLibrary(e)
                    }}
                    className=" justify-center items-center "
                >
                    <div
                        className={`w-full flex justify-center ${darkMode ? 'text-dark' : 'text-white'} text-center`}
                    >
                        Add to Library
                    </div>
                </li>

                {object.type !== 'playlists' &&
                    object.type !== 'library-playlists' && (
                        <li
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            className="relative justify-center items-center w-full"
                        >
                            <a className="w-full flex justify-center text-center">
                                Add to Playlist
                            </a>

                            <ul
                                className={`absolute left-full overflow-auto -top-20 ${darkMode ? 'bg-slate-300' : 'bg-slate-800'} z-50 max-h-52 font-bold w-40 p-2 shadow-md rounded-box transition-all duration-300 ease-in-out transform ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 '}`}
                            >
                                {libraryPlaylists &&
                                    libraryPlaylists.map(playlist => (
                                        <li
                                            className="relative justify-center items-center w-full"
                                            onClick={e => {
                                                e.preventDefault()
                                                handleAddToPlaylist(
                                                    playlist.id,
                                                    playlist.attributes.name
                                                )
                                            }}
                                        >
                                            <a className="w-full flex justify-center text-center">
                                                {playlist.attributes.name}
                                            </a>
                                        </li>
                                    ))}
                            </ul>
                        </li>
                    )}
            </ul>
        </div>
    )
}

export default OptionsModal
