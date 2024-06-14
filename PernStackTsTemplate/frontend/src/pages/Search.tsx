import React, { useEffect, useState } from 'react'
import { useStore } from '../store/store'
import axios from 'axios'
import { Link } from 'react-router-dom'

const Search = () => {
    const {
        searchTerm,
        setSearchTerm,
        searchResults,
        setSearchResults,
        authorizeMusicKit,
        musicKitInstance,
    } = useStore(state => ({
        searchTerm: state.searchTerm,
        authorizeMusicKit: state.authorizeMusicKit,
        searchResults: state.searchResults,
        setSearchResults: state.setSearchResults,
        setSearchTerm: state.setSearchTerm,
        musicKitInstance: state.musicKitInstance,
    }))

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const onChange = (e: any) => {
        setSearchTerm(e.target.value)
    }

    const initialize = async () => {
        let musicKitLoaded = false
        if (musicKitLoaded === false) {
            console.log('Initializing MusicKit...')
            await authorizeMusicKit()
            musicKitLoaded = true
        }

        // if (!appleMusicToken && musicKitLoaded) {
        //     console.log('fetching Apple token...')
        //     await fetchAppleToken()
        // }
    }

    useEffect(() => {
        if (!musicKitInstance) {
            initialize()
        }

        const delayDebounceFn = setTimeout(async () => {
            if (searchTerm && musicKitInstance) {
                setLoading(true)

                try {
                    // const term = searchTerm
                    const queryParameters = {
                        term: searchTerm,
                        types: ['albums', 'artists', 'songs'],
                        limit: 25,
                        l: 'en-us',
                    }

                    const response = await musicKitInstance.api.music(
                        `/v1/catalog/us/search`,
                        queryParameters
                    )
                    // console.log(response)

                    // const queryParameters = { l: 'en-us' }

                    const data = await response.data.results
                    console.log(data)
                    setSearchResults(data)
                } catch (error: any) {
                    console.error(error)
                    setError(error)
                } finally {
                    setLoading(false)
                }
            }
        }, 250) // 500ms debounce
        if (searchTerm === '') {
            setSearchResults({})
        }

        return () => clearTimeout(delayDebounceFn)
    }, [searchTerm, musicKitInstance])

    return (
        <div className="w-full flex-col justify-center items-center mx-auto">
            <div className="text-3xl m-3 px-3">SEARCH</div>
            <form className="m-3 p-3" action="">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={e => onChange(e)}
                    placeholder="What do you want to listen to?..."
                    className="border rounded-full px-4 py-2 w-1/2 text-slate-600 bg-white"
                />
            </form>
            <div className="m-3 p-3">
                {searchResults.albums && (
                    <p className="text-center m-2 text-3xl">Albums</p>
                )}
                {searchResults.albums &&
                    searchResults.albums.data.map(album => (
                        <Link
                            to={`/album/${album.id}`}
                            className="flex gap-4 hover:cursor-pointer hover:text-slate-300 justify-between text-center items-center"
                        >
                            <div>{album.attributes.name}</div>
                            <div>{album.attributes.artistName}</div>
                            <div>{album.attributes.trackCount} tracks</div>
                            <div>
                                Released on: {album.attributes.releaseDate}
                            </div>
                        </Link>
                    ))}
            </div>
            <div className="m-3 p-3">
                {searchResults.songs && (
                    <p className="text-center m-2 text-3xl">Songs</p>
                )}
                {searchResults.songs &&
                    searchResults.songs.data.map(song => (
                        <Link
                            to={`/album/${song.id}`}
                            className="flex gap-4 hover:cursor-pointer hover:text-slate-300 justify-between text-center items-center"
                        >
                            <div>{song.attributes.name}</div>
                            <div>{song.attributes.artistName}</div>
                            {/* <div>{song.attributes.trackCount} tracks</div> */}
                            <div>
                                Released on: {song.attributes.releaseDate}
                            </div>
                        </Link>
                    ))}
            </div>
            <div className="m-3 p-3">
                {searchResults.artists && (
                    <p className="text-center text-3xl">Artists</p>
                )}
                {searchResults.artists &&
                    searchResults.artists.data.map(artist => (
                        <Link
                            to={`/album/${artist.id}`}
                            className="flex gap-4 hover:cursor-pointer hover:text-slate-300 justify-between text-center items-center"
                        >
                            <div>{artist.attributes.name}</div>
                            {/* <div>{artist.attributes.artistName}</div> */}
                            {/* <div>{artist.attributes.trackCount} tracks</div> */}
                            {/* <div>
                                Released on: {album.attributes.releaseDate}
                            </div> */}
                        </Link>
                    ))}
            </div>
        </div>
    )
}

export default Search
