import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useStore } from '../store/store'
import { GiLoveSong } from 'react-icons/gi'
import AlbumList from '../components/LibraryPage/AlbumList'
import { IoMdRefreshCircle } from 'react-icons/io'
import { IoGridOutline, IoGrid } from 'react-icons/io5'

const Library = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [page, setPage] = useState(1)
    const itemsPerPage = 20

    const {
        authorizeMusicKit,
        gridDisplay,
        setGridDisplay,
        backendToken,
        appleMusicToken,
        musicKitInstance,
        queueToggle,
        fetchAppleToken,
        albums,
        setAlbums,
        darkMode,
    } = useStore(state => ({
        gridDisplay: state.gridDisplay,
        queueToggle: state.queueToggle,
        darkMode: state.darkMode,
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

    const [libSuccess, setLibSuccess] = useState(false)
    const [lib, setLib] = useState(false)
    const [loadingLibraryError, setLoadingLibraryError] = useState<
        boolean | null
    >(null)

    const fetchLibrary = async () => {
        console.log('fetching library...')
        setLoading(true)
        try {
            const res = await fetch(
                'https://mus-backend-b262ef3b1b65.herokuapp.com/api/apple/get-library',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId }),
                    credentials: 'include',
                }
            )
            const data = await res.json()
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
        if (!musicKitInstance) {
            console.log('Initializing MusicKit...')
            await authorizeMusicKit()
            musicKitLoaded = true
        }

        if (!appleMusicToken && musicKitInstance) {
            console.log('fetching Apple token...')
            await fetchAppleToken()
        }
    }

    useEffect(() => {
        if (!albums) {
            fetchLibrary()
        }
        if (!musicKitInstance || !appleMusicToken) {
            initialize()
        }

        if (albums && appleMusicToken) {
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
    }, [
        musicKitInstance,
        appleMusicToken,
        albums,
        librarySearchTerm,
        librarySearchResults,
    ])

    const syncLibrary = async () => {
        setLoading(true)
        try {
            const res = await fetch(
                'https://mus-backend-b262ef3b1b65.herokuapp.com/api/apple/fetch-albums',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, appleMusicToken }),
                    credentials: 'include',
                }
            )

            const data = await res.json()
            setAlbums(data.albums)
            setLoading(false)
            setLibSuccess(true)
        } catch (error) {
            setError('Failed to fetch albums')
            setLoading(false)
            setLoadingLibraryError(true)
        }
    }

    const getSongs = async () => {
        setLoading(true)
        try {
            const res = await fetch(
                'https://mus-backend-b262ef3b1b65.herokuapp.com/api/apple/fetch-songs',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, appleMusicToken }),
                    credentials: 'include',
                }
            )
            const data = await res.json()
            console.log('songs data', data)

            setLoading(false)
        } catch (error) {
            setError('Failed to fetch song ratings')
            setLoading(false)
        }
    }

    const getRatedAlbums = async () => {
        setLoading(true)
        try {
            const res = await fetch(
                'https://mus-backend-b262ef3b1b65.herokuapp.com/api/apple/fetch-album-ratings',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, appleMusicToken }),
                    credentials: 'include',
                }
            )

            console.log('check for rated albums: ', res)
            setLoading(false)
        } catch (error) {
            setError('Failed to fetch song ratings')
            setLoading(false)
        }
    }

    const onChange = (e: any) => {
        setLibrarySearchTerm(e.target.value)
    }

    const toggleGrid = () => {
        setGridDisplay(!gridDisplay)
    }

    const style = { fontSize: '2.5rem' }

    const loadMoreAlbums = useCallback(() => {
        setPage(prevPage => {
            console.log('Loading more albums, new page:', prevPage + 1)
            return prevPage + 1
        })
    }, [])

    useEffect(() => {
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
    }, [librarySearchTerm, albums])

    if (albums && albums.length == 0) {
        return (
            <div className="flex-col flex items-center w-full h-full">
                <button
                    onClick={e => {
                        loading ? e.preventDefault() : e.preventDefault()
                        syncLibrary()
                    }}
                    className={`rounded-full py-2 px-4 ${libSuccess ? 'bg-white text-green-500' : loadingLibraryError ? 'bg-white text-red-500' : loading ? 'hover:cursor-normal bg-blue-500 text-white' : 'hover:bg-blue-600 bg-blue-500 text-white active:scale-95'}  text-md font-bold    btn-info`}
                >
                    {libSuccess
                        ? 'success!'
                        : loadingLibraryError
                          ? 'error'
                          : loading
                            ? 'syncing...'
                            : 'Sync Library'}
                </button>
            </div>
        )
    } else {
        return (
            <div className="flex-col w-full h-full">
                <button onClick={getSongs} className="btn btn-info">
                    Get songs
                </button>
                <div
                    className={`flex justify-between w-11/12 pb-2 ${darkMode ? 'text-white border-white' : 'text-black border-black'} border-b-2 mx-auto items-center gap-2`}
                >
                    <form className="p-3 w-full" action="">
                        <input
                            type="text"
                            value={librarySearchTerm}
                            onChange={e => onChange(e)}
                            ref={inputRef}
                            placeholder="Filter library..."
                            className={`border rounded-full px-4 py-2 ${queueToggle ? 'w-3/3' : 'w-2/3'} text-slate-600 bg-white`}
                        />
                    </form>
                    <div className="flex w-full justify-end pe-3 items-center  gap-1">
                        <span
                            className={`flex justify-right hover:cursor-pointer text-slate-900 hover:text-slate-100 m-1 p-1 gap-1 rounded-lg ${gridDisplay ? 'bg-slate-black' : 'bg-slate-400'}`}
                            onClick={toggleGrid}
                        >
                            {gridDisplay ? (
                                <IoGrid style={style} />
                            ) : (
                                <IoGridOutline style={style} />
                            )}
                        </span>
                    </div>
                </div>
                <div className="flex-col pt-10 justify-center w-full px-3 mx-0 ">
                    {librarySearchResults ? (
                        <AlbumList
                            albums={librarySearchResults.slice(
                                0,
                                page * itemsPerPage
                            )}
                            loadMoreAlbums={loadMoreAlbums}
                        />
                    ) : (
                        <div className="text-black text-center font-bold flex justify-center mx-auto w-full pt-10 text-2xl">
                            Loading library...
                        </div>
                    )}
                    {error && <div>Error</div>}
                </div>
            </div>
        )
    }
}

export default Library
