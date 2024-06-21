import React, { useEffect, useRef, useState } from 'react'
import { useStore } from '../store/store'

import AlbumList from '../components/LibraryPage/AlbumList'
import { IoMdRefreshCircle } from 'react-icons/io'
import { IoGridOutline } from 'react-icons/io5'
import { IoGrid } from 'react-icons/io5'
import e from 'express'

interface Album {
    id: string
    albumId: string
    name: string
    artistName: string
    artworkUrl: string
    trackCount: number
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
                          album.name
                              .toLowerCase()
                              .includes(librarySearchTerm.toLowerCase()) ||
                          album.artistName
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
                'http://localhost:5000/api/apple/update-library',
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
        <div className="flex-col w-11/12  mx-auto h-full">
            <div className=" flex justify-between my-5 pt-5  mx-auto items-center gap-2">
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

                {/* <button onClick={fetchLibrary} className="btn btn-primary">
                    Fetch Library
                </button> */}
                <div className="flex  justify-center items-center gap-4">
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
                </div>
            </div>
            <div className="flex-col pt-10  justify-center mx-auto border-t-2 border-slate-500 w-11/12 ">
                {albums && <AlbumList albums={librarySearchResults} />}

                {loading && <div>Loading...</div>}
                {error && <div>Error</div>}
            </div>
        </div>
    )
}

export default Library
