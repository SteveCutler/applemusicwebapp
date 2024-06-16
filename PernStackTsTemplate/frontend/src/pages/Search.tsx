import React, { useEffect, useRef, useState } from 'react'
import { useStore } from '../store/store'
import axios from 'axios'
import { Link, useParams } from 'react-router-dom'
import AlbumItem from '../components/Homepage/AlbumItem'
import ArtistItem from '../components/Homepage/ArtistItem'
import SongItem from '../components/Homepage/SongItem'

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
    const inputRef = useRef<HTMLInputElement>(null)

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
        if (inputRef.current) {
            inputRef.current.focus()
        }

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
        <div className="w-screen flex-col h-full justify-center items-center mx-auto">
            {/* <div className="text-3xl m-3 px-3">SEARCH</div> */}
            <form className="m-3 p-3 w-full" action="">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={e => onChange(e)}
                    ref={inputRef}
                    placeholder="What do you want to listen to?..."
                    className="border rounded-full px-4 py-2 w-1/3 text-slate-600 bg-white"
                />
            </form>
            {/*  */}
            <div className="flex-col mx-3 px-3">
                {searchResults.artists && (
                    <p className="text-left font-bold  mt-7 pb-3 text-3xl">
                        Artists:
                    </p>
                )}
                <div className=" flex flex-wrap w-full justify-start gap-2 ">
                    {searchResults.artists &&
                        searchResults.artists.data.map(artist => (
                            <ArtistItem
                                title={artist.attributes.name}
                                artUrl={artist.attributes.artwork?.url}
                                artistId={artist.id}
                            />
                        ))}
                </div>
            </div>

            <div className="flex-col mx-3 mb-4 px-3">
                {searchResults.albums && (
                    <p className="text-left font-bold  mt-7 mb-0 pb-3 text-3xl">
                        Albums:
                    </p>
                )}
                <div className=" flex flex-wrap w-full justify-start gap-2 ">
                    {searchResults.albums &&
                        searchResults.albums.data.map(album => (
                            <AlbumItem
                                title={album.attributes.name}
                                artistName={album.attributes.artistName}
                                albumId={album.id}
                                type={album.type}
                                albumArtUrl={album.attributes.artwork.url}
                            />
                        ))}
                </div>
            </div>
            <div className="flex-col mx-3 mb-4 px-3">
                {searchResults.albums && (
                    <p className="text-left font-bold  mt-7 pb-3 text-3xl">
                        Songs:
                    </p>
                )}
                <div className=" flex flex-wrap w-full justify-start gap-2 ">
                    {searchResults.songs &&
                        searchResults.songs.data.map(song => (
                            <SongItem song={song} />
                        ))}
                </div>
            </div>
        </div>
    )
}

export default Search
