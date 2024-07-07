import React from 'react'
import { useStore } from '../store/store'
import { useNavigate, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { IoMdAddCircleOutline } from 'react-icons/io'
import defaultPlaylistArtwork from '../assets/images/defaultPlaylistArtwork.png'
import { FaCirclePlay } from 'react-icons/fa6'

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

const Favourites = () => {
    const { favouriteSongs, darkMode, musicKitInstance } = useStore(state => ({
        favouriteSongs: state.favouriteSongs,
        darkMode: state.darkMode,
        musicKitInstance: state.musicKitInstance,
    }))
    const [filteredFavs, setFilteredFavs] = useState<Song[] | null>(
        favouriteSongs
    )
    const [searchTerm, setSearchTerm] = useState('')

    const onChange = (e: any) => {
        setSearchTerm(e.target.value)
    }

    const constructImageUrl = (url: String, size: Number) => {
        return url
            .replace('{w}', size.toString())
            .replace('{h}', size.toString())
    }

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchTerm && favouriteSongs) {
                console.log('going')
                const results = favouriteSongs?.filter(song => {
                    const name = song.attributes.name?.toLowerCase() ?? ''
                    const artistName =
                        song.attributes.artistName?.toLowerCase() ?? ''
                    const albumName =
                        song.attributes.albumName?.toLowerCase() ?? ''
                    const search = searchTerm.toLowerCase()

                    return (
                        name.includes(search) ||
                        artistName.includes(search) ||
                        albumName.includes(search)
                    )
                })

                if (results) {
                    setFilteredFavs(results)
                }
            }
        }, 250) // 500ms debounce
        if (searchTerm === '') {
            setFilteredFavs(favouriteSongs)
        }

        return () => clearTimeout(delayDebounceFn)
    }, [searchTerm, favouriteSongs])

    const convertToDuration = (milliseconds: number) => {
        if (typeof milliseconds !== 'number' || milliseconds < 0) {
            return `0:00`
        }

        const totalSeconds = Math.floor(milliseconds / 1000)
        const minutes = Math.floor(totalSeconds / 60)
        const seconds = totalSeconds % 60

        const formattedMinutes = minutes.toString().padStart(2, '0')
        const formattedSeconds = seconds.toString().padStart(2, '0')

        return `${formattedMinutes}:${formattedSeconds}`
    }

    const playPauseHandler = async (index: number) => {
        if (musicKitInstance) {
            if (filteredFavs) {
                const tracks = filteredFavs?.map(song => song.id)
                await musicKitInstance.setQueue({
                    songs: tracks.slice(0, 299),
                    startWith: index,
                    startPlaying: true,
                })
            } else {
                const tracks = favouriteSongs?.map(song => song.id)
                await musicKitInstance.setQueue({
                    songs: tracks?.slice(0, 299),
                    startWith: index,
                    startPlaying: true,
                })
            }
        }
    }

    const styleBlue = { color: 'dodgerblue', fontSize: '2.5rem' }

    return (
        <>
            <h1
                className={`text-center text-5xl ${darkMode ? 'text-slate-200' : 'text-black'}  p-4 font-bold mx-auto`}
            >
                Favourite Songs
            </h1>
            <div className="w-4/5 flex justify-center">
                <form className="m-3 p-3 w-full" action="">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={e => onChange(e)}
                        placeholder="Filter favourites..."
                        className="border rounded-full px-4 py-2 w-1/3 text-slate-600 bg-white"
                    />
                </form>
            </div>
            {/* <button
                className="btn btn-primary my-5 mb-8 bg-blue-500 hover:bg-blue-600  flex justify-center  border-none text-white text-xl font-bold w-fit"
                onClick={e => {
                    e.preventDefault()
                    navigate('/new-playlist')
                }}
            >
                {' '}
            </button> */}
            {filteredFavs ? (
                <div className="w-full flex text-black items-center pb-20 justify-center flex-col">
                    {filteredFavs?.map((song, index) => (
                        <>
                            <Link
                                to={`/song/${song.id}`}
                                state={{
                                    song: {
                                        id: song.id,
                                        href: song.attributes.url,
                                        type: 'songs',
                                        attributes: {
                                            id: song.id,
                                            name: song.attributes.name,
                                            trackNumber:
                                                song.attributes.trackNumber,
                                            artistName:
                                                song.attributes.artistName,
                                            albumName:
                                                song.attributes.albumName,
                                            durationInMillis:
                                                song.attributes
                                                    .durationInMillis,

                                            artwork: {
                                                bgColor:
                                                    song.attributes.artwork
                                                        ?.bgColor,
                                                url: song.attributes.artwork
                                                    ?.url,
                                            },
                                        },
                                    },
                                }}
                                className={`w-4/5 flex bg-slate-900 text-xl justify-between text-white p-3 hover:bg-slate-700 ${filteredFavs ? index === filteredFavs.length - 1 && 'rounded-b-lg' : index === favouriteSongs?.length ? -1 && 'rounded-b-lg' : ''} } ${index === 0 && 'rounded-t-lg'}`}
                            >
                                <div className="flex gap-6 items-center ">
                                    <div className=" flex ">
                                        {song.attributes.artwork?.url ? (
                                            <img
                                                src={constructImageUrl(
                                                    song.attributes.artwork
                                                        ?.url,
                                                    60
                                                )}
                                                style={{ maxWidth: '60px' }}
                                            />
                                        ) : (
                                            <img
                                                src={defaultPlaylistArtwork}
                                                style={{ maxWidth: '60px' }}
                                            />
                                        )}
                                    </div>
                                    <div className="flex-col">
                                        <div className="font-bold">
                                            {song.attributes.name}
                                        </div>
                                        <div>{song.attributes.artistName}</div>
                                        <div>{song.attributes.albumName}</div>
                                    </div>
                                    {/* <div>{song.attributes.ratedAt}</div> */}
                                </div>
                                <div className="flex items-center gap-2 ">
                                    <div>
                                        {convertToDuration(
                                            song.attributes.durationInMillis
                                        )}
                                    </div>

                                    <button
                                        className="transform hover:scale-110 gap-2 items-center  active:scale-95 transition-transform duration-100 easy-ease"
                                        onClick={async e => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            await playPauseHandler(
                                                song.id,
                                                index
                                            )
                                        }}
                                    >
                                        <FaCirclePlay style={styleBlue} />
                                    </button>
                                </div>
                                {/* <Link
                                        to={`/playlist-edit/${playlist.id}`}
                                        state={{ playlist }}
                                        className="btn btn-primary bg-blue-500 border-none hover:cursor-pointer  hover:bg-blue-600"
                                    >
                                        Edit
                                    </Link> */}
                                {/* <button
                                        className="btn btn-primary bg-red-500 border-none hover:cursor-pointer  hover:bg-red-600"
                                        onClick={async e => {
                                            e.preventDefault()
                                            await removePlaylist(playlist.id)
                                        }}
                                    >
                                        Delete
                                    </button> */}
                            </Link>
                        </>
                    ))}
                </div>
            ) : (
                <div className="w-full flex flex-col text-black items-center mx-auto text-lg font-bold">
                    No playlists to display...
                </div>
            )}
        </>
    )
}

export default Favourites
