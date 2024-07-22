import { useEffect, useState } from 'react'
import { useStore } from '../store/store'
import { useParams } from 'react-router-dom'
import useFetchArtistData from '../hooks/ArtistPage/FetchArtistData'
import useFetchArtistAlbumData from '../hooks/ArtistPage/FetchArtistAlbumData'
import useFetchArtistAppearsOnAlbumsData from '../hooks/ArtistPage/FetchArtistAppearsOnAlbumsData'
import useFetchArtistCompilationAlbumsData from '../hooks/ArtistPage/FetchArtistCompilationAlbumsData'
import useFetchArtistFeaturedPlaylistsData from '../hooks/ArtistPage/FetchArtistFeaturedPlaylistsData'
import useFetchArtistLatestReleaseData from '../hooks/ArtistPage/FetchArtistLatestReleaseData'
import useFetchArtistSimilarArtistsData from '../hooks/ArtistPage/FetchArtistSimilarArtistsData'
import useFetchArtistSinglesData from '../hooks/ArtistPage/FetchArtistSinglesData'
import useFetchArtistTopSongsData from '../hooks/ArtistPage/FetchArtistTopSongsData'
import useFetchFeaturedAlbumsData from '../hooks/ArtistPage/FetchFeaturedAlbumsData'
import AlbumItem from '../components/Homepage/AlbumItem'
import ScrollToTop from '../components/Homepage/ScrollToTop'
import SongItem from '../components/Homepage/SongItem'
import DisplayRow from '../components/Homepage/DisplayRow'
import TrackDisplay from '../components/AlbumPage/TrackDisplay'
import defaultPlaylistArtwork from '../assets/images/defaultPlaylistArtwork.png'
import { FaCirclePlay, FaRegCirclePause } from 'react-icons/fa6'
import ArtistItem from '../components/Homepage/ArtistItem'
import PlaylistItem from '../components/Homepage/PlaylistItem'
import ArtistAlbumData from '../hooks/ArtistPage/FetchArtistAlbumData'
import ArtistFeaturedPlaylist from '../hooks/ArtistPage/FetchArtistFeaturedPlaylistsData'
import ArtistTopSongs from '../hooks/ArtistPage/FetchArtistTopSongsData'
import ArtistSimilarArtists from '../hooks/ArtistPage/FetchArtistSimilarArtistsData'
import ArtistLatestRelease from '../hooks/ArtistPage/FetchArtistLatestReleaseData'
import ArtistAppearsOnAlbums from '../hooks/ArtistPage/FetchArtistAppearsOnAlbumsData'
import toast from 'react-hot-toast'
import OptionsModal from '../components/Homepage/OptionsModal'

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
    }
}

type Artist = {
    attributes: {
        editorialNotes?: {
            standard?: string
            short?: string
        }
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

const Artist = () => {
    const {
        musicKitInstance,
        authorizeMusicKit,
        fetchAppleToken,
        appleMusicToken,
        setPlaylist,
        queueToggle,
        darkMode,
        isPlaying,
        playlist,

        pauseSong,
        playSong,
    } = useStore(state => ({
        setPlaylist: state.setPlaylist,

        darkMode: state.darkMode,
        queueToggle: state.queueToggle,
        pauseSong: state.pauseSong,
        playSong: state.playSong,
        isPlaying: state.isPlaying,
        playlist: state.playlist,
        musicKitInstance: state.musicKitInstance,
        authorizeMusicKit: state.authorizeMusicKit,
        fetchAppleToken: state.fetchAppleToken,
        appleMusicToken: state.appleMusicToken,
    }))
    const { id } = useParams<{ id: string }>()
    // const { artistData } = useFetchArtistData(Id)

    const [artistData, setArtistData] = useState<Artist | null>(null)
    const [artistDataLoading, setArtistDataLoading] = useState(false)
    const [artistDataError, setArtistDataError] = useState<string | null>(null)

    useEffect(() => {
        const fetchArtistData = async () => {
            if (!musicKitInstance) {
                authorizeMusicKit()
            }
            if (!musicKitInstance || !id) {
                return
            }
            setArtistDataLoading(true)

            try {
                if (id.startsWith('r')) {
                    try {
                        console.log(`${id} start with 'r'`)
                        const catId = await musicKitInstance.api.music(
                            `/v1/me/library/artists/${id}/catalog`
                        )

                        // const catData = await catId.json()

                        if (catId.response.status === 200) {
                            try {
                                const res = await musicKitInstance.api.music(
                                    `/v1/catalog/${musicKitInstance.storefrontId}/artists/${catId.data.data[0].id}`
                                )

                                const data: Artist = await res.data.data[0]
                                console.log('data', data)
                                setArtistData(data)
                                setArtistDataLoading(false)
                            } catch (error: any) {
                                console.error(error)
                                setArtistDataError(error)
                                setArtistDataLoading(false)
                            } finally {
                                setArtistDataLoading(false)
                            }
                        } else {
                            const res = await musicKitInstance.api.music(
                                `/v1/me/library/artists/${id}`
                            )

                            const data: Artist = await res.data.data[0]

                            setArtistData(data)
                            setArtistDataLoading(false)
                        }
                    } catch (error: any) {
                        console.error(error)
                        setArtistDataError(error)
                        setArtistDataLoading(false)
                    } finally {
                        setArtistDataLoading(false)
                    }
                } else {
                    try {
                        const res = await musicKitInstance.api.music(
                            `/v1/catalog/${musicKitInstance.storefrontId}/artists/${id}`
                        )

                        const data: Artist = await res.data.data[0]
                        console.log('data', data)
                        setArtistData(data)
                    } catch (error: any) {
                        console.error(error)
                        setArtistDataError(error)
                    } finally {
                        setArtistDataLoading(false)
                    }
                }
            } catch (error: any) {
                console.error(error)
                setArtistDataLoading(false)
            } finally {
                setArtistDataLoading(false)
            }
        }

        fetchArtistData()
    }, [musicKitInstance, id])

    // const [artistAlbumData, setArtistAlbumData] = useState(null)
    // console.log('artistData:', artistData)

    // console.log('latestReleaseData', latestReleaseData)
    // console.log('artistData: ', artistData[0])
    // const [topSongs, setTopSongs] = useState<Song[] | null>(null)
    // const [latestRelease, setLatestRelease] = useState<any | null>(null)
    // const { latestReleaseData } = useFetchArtistLatestReleaseData(artistData.id)
    // setLatestRelease(latestReleaseData)
    // const { topSongsData } = useFetchArtistTopSongsData(artistData.id)
    // setTopSongs(topSongsData)

    // const initialize = async () => {
    //     if (!musicKitInstance) {
    //         console.log('Initializing MusicKit...')
    //         authorizeMusicKit()
    //     }

    //     if (!appleMusicToken && musicKitInstance) {
    //         console.log('fetching Apple token...')
    //         fetchAppleToken()
    //     }
    // }

    // useEffect(() => {
    //     if (!musicKitInstance || !appleMusicToken) {
    //         initialize()
    //     }
    //     if (artistData) {
    //         const { artistAlbumData } = useFetchArtistAlbumData(artistData.id)
    //         console.log('artist album data', artistAlbumData)
    //         // setArtistAlbumData(artistAlbumData)
    //         // const { appearsOnAlbumsData } = useFetchArtistAppearsOnAlbumsData(Id)
    //         const { featuredPlaylistsData } =
    //             useFetchArtistFeaturedPlaylistsData(artistData.id)
    //         // const { compilationAlbumsData } = useFetchArtistCompilationAlbumsData(Id)

    //         const { similarArtistsData } = useFetchArtistSimilarArtistsData(
    //             artistData.id
    //         )
    //         // const { singlesData } = useFetchArtistSinglesData(Id)
    //         const { featuredAlbumsData } = useFetchFeaturedAlbumsData(
    //             artistData.id
    //         )
    //     }

    //     if (artistData) {
    //     }
    // }, [musicKitInstance, artistData])

    const constructImageUrl = (url: string, size: number) => {
        return url
            .replace('{w}', size.toString())
            .replace('{h}', size.toString())
    }

    const playTopSongs = async () => {
        if (artistData) {
            try {
                if (id.startsWith('r')) {
                    console.log(`${id} start with 'r'`)
                    try {
                        const topSongs = await musicKitInstance.api.music(
                            `/v1/me/library/artists/${id}/view/top-songs`
                        )

                        const topSongsData: Array<Song> =
                            await topSongs.data.data
                        if (topSongsData) {
                            console.log('top songs', topSongsData)

                            await musicKitInstance.setQueue({
                                items: topSongsData,
                                startPlaying: true,
                            })
                            await musicKitInstance.play()
                        }
                    } catch (error: any) {
                        console.error(error)
                        toast.error('Something went wrong..')
                    }
                } else {
                    try {
                        const topSongs = await musicKitInstance.api.music(
                            `/v1/catalog/${musicKitInstance.storefrontId}/artists/${id}/view/top-songs`
                        )

                        const topSongsData: Array<Song> =
                            await topSongs.data.data

                        if (topSongsData) {
                            console.log('top songs', topSongsData)

                            await musicKitInstance.setQueue({
                                items: topSongsData,
                                startPlaying: true,
                            })
                            await musicKitInstance.play()
                        }
                    } catch (error: any) {
                        console.error(error)
                        toast.error('Something went wrong..')
                    }
                }
            } catch (error: any) {
                console.error(error)
            }
        }
    }

    const styleSmall = { fontSize: '1.6rem', color: 'dodgerblue ' }

    const styleButton = { fontSize: '3rem', color: 'dodgerblue ' }

    if (artistDataLoading) {
        return <div>Loading</div>
    } else if (!artistDataError) {
        return (
            <>
                {artistData && (
                    <div className="m-5 gap-4 p-5 flex-col justify-start pt-0 mt-0 items-start flex h-full w-full">
                        <ScrollToTop />
                        <div className="flex justify-between w-full ">
                            <div className=" flex">
                                <h1
                                    className={`text-5xl font-bold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}
                                >
                                    {artistData.attributes.name}
                                </h1>
                            </div>
                        </div>
                        <div className="md:flex-row  gap-4 flex flex-col justify-around  items-start">
                            <div className="flex-col flex  w-full md:w-1/2 relative ">
                                {artistData.attributes.artwork ? (
                                    <img
                                        className="pb-5 w-full"
                                        src={constructImageUrl(
                                            artistData.attributes.artwork.url,
                                            700
                                        )}
                                    />
                                ) : (
                                    <img
                                        className="pb-5 w-full"
                                        src={defaultPlaylistArtwork}
                                    />
                                )}

                                {artistData && (
                                    <div
                                        title={'Artist radio'}
                                        className=" absolute bottom-6 left-2 hover:cursor-pointer transform    hover:scale-110 active:scale-95 transition-transform duration-100 easy-ease"
                                        onClick={async e => {
                                            e.preventDefault()
                                            e.stopPropagation() // Prevents the link's default behavior
                                            // await FetchAlbumData(albumId)
                                            // handlePlayPause()

                                            await playTopSongs()
                                        }}
                                    >
                                        {' '}
                                        {queueToggle ? (
                                            <FaCirclePlay style={styleSmall} />
                                        ) : (
                                            <FaCirclePlay style={styleButton} />
                                        )}
                                    </div>
                                )}
                                <div
                                    title={'Artist radio'}
                                    className=" absolute bottom-5 right-2 hover:cursor-pointer transform    hover:scale-110 active:scale-95 transition-transform duration-100 easy-ease"
                                    onClick={async e => {
                                        e.preventDefault()
                                        e.stopPropagation() // Prevents the link's default behavior
                                        // await FetchAlbumData(albumId)
                                        // handlePlayPause()

                                        await playTopSongs()
                                    }}
                                >
                                    {queueToggle ? (
                                        <OptionsModal
                                            small={true}
                                            object={artistData}
                                        />
                                    ) : (
                                        <OptionsModal
                                            big={true}
                                            object={artistData}
                                        />
                                    )}
                                </div>
                            </div>

                            <div className="flex-col w-full md:w-1/2">
                                <div
                                    className={` w-full ${darkMode ? 'text-slate-200' : 'text-slate-800'} text-lg font-bold flex justify-start md:justify-end  items-end`}
                                >
                                    {' '}
                                    TOP SONGS
                                </div>
                                <ArtistTopSongs id={artistData.id} />
                            </div>
                        </div>
                        {artistData.attributes.editorialNotes && (
                            <div className="md:flex-row flex-col flex w-full  items-center">
                                <div
                                    className={`  w-full md:w-1/2 pb-5 text-3xl ${darkMode ? 'text-slate-100' : 'text-black'}`}
                                >
                                    {artistData.attributes.editorialNotes
                                        .standard
                                        ? artistData.attributes.editorialNotes
                                              .standard
                                        : artistData.attributes.editorialNotes
                                              .short}
                                </div>
                                <div className="w-full md:w-1/2">
                                    <ArtistLatestRelease id={artistData.id} />
                                </div>
                            </div>
                        )}

                        <ArtistAlbumData id={artistData.id} />

                        <ArtistFeaturedPlaylist id={artistData.id} />

                        <ArtistSimilarArtists id={artistData.id} />
                        <ArtistAppearsOnAlbums id={artistData.id} />
                    </div>
                )}
            </>
        )
    }
}

export default Artist
