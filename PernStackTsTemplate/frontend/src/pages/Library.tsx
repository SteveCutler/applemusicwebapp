import React, { useEffect, useState } from 'react'
import { useStore } from '../store/store'
import FetchLibraryAlbums from '../components/Apple/FetchLibraryAlbums'
import AlbumList from '../components/LibraryPage/AlbumList'
import { IoMdRefreshCircle } from 'react-icons/io'
import { IoGridOutline } from 'react-icons/io5'
import { IoGrid } from 'react-icons/io5'

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
            setLoading(false)
        } catch (error) {
            setError('Failed to fetch albums')
            setLoading(false)
        }
    }

    // const authorizeAppleConnection = async () => {
    //     await authorizeMusicKit()
    // }

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
        }
    }, [musicKitInstance, appleMusicToken])

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

    // const { libraryAlbums } = FetchLibraryAlbums()

    // console.log(libraryAlbums)
    const style = { fontSize: '2rem' }

    const toggleGrid = () => {
        if (gridDisplay) {
            setGridDisplay(false)
        } else {
            setGridDisplay(true)
        }
    }
    return (
        <div className="flex-col w-11/12 mx-auto h-full">
            <div className=" flex justify-between my-5 px-5 mx-auto items-center gap-2">
                <span className="text-3xl font-bold"></span>

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
            <div className="flex-col pt-5   border-t-2 border-slate-500 w-full gap-2">
                {albums && <AlbumList />}

                {loading && <div>Loading...</div>}
                {error && <div>Error</div>}
            </div>
        </div>
    )
}

export default Library
