import React, { useEffect, useRef, useState } from 'react'
import { useStore } from '../store/store'
import axios from 'axios'
import { Link, useParams } from 'react-router-dom'
import AlbumItem from '../components/Homepage/AlbumItem'
import ArtistItem from '../components/Homepage/ArtistItem'
import SongItem from '../components/Homepage/SongItem'
import PodcastItem from '../components/Homepage/PodcastItem'
// import bcrypt from 'bcrypt'
import CryptoJS from 'crypto-js'
import RecommendationDisplay from '../components/Apple/RecommendationDisplay'
import { useMediaQuery } from 'react-responsive'
import DropdownDisplay from '../components/Apple/DropdownDisplay'

type podcastInfo = {
    artwork: string
    author: string
    categories: {
        [key: number]: string
    }
    contentType: string
    crawlErrors: number
    dead: number
    description: string
    episodeCount: number
    explicit: boolean
    generator: string
    id: number
    image: string
    imageUrlHash: number
    inPollingQueue: number
    itunesId: number
    language: string
    lastCrawlTime: number
    lastGoodHttpStatusTime: number
    lastHttpStatus: number
    lastParseTime: number
    lastUpdateTime: number
    link: string
    locked: number
    medium: string
    newestItemPubdate: number
    originalUrl: string
    ownerName: string
    parseErrors: number
    podcastGuid: string
    priority: number
    title: string
    type: number
    url: string
}

type Artist = {
    attributes: {
        artwork: {
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

const Search = () => {
    const {
        searchTerm,
        setSearchTerm,
        darkMode,
        searchResults,
        queueToggle,
        setSearchResults,
        authorizeMusicKit,
        storefront,
        musicKitInstance,
    } = useStore(state => ({
        searchTerm: state.searchTerm,
        storefront: state.storefront,
        darkMode: state.darkMode,
        queueToggle: state.queueToggle,
        authorizeMusicKit: state.authorizeMusicKit,
        searchResults: state.searchResults,
        setSearchResults: state.setSearchResults,
        setSearchTerm: state.setSearchTerm,
        musicKitInstance: state.musicKitInstance,
    }))

    const [searchFilters, setSearchFilters] = useState<Array<string>>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const onChange = (e: any) => {
        setSearchTerm(e.target.value)
    }

    const isMedium = useMediaQuery({ query: '(min-width: 768px)' })
    const isLarge = useMediaQuery({ query: '(min-width: 1024px)' })
    const isXLarge = useMediaQuery({ query: '(min-width: 1280px)' })
    const is2XLarge = useMediaQuery({ query: '(min-width: 1536px)' })

    let sliceNumber
    if (is2XLarge) {
        sliceNumber =
            searchFilters.length < 2
                ? queueToggle
                    ? 5
                    : 11
                : queueToggle
                  ? 3
                  : 5 // For 2xl screens and larger
    } else if (isXLarge) {
        sliceNumber = queueToggle ? 3 : 5 // For 2xl screens and larger
    } else if (isLarge) {
        sliceNumber = 3 // For xl screens and larger
    } else if (isMedium) {
        sliceNumber = 4 // For md screens and larger
    } else {
        sliceNumber = 2 // For small screens
    }

    const initialize = async () => {
        let musicKitLoaded = false
        if (!musicKitInstance) {
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
                        `/v1/catalog/${storefront}/search`,
                        queryParameters
                    )
                    const musicData = await response.data.results

                    const podcastResponse = await fetch(
                        'https://mus-backend-b262ef3b1b65.herokuapp.com/api/podcast/search',
                        {
                            method: 'POST',
                            headers: {
                                'Content-type': 'application/json',
                            },
                            body: JSON.stringify({
                                term: searchTerm,
                            }),
                            credentials: 'include',
                        }
                    )
                    const podcastData = await podcastResponse.json()

                    const podcasts: podcastInfo[] = podcastData.data.feeds
                    // const data = await podcastResponse.data
                    console.log('podcast response', podcasts)

                    const filteredPodcast = podcasts.filter(
                        podcast =>
                            // podcast.priority > 0 &&
                            // podcast.dead == 0 &&
                            podcast.podcast.parseErrors == 0 &&
                            podcast.locked == 0 &&
                            podcast.crawlErrors == 0 &&
                            podcast.episodeCount >= 1
                    )

                    const sortedFilteredPodcasts = filteredPodcast.sort(
                        (a, b) => b.priority - a.priority
                    )

                    setSearchResults({
                        ...musicData,
                        podcasts: { data: sortedFilteredPodcasts },
                    })
                    // console.log('search data:', searchResults)
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
        <div className="w-full  flex-col h-full overflow-hidden justify-center items-center mx-auto">
            {/* <div className="text-3xl m-3 px-3">SEARCH</div> */}
            <div className="flex justify-between gap-1 items-center">
                <form className="m-3 p-3 w-full" action="">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={e => onChange(e)}
                        ref={inputRef}
                        placeholder="What do you want to listen to?..."
                        className={`border rounded-full px-4 py-2 ${queueToggle ? 'w-3/4' : 'w-1/2'}  text-slate-600 bg-white`}
                    />
                </form>
                <div className="gap-1 flex h-fit pe-5 ">
                    <button
                        className={` border-2 border-white  text-sm active:scale-95 text-white font-bold p-1 px-2 rounded-full ${searchFilters.includes('podcasts') ? 'bg-blue-400' : ''}`}
                        onClick={e => {
                            e.preventDefault()
                            searchFilters.includes('podcasts')
                                ? setSearchFilters(
                                      searchFilters.filter(
                                          item => item != 'podcasts'
                                      )
                                  )
                                : setSearchFilters([
                                      ...searchFilters,
                                      'podcasts',
                                  ])
                        }}
                    >
                        Podcasts
                    </button>
                    <button
                        className={` border-2 border-white  text-sm active:scale-95 text-white font-bold p-1 px-2 rounded-full ${searchFilters.includes('artists') ? 'bg-blue-400' : ''}`}
                        onClick={e => {
                            e.preventDefault()
                            searchFilters.includes('artists')
                                ? setSearchFilters(
                                      searchFilters.filter(
                                          item => item != 'artists'
                                      )
                                  )
                                : setSearchFilters([
                                      ...searchFilters,
                                      'artists',
                                  ])
                        }}
                    >
                        Artists
                    </button>

                    <button
                        className={` border-2 border-white  text-sm active:scale-95 text-white font-bold p-1 px-2 rounded-full ${searchFilters.includes('albums') ? 'bg-blue-400' : ''}`}
                        onClick={e => {
                            e.preventDefault()
                            searchFilters.includes('albums')
                                ? setSearchFilters(
                                      searchFilters.filter(
                                          item => item != 'albums'
                                      )
                                  )
                                : setSearchFilters([...searchFilters, 'albums'])
                        }}
                    >
                        Albums
                    </button>

                    <button
                        className={` border-2 border-white  text-sm active:scale-95 text-white font-bold p-1 px-2 rounded-full ${searchFilters.includes('songs') ? 'bg-blue-400' : ''}`}
                        onClick={e => {
                            e.preventDefault()
                            searchFilters.includes('songs')
                                ? setSearchFilters(
                                      searchFilters.filter(
                                          item => item != 'songs'
                                      )
                                  )
                                : setSearchFilters([...searchFilters, 'songs'])
                        }}
                    >
                        Songs
                    </button>
                </div>
            </div>
            {/*  */}
            <div className="flex flex-wrap w-full justify-center mx-3 px-3">
                <div
                    className={`flex-col w-full ${searchFilters.length < 2 ? '' : '2xl:w-5/12'} mx-3 mb-4 px-3`}
                >
                    {searchResults.podcasts &&
                        searchResults.podcasts.data.length > 0 &&
                        (searchFilters.length == 0 ||
                            searchFilters.includes('podcasts')) && (
                            <DropdownDisplay
                                object={searchResults.podcasts.data}
                                podcastShow={true}
                                sliceNumber={sliceNumber}
                                noTitle={true}
                                title={'Podcasts'}
                                shrink={searchFilters.length < 2}
                            />
                        )}
                </div>

                <div
                    className={`flex-col w-full ${searchFilters.length < 2 ? '' : '2xl:w-5/12'} mx-3 mb-4 px-3`}
                >
                    {searchResults.artists &&
                        (searchFilters.length == 0 ||
                            searchFilters.includes('artists')) && (
                            <DropdownDisplay
                                object={searchResults.artists.data}
                                sliceNumber={sliceNumber}
                                noTitle={true}
                                title={'Artists'}
                                shrink={searchFilters.length < 2}
                            />
                        )}
                </div>
                <div
                    className={`flex-col w-full ${searchFilters.length < 2 ? '' : '2xl:w-5/12'} mx-3 mb-4 px-3`}
                >
                    {searchResults.albums &&
                        (searchFilters.length == 0 ||
                            searchFilters.includes('albums')) && (
                            <DropdownDisplay
                                object={searchResults.albums.data}
                                sliceNumber={sliceNumber}
                                noTitle={true}
                                title={'Albums'}
                                shrink={searchFilters.length < 2}
                            />
                        )}
                </div>
                <div
                    className={`flex-col w-full ${searchFilters.length < 2 ? '' : '2xl:w-5/12'} mx-3 mb-4 px-3`}
                >
                    {searchResults.songs &&
                        (searchFilters.length == 0 ||
                            searchFilters.includes('songs')) && (
                            <DropdownDisplay
                                object={searchResults.songs.data}
                                sliceNumber={sliceNumber}
                                noTitle={true}
                                title={'Songs'}
                                shrink={searchFilters.length < 2}
                            />
                        )}
                </div>
            </div>
        </div>
    )
}

export default Search
