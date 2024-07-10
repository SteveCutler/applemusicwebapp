import { useParams } from 'react-router-dom'
import useFetchAlbumData from '../components/Apple/FetchAlbumData'
import fetchAlbumCatalogId from '../hooks/AlbumPage/FetchLibraryAlbumCatalogId'
import FetchRelatedAlbums from '../hooks/AlbumPage/FetchRelatedAlbums'
import FetchAppearsOn from '../hooks/AlbumPage/FetchAppearsOn'
import useFetchArtistSimilarArtistsData from '../hooks/ArtistPage/FetchArtistSimilarArtistsData'
import TrackDisplay from '../components/AlbumPage/TrackDisplay'
import { MdArrowBackIosNew } from 'react-icons/md'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useStore } from '../store/store'
import { FaCirclePlay, FaRegCirclePause } from 'react-icons/fa6'
import ScrollToTop from '../components/Homepage/ScrollToTop'
import DisplayRow from '../components/Homepage/DisplayRow'
import AlbumItem from '../components/Homepage/AlbumItem'
import defaultPlaylistArtwork from '../assets/images/defaultPlaylistArtwork.png'
import OptionsModal from '../components/Homepage/OptionsModal'
import ArtistItem from '../components/Homepage/ArtistItem'
import PlaylistItem from '../components/Homepage/PlaylistItem'

type AlbumType = {
    attributes: {
        artistName: string
        artwork: ArtworkObject
        dateAdded: string
        genreNames: Array<string>
        name: string
        releasedDate: string
        trackCount: number
    }
    relationships?: {
        tracks: {
            data: [
                {
                    attributes: {
                        artistName: string
                        artwork: ArtworkObject
                        dateAdded: string
                        genreNames: Array<string>
                        durationInMillis: Number
                        name: string
                        releasedDate: string
                        trackCount: Number
                        playParams: PlayParameterObject
                    }
                },
            ]
        }
        artists?: Array<{
            id: string
        }>
    }
    id: string
}

type PlayParameterObject = {
    catalogId: string
    id: string
    isLibrary: Boolean
    kind: string
}

type ArtworkObject = {
    height: Number
    width: Number
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

const Album = () => {
    const { albumId, type } = useParams<{ albumId: string; type: string }>()

    const { albumData, artistId, loading, error } = useFetchAlbumData(
        albumId,
        type
    )

    // console.log('album data: ', albumData?.relationships?.tracks.data)
    const { relatedAlbums } = FetchRelatedAlbums(albumId)
    const { appearsOn } = FetchAppearsOn(albumId)
    const [similarArtistsData, setSimilarArtistsData] =
        useState<Array<Artist> | null>(null)

    const [featuredAlbumsData, setFeaturedAlbumsData] =
        useState<Array<AlbumType> | null>(null)
    const {
        setSearchTerm,
        musicKitInstance,
        darkMode,
        authorizeMusicKit,
        queueToggle,
        isPlaying,
        playlist,
        setPlaylist,
    } = useStore(state => ({
        setSearchTerm: state.setSearchTerm,
        darkMode: state.darkMode,
        queueToggle: state.queueToggle,
        authorizeMusicKit: state.authorizeMusicKit,
        musicKitInstance: state.musicKitInstance,
        isPlaying: state.isPlaying,
        playlist: state.playlist,
        setPlaylist: state.setPlaylist,
    }))

    useEffect(() => {
        const fetchFeaturedAlbums = async () => {
            if (!musicKitInstance) {
                await authorizeMusicKit()
                return
            }
            if (!artistId) {
                return
            }
            if (type !== 'lib') {
                try {
                    const featuredAlbums = await musicKitInstance.api.music(
                        `/v1/catalog/ca/artists/${artistId}/view/featured-albums`
                    )

                    const featuredAlbumsData: Array<AlbumType> =
                        await featuredAlbums.data.data
                    setFeaturedAlbumsData(featuredAlbumsData)
                } catch (error: any) {
                    console.error(error)
                }
            }
        }

        const fetchSimilarArtist = async () => {
            if (!musicKitInstance) {
                authorizeMusicKit()
                return
            }
            if (!artistId) {
                return
            }

            try {
                const similarArtists = await musicKitInstance.api.music(
                    `/v1/catalog/ca/artists/${artistId}/view/similar-artists`
                )
                console.log('similarArtist: ', similarArtists)

                const similarArtistsData: Array<Artist> =
                    await similarArtists.data.data
                setSimilarArtistsData(similarArtistsData)
            } catch (error: any) {
                console.error(error)
            }
        }

        if (!featuredAlbumsData) {
            fetchFeaturedAlbums()
        }
        if (!similarArtistsData) {
            fetchSimilarArtist()
        }
    }, [artistId, musicKitInstance])

    const constructImageUrl = (url: string, size: number) => {
        return url
            .replace('{w}', size.toString())
            .replace('{h}', size.toString())
    }

    // const setTerm = () => {
    //     setSearchTerm(albumData.attributes.artistName)
    // }

    const loadPlayer = async () => {
        // console.log('track data: ', albumData.relationships.tracks.data)
        if (musicKitInstance) {
            console.log('setting playlist and start position')
            await musicKitInstance.setQueue({
                album: albumData?.id,
                startWith: 0,
                startPlaying: true,
            })
        }
        // await retrieveAlbumTracks()
    }

    const styleButton = { fontSize: '3rem', color: 'dodgerblue ' }

    const style = { fontSize: '1.5em' }
    if (loading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>Error: {error}</div>
    }

    if (!albumData) {
        return <div>No album data available</div>
    }

    if (albumData) {
        return (
            <div
                className={`flex-col w-11/12 mx-auto ${darkMode ? 'text-slate-200' : 'text-slate-800'} h-full`}
            >
                <ScrollToTop />
                {/* <Link to="/">
                    <div className="sticky mb-10 mt-5 top-1 left-1">
                        {' '}
                        <MdArrowBackIosNew style={style} />
                    </div>
                </Link> */}
                <div className="flex-col ">
                    <h1 className="text-3xl w-1/2 font-bold select-none">
                        {albumData.attributes?.name}
                    </h1>
                    {albumData.relationships?.artists?.data[0].id ? (
                        <Link
                            to={
                                type === 'library-albums'
                                    ? `/artist/${albumData.relationships.artists.data[0].id}`
                                    : `/artist/${artistId}`
                            }
                            // onClick={
                            //     type === 'library-albums' ? setTerm : undefined
                            // }
                            className={`text-2xl ${darkMode ? 'text-slate-300 hover:text-slate-500' : 'text-slate-700 hover:text-slate-500'}  select-none hover:cursor-pointer font-bold`}
                        >
                            {albumData.attributes?.artistName}
                        </Link>
                    ) : (
                        <div
                            className={`text-2xl ${darkMode ? 'text-slate-300' : 'text-slate-800'}  select-none font-bold`}
                        >
                            {albumData.attributes?.artistName}
                        </div>
                    )}
                </div>
                <div
                    className={`${queueToggle ? ' flex-col' : 'lg:flex-row flex-col'}   gap-4 flex  justify-around  items-start`}
                >
                    <div
                        className={`relative ${queueToggle ? ' w-1/2' : 'lg:w-1/2 w-full'} h-fit `}
                    >
                        {albumData.attributes?.artwork?.url ? (
                            <img
                                className="w-full"
                                src={constructImageUrl(
                                    albumData.attributes.artwork.url,
                                    500
                                )}
                                alt=""
                            />
                        ) : (
                            <img
                                className="w-full"
                                src={defaultPlaylistArtwork}
                                alt=""
                            />
                        )}
                        <div
                            className=" absolute bottom-5 left-5 hover:cursor-pointer transform    hover:scale-110 active:scale-95 transition-transform duration-100 easy-ease"
                            onClick={async e => {
                                e.preventDefault()
                                e.stopPropagation() // Prevents the link's default behavior
                                // await FetchAlbumData(albumId)
                                // handlePlayPause()

                                await loadPlayer()
                            }}
                        >
                            <FaCirclePlay style={styleButton} />
                        </div>
                        <div className="absolute bottom-4 right-4">
                            <div
                                onClick={e => {
                                    e.preventDefault()
                                    e.stopPropagation() // Prevents the link's default behavior
                                }}
                                className=""
                            >
                                <OptionsModal big={true} object={albumData} />
                            </div>
                        </div>
                    </div>
                    <div
                        className={`${queueToggle ? ' w-full mx-auto' : 'lg:w-1/2 w-full '}  overflow-y-auto  `}
                    >
                        {albumData && (
                            <TrackDisplay
                                albumTracks={
                                    albumData?.relationships?.tracks.data
                                }
                            />
                        )}
                    </div>
                    {/* MAKE TRACK GETTER, ETC. DESIGN PAGE LAYOUT */}
                </div>

                {relatedAlbums && (
                    <h2
                        className={`p-1 pt-5 pb-2 text-xl ${darkMode ? 'text-slate-200' : 'text-slate-800'} font-bold`}
                    >
                        Check out these similar albums:
                    </h2>
                )}
                {relatedAlbums && (
                    <div className="w-full justify-left flex flex-wrap">
                        {relatedAlbums.map(album => (
                            <>
                                <AlbumItem
                                    albumItem={album}
                                    width={
                                        queueToggle
                                            ? ' w-full p-1 pb-2 sm:w-1/2 lg:w-1/3 xl:w-1/4'
                                            : ' w-1/2 p-1 pb-2 sm:w-1/4 md:w-1/5 lg:w-1/6'
                                    }
                                    releaseDate={album.attributes.releaseDate}
                                />
                            </>
                            // <p className="">{album.attributes.name}</p>
                        ))}
                    </div>
                )}

                {/* {relatedAlbums && (
                    <div className="w-full flex  mx-auto overflow-auto">
                        <DisplayRow
                            title={'Similar Albums:'}
                            albums={relatedAlbums}
                        />
                    </div>
                )} */}

                {featuredAlbumsData && (
                    <h2
                        className={`p-1 pt-5 pb-2 text-xl ${darkMode ? 'text-slate-200' : 'text-slate-800'} font-bold`}
                    >
                        Featured albums:
                    </h2>
                )}
                {featuredAlbumsData && (
                    <div className="w-full justify-left flex flex-wrap">
                        {featuredAlbumsData.map(album => (
                            <>
                                <AlbumItem
                                    albumItem={album}
                                    width={
                                        queueToggle
                                            ? ' w-full p-1 pb-2 sm:w-1/2 lg:w-1/3 xl:w-1/4'
                                            : ' w-1/2 p-1 pb-2 sm:w-1/4 md:w-1/5 lg:w-1/6'
                                    }
                                    releaseDate={album.attributes.releaseDate}
                                />
                            </>
                            // <p className="">{album.attributes.name}</p>
                        ))}
                    </div>
                )}

                {similarArtistsData && (
                    <h2
                        className={`p-1 pt-5 pb-2 text-xl ${darkMode ? 'text-slate-200' : 'text-slate-800'} font-bold`}
                    >
                        Similar artists:
                    </h2>
                )}
                {similarArtistsData && (
                    <div className="w-full justify-left flex flex-wrap">
                        {similarArtistsData.map(album => (
                            <>
                                <ArtistItem
                                    artist={album}
                                    width={
                                        queueToggle
                                            ? ' w-full p-1 pb-2 sm:w-1/2 lg:w-1/3 xl:w-1/4'
                                            : ' w-1/2 p-1 pb-2 sm:w-1/4 md:w-1/5 lg:w-1/6'
                                    }
                                />
                            </>
                            // <p className="">{album.attributes.name}</p>
                        ))}
                    </div>
                )}

                {appearsOn && (
                    <h2
                        className={`p-1 pt-5 pb-2 text-xl ${darkMode ? 'text-slate-200' : 'text-slate-800'} font-bold`}
                    >
                        Appears on these playlists:
                    </h2>
                )}
                {appearsOn && (
                    <div className="w-full justify-left flex flex-wrap">
                        {appearsOn.map(album => (
                            <>
                                <PlaylistItem
                                    playlistItem={album}
                                    width={
                                        queueToggle
                                            ? ' w-full p-1 pb-2 sm:w-1/2 lg:w-1/3 xl:w-1/4'
                                            : ' w-1/2 p-1 pb-2 sm:w-1/4 md:w-1/5 lg:w-1/6'
                                    }
                                />
                            </>
                            // <p className="">{album.attributes.name}</p>
                        ))}
                    </div>
                )}
            </div>
        )
    }
}

export default Album
