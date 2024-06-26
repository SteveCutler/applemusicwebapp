import React, { useEffect, useRef, useState } from 'react'
import { useStore } from '../store/store'
import { GiLoveSong } from 'react-icons/gi'

import AlbumList from '../components/LibraryPage/AlbumList'
import { IoMdRefreshCircle } from 'react-icons/io'
import { IoGridOutline } from 'react-icons/io5'
import { IoGrid } from 'react-icons/io5'
import e from 'express'

interface Album {
    attributes: {
        artistName?: string
        artwork?: { height: number; width: number; url?: string }
        dateAdded?: string
        genreNames?: Array<string>
        name?: string
        releaseDate?: string
        trackCount?: number
    }
    id: string
    type: string
}

const Library = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const {
        authorizeMusicKit,
        gridDisplay,
        setGridDisplay,
        backendToken,
        appleMusicToken,
        musicKitInstance,
        fetchAppleToken,
        albums,
        setAlbums,
    } = useStore(state => ({
        gridDisplay: state.gridDisplay,
        setGridDisplay: state.setGridDisplay,
        authorizeMusicKit: state.authorizeMusicKit,
        fetchAppleToken: state.fetchAppleToken,
        musicKitInstance: state.musicKitInstance,
        backendToken: state.backendToken,
        appleMusicToken: state.appleMusicToken,
        albums: state.albums,
        setAlbums: state.setAlbums,
    }))

    const inputRef = useRef<HTMLInputElement>(null)
    const [librarySearchTerm, setLibrarySearchTerm] = useState('')
    const [librarySearchResults, setLibrarySearchResults] = useState<
        Album[] | null
    >(albums)

    const userId = backendToken

    const fetchLibrary = async () => {
        console.log('fetching library...')
        setLoading(true)
        try {
            const res = await fetch(
                'http://localhost:5000/api/apple/get-library',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId,
                    }),
                    credentials: 'include',
                }
            )
            console.log(res)

            const data = await res.json()
            // console.log(data)
            setAlbums(data.albums)
            setLibrarySearchResults(data.albums)
            setLoading(false)
        } catch (error) {
            setError('Failed to fetch albums')
            setLoading(false)
        }
    }

    const initialize = async () => {
        let musicKitLoaded = false
        if (musicKitLoaded === false) {
            console.log('Initializing MusicKit...')
            await authorizeMusicKit()
            musicKitLoaded = true
        }

        if (!appleMusicToken && musicKitLoaded) {
            console.log('fetching Apple token...')
            await fetchAppleToken()
        }
    }

    useEffect(() => {
        if (!musicKitInstance || !appleMusicToken) {
            initialize()
        }

        if (!albums && appleMusicToken) {
            fetchLibrary()
        } else {
            setLibrarySearchResults(albums)
        }

        if (librarySearchTerm === '') {
            setLibrarySearchResults(albums)
        } else {
            const searchResults: Album[] | null = albums
                ? albums.filter(
                      album =>
                          album.attributes.name
                              .toLowerCase()
                              .includes(librarySearchTerm.toLowerCase()) ||
                          album.attributes.artistName
                              .toLowerCase()
                              .includes(librarySearchTerm.toLowerCase())
                  )
                : null
            setLibrarySearchResults(searchResults)
        }
    }, [musicKitInstance, appleMusicToken, librarySearchTerm])

    const updateLibrary = async () => {
        setLoading(true)
        try {
            const res = await fetch(
                'http://localhost:5000/api/apple/fetch-albums',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId,
                        appleMusicToken,
                    }),
                    credentials: 'include',
                }
            )

            const data = await res.json()
            // console.log(data)
            setAlbums(data.albums)
            setLoading(false)
        } catch (error) {
            setError('Failed to fetch albums')
            setLoading(false)
        }

        if (albums === null) {
            fetchLibrary()
        }
    }

    const getRatedSongs = async () => {
        setLoading(true)
        try {
            const res = await fetch(
                'http://localhost:5000/api/apple/fetch-song-ratings',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId,
                        appleMusicToken,
                    }),
                    credentials: 'include',
                }
            )

            // const data = await res.json()
            // console.log(data)
            // setAlbums(data.albums)
            setLoading(false)
        } catch (error) {
            setError('Failed to fetch song ratings')
            setLoading(false)
        }

        // if (albums === null) {
        //     fetchLibrary()
        // }
    }
    const getSongs = async () => {
        setLoading(true)
        try {
            const res = await fetch(
                'http://localhost:5000/api/apple/fetch-songs',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId,
                        appleMusicToken,
                    }),
                    credentials: 'include',
                }
            )

            // const data = await res.json()
            // console.log(data)
            // setAlbums(data.albums)
            setLoading(false)
        } catch (error) {
            setError('Failed to fetch song ratings')
            setLoading(false)
        }

        // if (albums === null) {
        //     fetchLibrary()
        // }
    }
    const getRatedAlbums = async () => {
        setLoading(true)
        try {
            const res = await fetch(
                'http://localhost:5000/api/apple/fetch-album-ratings',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId,
                        appleMusicToken,
                    }),
                    credentials: 'include',
                }
            )

            // const data = await res.json()
            console.log('check for rated albums: ', res)
            // setAlbums(data.albums)
            setLoading(false)
        } catch (error) {
            setError('Failed to fetch song ratings')
            setLoading(false)
        }

        // if (albums === null) {
        //     fetchLibrary()
        // }
    }

    const onChange = (e: any) => {
        setLibrarySearchTerm(e.target.value)
    }

    const toggleGrid = () => {
        if (gridDisplay) {
            setGridDisplay(false)
        } else {
            setGridDisplay(true)
        }
    }

    const style = { fontSize: '2rem' }

    return (
        <div className="flex-col w-full  mx-auto h-full">
            <div className=" flex justify-between   mx-auto items-center gap-2">
                <form className=" p-3 w-full" action="">
                    <input
                        type="text"
                        value={librarySearchTerm}
                        onChange={e => onChange(e)}
                        ref={inputRef}
                        placeholder="Filter library..."
                        className="border rounded-full px-4 py-2 w-1/3 text-slate-600 bg-white"
                    />
                </form>
                {loading && (
                    <div className="text-black text-center rounded-lg p-1 w-full justify-center font-bold flex">
                        Syncing library...
                    </div>
                )}

                {/* <button onClick={fetchLibrary} className="btn btn-primary">
                    Fetch Library
                </button> */}
                <div className="flex  justify-center items-center pe-3 gap-1">
                    <span
                        className={`flex justify-right hover:cursor-pointer text-slate-300 hover:text-slate-100 p-2 rounded-lg ${gridDisplay && 'bg-slate-500'}`}
                        onClick={toggleGrid}
                    >
                        {gridDisplay ? (
                            <IoGrid style={style} />
                        ) : (
                            <IoGridOutline style={style} />
                        )}
                    </span>

                    <button
                        disabled={loading}
                        onClick={updateLibrary}
                        className=" btn btn-primary rounded-full"
                        title="Refresh library"
                    >
                        <IoMdRefreshCircle style={style} />
                    </button>
                    {/* <button
                        disabled={loading}
                        onClick={getRatedSongs}
                        className=" btn btn-primary rounded-full"
                        title="Check for Song ratings"
                    >
                        <GiLoveSong style={style} />
                    </button>
                    <button
                        disabled={loading}
                        onClick={getRatedAlbums}
                        className=" btn btn-primary rounded-full"
                        title="Check for Song ratings"
                    >
                        <GiLoveSong style={style} />
                    </button>
                    <button
                        disabled={loading}
                        onClick={getSongs}
                        className=" btn btn-primary rounded-full"
                        title="Retrieve songs from library"
                    >
                        <GiLoveSong style={style} />
                    </button> */}
                </div>
            </div>
            <div className="flex-col pt-10  justify-center px-x mx-0 border-t-2 border-slate-500 w-full ">
                {librarySearchResults && (
                    <AlbumList albums={librarySearchResults.slice(0, 30)} />
                )}

                {error && <div>Error</div>}
            </div>
        </div>
    )
}

export default Library
