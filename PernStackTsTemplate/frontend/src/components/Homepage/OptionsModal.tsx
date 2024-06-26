import React from 'react'
import { SlOptions } from 'react-icons/sl'
import { useStore } from '../../store/store'
import { toast } from 'react-hot-toast'
import { IoHeartDislikeCircleOutline } from 'react-icons/io5'
import { IoHeartCircleOutline } from 'react-icons/io5'

interface OptionsProps {
    object: Song | AlbumType | playlist | Artist
    footer?: boolean
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

const OptionsModal: React.FC<OptionsProps> = ({ object, footer }) => {
    const style = { fontSize: '1.5rem', color: 'white' }
    const {
        musicKitInstance,
        authorizeMusicKit,
        appleMusicToken,
        backendToken,
    } = useStore(state => ({
        authorizeMusicKit: state.authorizeMusicKit,
        backendToken: state.backendToken,
        appleMusicToken: state.appleMusicToken,
        musicKitInstance: state.musicKitInstance,
    }))

    const userId = backendToken

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

        const url = footer
            ? `https://api.music.apple.com/v1/me/ratings/songs/${object.attributes.id}`
            : `https://api.music.apple.com/v1/me/ratings/${object.type}/${object.id}`

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
                                `/v1/catalog/{{storefrontId}}/albums/${object.id}/tracks`,

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
            className=" dropdown text-white "
        >
            <div
                tabIndex={0}
                role="button"
                className=" bg-slate-400 transform  rounded-full relative z-1000 justify-right hover:scale-110 active:scale-95 transition-transform duration-100 easy-ease p-1"
                onClick={async e => {
                    e.preventDefault()
                    e.stopPropagation() // Prevents the link's default behavior
                    // await FetchAlbumData(albumId)
                    // handlePlayPause()
                }}
            >
                <SlOptions style={style} />
            </div>
            <ul
                tabIndex={0}
                className="dropdown-content relative z-20 font-bold right-4 -bottom-0 menu w-40  p-2 shadow  bg-base-100 rounded-box"
            >
                <li className="w-full flex justify-between items-center">
                    <a
                        className=" justify-center items-center w-full"
                        onClick={async e => {
                            addFavorite(e)
                        }}
                    >
                        Like <IoHeartCircleOutline style={style} />
                    </a>
                    <a
                        className=" justify-center items-center w-full"
                        onClick={async e => {
                            addDislike(e)
                        }}
                    >
                        Dislike <IoHeartDislikeCircleOutline style={style} />
                    </a>
                </li>
                <li
                    onClick={e => {
                        addToLibrary(e)
                    }}
                    className=" justify-center items-center "
                >
                    <div className="w-full flex justify-center text-center">
                        Add to Library
                    </div>
                </li>
                <li
                    onClick={async e => {
                        e.preventDefault()
                        e.stopPropagation() // Prevents the link's default behavior
                        // await FetchAlbumData(albumId)
                        // handlePlayPause()
                        console.log('click')
                    }}
                    className=" justify-center items-center w-full"
                >
                    <a
                        onClick={() => {
                            console.log('click')
                        }}
                        className="w-full flex justify-center text-center"
                    >
                        Add to Playlist
                    </a>
                </li>
            </ul>
        </div>
        // <details className="dropdown rounded-full p-1 bg-slate-400">
        //     <summary>
        //
        //     </summary>
        //     <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
        //         <li>
        //             <a>Item 1</a>
        //         </li>
        //         <li>
        //             <a>Item 2</a>
        //         </li>
        //     </ul>
        // </details>
    )
}

export default OptionsModal
