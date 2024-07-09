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
        musicKitInstance,
    } = useStore(state => ({
        searchTerm: state.searchTerm,
        darkMode: state.darkMode,
        queueToggle: state.queueToggle,
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
                        `/v1/catalog/ca/search`,
                        queryParameters
                    )

                    const musicData = await response.data.results
                    const headerTime = Math.floor(Date.now() / 1000)
                    const hash = CryptoJS.SHA1(
                        import.meta.env.VITE_PODCASTINDEX_KEY +
                            import.meta.env.VITE_PODCASTINDEX_SECRET +
                            headerTime
                    ).toString()

                    const podcastResponse = await axios.get(
                        'https://api.podcastindex.org/api/1.0/search/byterm',
                        {
                            headers: {
                                'User-Agent': 'AppleMusicDashboard/1.0',
                                'X-Auth-Key': import.meta.env
                                    .VITE_PODCASTINDEX_KEY,
                                'X-Auth-Date': headerTime,
                                Authorization: hash,
                            },
                            params: {
                                q: searchTerm,
                            },
                        }
                    )
                    const podcastData: podcastInfo[] =
                        await podcastResponse.data.feeds

                    const filteredPodcast = podcastData.filter(
                        podcast =>
                            podcast.priority > 0 &&
                            podcast.dead == 0 &&
                            podcast.parseErrors == 0 &&
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
                    <p
                        className={`text-left text-2xl ${darkMode ? 'text-slate-300 ' : ' text-slate-800 '} font-bold  mt-7 pb-3 `}
                    >
                        Artists:
                    </p>
                )}
                <div className=" flex flex-wrap w-full justify-start gap-2 ">
                    {searchResults.artists &&
                        searchResults.artists.data.map((artist, index) => (
                            <ArtistItem key={index} artist={artist} />
                        ))}
                </div>
            </div>

            <div className="flex-col mx-3 mb-4 px-3">
                {searchResults.albums && (
                    <p
                        className={`text-left font-bold ${darkMode ? 'text-slate-300 ' : ' text-slate-800 '} mt-7 mb-0 pb-3 text-2xl`}
                    >
                        Albums:
                    </p>
                )}
                <div className=" flex flex-wrap w-full justify-start gap-2 ">
                    {searchResults.albums &&
                        searchResults.albums.data.map((album, index) => (
                            <AlbumItem
                                key={index}
                                albumItem={album}
                                width={` ${queueToggle ? 'w-full md:w-5/12 lg:w-3/12 2xl:w-2/12' : 'w-full md:w-5/12 lg:w-3/12 xl:w-2/12 2xl:w-1/12 '} `}
                            />
                        ))}
                </div>
            </div>
            <div className="flex-col mx-3 mb-4 px-3">
                {searchResults.albums && (
                    <p
                        className={`text-left font-bold ${darkMode ? 'text-slate-300 ' : ' text-slate-800 '} mt-7 pb-3 text-2xl`}
                    >
                        Songs:
                    </p>
                )}
                <div className=" flex flex-wrap w-full justify-start gap-2 ">
                    {searchResults.songs &&
                        searchResults.songs.data.map((song, index) => (
                            <SongItem
                                key={index}
                                song={song}
                                width={` ${queueToggle ? 'w-full md:w-5/12 lg:w-3/12 2xl:w-2/12' : 'w-full md:w-5/12 lg:w-3/12 xl:w-2/12 2xl:w-1/12 '} `}
                            />
                        ))}
                </div>
            </div>

            <div className="flex-col mx-3 mb-4 px-3">
                {searchResults.podcasts && (
                    <p
                        className={`text-left font-bold ${darkMode ? 'text-slate-300' : 'text-slate-800'} mt-7 pb-3 text-2xl`}
                    >
                        Podcasts:
                    </p>
                )}
                <div className="flex flex-wrap w-full justify-start gap-2">
                    {searchResults.podcasts &&
                        searchResults.podcasts.data.map((podcast, index) => (
                            <PodcastItem
                                key={index}
                                podcast={podcast}
                                width={` ${queueToggle ? 'w-full md:w-5/12 lg:w-3/12 2xl:w-2/12' : 'w-full md:w-5/12 lg:w-3/12 xl:w-2/12 2xl:w-1/12 '} `}
                            />
                        ))}
                </div>
            </div>
        </div>
    )
}

export default Search
