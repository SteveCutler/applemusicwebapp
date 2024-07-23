import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useStore } from '../store/store'
import { GiLoveSong } from 'react-icons/gi'
import AlbumList from '../components/LibraryPage/AlbumList'
import { IoMdRefreshCircle } from 'react-icons/io'
import { IoGridOutline, IoGrid } from 'react-icons/io5'
import { FaList } from 'react-icons/fa'
import SkeletonDropdownDisplay from '../components/Apple/SkeletonDropdownDisplay'
import { useMediaQuery } from 'react-responsive'
import SkeletonItem from '../components/Homepage/SkeletonItem'
import { HiMiniArrowSmallUp, HiMiniArrowSmallDown } from 'react-icons/hi2'

const Library = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [sorted, setSorted] = useState<string | null>('datedesc')
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

    const isMedium = useMediaQuery({ query: '(min-width: 768px)' })
    const isLarge = useMediaQuery({ query: '(min-width: 1024px)' })
    const isXLarge = useMediaQuery({ query: '(min-width: 1280px)' })
    const is2XLarge = useMediaQuery({ query: '(min-width: 1536px)' })

    let sliceNumber

    if (is2XLarge) {
        sliceNumber = queueToggle ? 9 : 11 // For 2xl screens and larger
    } else if (isXLarge) {
        sliceNumber = queueToggle ? 3 : 5 // For 2xl screens and larger
    } else if (isLarge) {
        sliceNumber = 3 // For xl screens and larger
    } else if (isMedium) {
        sliceNumber = 4 // For md screens and larger
    } else {
        sliceNumber = 2 // For small screens
    }

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

            const sortedAlbums = data.albums.sort(
                (a, b) =>
                    new Date(b.attributes.dateAdded).getTime() -
                    new Date(a.attributes.dateAdded).getTime()
            )
            setAlbums(sortedAlbums)

            setLibrarySearchResults(sortedAlbums)
            setLoading(false)
        } catch (error) {
            setError('Failed to fetch albums')
            setLoading(false)
        }
    }

    const initialize = async () => {
        let musicKitLoaded = false
        if (!musicKitInstance) {
            // console.log('Initializing MusicKit...')
            await authorizeMusicKit()
            musicKitLoaded = true
        }

        if (!appleMusicToken && musicKitInstance) {
            // console.log('fetching Apple token...')
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
    const styleSmall = { fontSize: '2rem' }
    const arrowStyle = { fontSize: '1rem' }

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
                {/* <button onClick={getSongs} className="btn btn-info">
                    Get songs
                </button> */}
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
                            className={`flex justify-right hover:cursor-pointer active:scale-95 m-1 p-1 gap-1 rounded-lg ${darkMode ? 'text-slate-200 hover:text-slate-400' : 'text-slate-900 hover:text-slate-700'}`}
                            onClick={toggleGrid}
                        >
                            {gridDisplay ? (
                                <FaList style={styleSmall} />
                            ) : (
                                <IoGridOutline style={style} />
                            )}
                        </span>
                        {/* <span
                            className={`flex justify-right hover:cursor-pointer text-slate-900 hover:text-slate-100 m-1 p-1 gap-1 rounded-lg ${gridDisplay ? 'bg-slate-black' : 'bg-slate-400'}`}
                            onClick={toggleGrid}
                        >
                            {gridDisplay ? (
                                <IoGrid style={style} />
                            ) : (
                                <IoGridOutline style={style} />
                            )}
                        </span> */}
                    </div>
                </div>
                <div className="flex-col  justify-center w-full px-3 mx-0 ">
                    <div
                        className={`flex w-11/12 py-5 ${darkMode ? 'text-white' : 'text-black'} font-semibold select-none justify-end gap-2`}
                    >
                        <div>Sort by:</div>
                        <button
                            className={` border-2 border-white flex items-center ${sorted && sorted.includes('artist') ? 'bg-blue-400' : ''}  text-sm active:scale-95 text-white font-bold p-1 px-2 rounded-full `}
                            onClick={e => {
                                e.preventDefault()

                                if (
                                    sorted == null ||
                                    !sorted.includes('artist')
                                ) {
                                    setSorted('artistdesc')

                                    const sortedAlbums = albums.sort((a, b) => {
                                        const nameA =
                                            a.attributes.artistName.toUpperCase() // Ignore upper and lowercase
                                        const nameB =
                                            b.attributes.artistName.toUpperCase()
                                        if (nameA < nameB) {
                                            return -1
                                        }
                                        if (nameA > nameB) {
                                            return 1
                                        }
                                        return 0
                                    })
                                    setAlbums(sortedAlbums)
                                } else if (sorted == 'artistdesc') {
                                    setSorted('artistasc')
                                    const sortedAlbums = albums.sort((a, b) => {
                                        const nameA =
                                            a.attributes.artistName.toUpperCase() // Ignore upper and lowercase
                                        const nameB =
                                            b.attributes.artistName.toUpperCase()
                                        if (nameA > nameB) {
                                            return -1
                                        }
                                        if (nameA < nameB) {
                                            return 1
                                        }
                                        return 0
                                    })
                                    setAlbums(sortedAlbums)
                                } else if (sorted == 'artistasc') {
                                    setSorted('artistdesc')
                                    const sortedAlbums = albums.sort((a, b) => {
                                        const nameA =
                                            a.attributes.artistName.toUpperCase() // Ignore upper and lowercase
                                        const nameB =
                                            b.attributes.artistName.toUpperCase()
                                        if (nameA < nameB) {
                                            return -1
                                        }
                                        if (nameA > nameB) {
                                            return 1
                                        }
                                        return 0
                                    })
                                    setAlbums(sortedAlbums)
                                }
                            }}
                        >
                            Artist{' '}
                            {sorted == 'artistasc' && (
                                <HiMiniArrowSmallUp style={arrowStyle} />
                            )}{' '}
                            {sorted == 'artistdesc' && (
                                <HiMiniArrowSmallDown style={arrowStyle} />
                            )}
                        </button>
                        <button
                            className={` border-2 border-white  ${sorted && sorted.includes('albums') ? 'bg-blue-400' : ''}  text-sm active:scale-95 text-white font-bold flex items-center p-1 px-2 rounded-full `}
                            onClick={e => {
                                e.preventDefault()

                                if (
                                    sorted == null ||
                                    !sorted.includes('albums')
                                ) {
                                    setSorted('albumsdesc')
                                    console.log('albums desc')
                                    const sortedAlbums = albums.sort((a, b) => {
                                        const nameA =
                                            a.attributes.name.toUpperCase() // Ignore upper and lowercase
                                        const nameB =
                                            b.attributes.name.toUpperCase()
                                        if (nameA < nameB) {
                                            return -1
                                        }
                                        if (nameA > nameB) {
                                            return 1
                                        }
                                        return 0
                                    })
                                    setAlbums(sortedAlbums)
                                } else if (sorted == 'albumsdesc') {
                                    setSorted('albumsasc')
                                    const sortedAlbums = albums.sort((a, b) => {
                                        const nameA =
                                            a.attributes.name.toUpperCase() // Ignore upper and lowercase
                                        const nameB =
                                            b.attributes.name.toUpperCase()
                                        if (nameA > nameB) {
                                            return -1
                                        }
                                        if (nameA < nameB) {
                                            return 1
                                        }
                                        return 0
                                    })
                                    setAlbums(sortedAlbums)
                                } else if (sorted == 'albumsasc') {
                                    setSorted('albumsdesc')
                                    const sortedAlbums = albums.sort((a, b) => {
                                        const nameA =
                                            a.attributes.name.toUpperCase() // Ignore upper and lowercase
                                        const nameB =
                                            b.attributes.name.toUpperCase()
                                        if (nameA < nameB) {
                                            return -1
                                        }
                                        if (nameA > nameB) {
                                            return 1
                                        }
                                        return 0
                                    })
                                    setAlbums(sortedAlbums)
                                }
                            }}
                        >
                            Album{' '}
                            {sorted == 'albumsasc' && (
                                <HiMiniArrowSmallUp style={arrowStyle} />
                            )}{' '}
                            {sorted == 'albumsdesc' && (
                                <HiMiniArrowSmallDown style={arrowStyle} />
                            )}
                        </button>
                        <button
                            className={` border-2 border-white flex items-center ${sorted && sorted.includes('date') ? 'bg-blue-400' : ''}  text-sm active:scale-95 text-white font-bold p-1 px-2 rounded-full `}
                            onClick={e => {
                                e.preventDefault()

                                if (
                                    sorted == null ||
                                    !sorted.includes('date')
                                ) {
                                    setSorted('datedesc')

                                    const sortedAlbums = albums.sort(
                                        (a, b) =>
                                            new Date(
                                                b.attributes.dateAdded
                                            ).getTime() -
                                            new Date(
                                                a.attributes.dateAdded
                                            ).getTime()
                                    )
                                    setAlbums(sortedAlbums)
                                } else if (sorted == 'datedesc') {
                                    setSorted('dateasc')
                                    const sortedAlbums = albums.sort(
                                        (a, b) =>
                                            new Date(
                                                a.attributes.dateAdded
                                            ).getTime() -
                                            new Date(
                                                b.attributes.dateAdded
                                            ).getTime()
                                    )
                                    setAlbums(sortedAlbums)
                                } else if (sorted == 'dateasc') {
                                    setSorted('datedesc')
                                    const sortedAlbums = albums.sort(
                                        (a, b) =>
                                            new Date(
                                                b.attributes.dateAdded
                                            ).getTime() -
                                            new Date(
                                                a.attributes.dateAdded
                                            ).getTime()
                                    )
                                    setAlbums(sortedAlbums)
                                }
                            }}
                        >
                            Date Added{' '}
                            {sorted == 'dateasc' && (
                                <HiMiniArrowSmallUp style={arrowStyle} />
                            )}{' '}
                            {sorted == 'datedesc' && (
                                <HiMiniArrowSmallDown style={arrowStyle} />
                            )}
                        </button>
                    </div>
                    {librarySearchResults ? (
                        <AlbumList
                            albums={librarySearchResults.slice(
                                0,
                                page * itemsPerPage
                            )}
                            loadMoreAlbums={loadMoreAlbums}
                        />
                    ) : (
                        <div className=" flex w-full flex-wrap px-2 justify-center gap-y-10 mx-auto gap-1">
                            {Array.from({ length: sliceNumber * 2 }).map(
                                (_, index) => (
                                    <SkeletonItem
                                        key={index}
                                        width={` ${
                                            queueToggle
                                                ? 'w-full md:w-5/12 lg:w-3/12 xl:w-3/12'
                                                : 'w-full md:w-5/12 lg:w-3/12 xl:w-2/12 2xl:w-2/12'
                                        } `}
                                    />
                                )
                            )}
                        </div>
                    )}
                    {error && <div>Error</div>}
                </div>
            </div>
        )
    }
}

export default Library
