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
import ArtistSimilarArtists from '../hooks/ArtistPage/FetchArtistSimilarArtistsData'
import FetchFeaturedAlbums from '../hooks/AlbumPage/FetchFeaturedAlbums'
import FetchRecommendedAlbums from '../hooks/AlbumPage/FetchRecommendedAlbums'

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

type AlbumTypeObject = {
    attributes?: {
        artistName: string
        artwork?: {
            height: number
            width: number
            url: string
        }
        dateAdded: string
        genreNames: Array<string>
        name: string
        releaseDate: string
        trackCount: number
    }
    relationships?: {
        tracks?: TracksObject
        artists?: { data: ArtistObject[] }
    }
    id: string
}

type ArtistObject = {
    id: string
}

type TracksObject = {
    data: Array<Track>
}
type Track = {
    attributes: TrackAttributeObject
}

type TrackAttributeObject = {
    artistName: string
    artwork: {
        height: Number
        width: Number
        url: string
    }
    dateAdded: string
    genreNames: Array<string>
    durationInMillis: Number
    name: string
    releasedDate: string
    trackCount: Number
    playParams: {
        catalogId: string
        id: string
        isLibrary: Boolean
        kind: string
    }
}

const Album = () => {
    const { albumId, type } = useParams<{ albumId: string; type: string }>()

    // const { albumData, artistId, loading, error } = useFetchAlbumData(
    //     albumId,
    //     type
    // )

    const [artistId, setArtistId] = useState<string | null>(null)
    const [albumData, setAlbumData] = useState<AlbumTypeObject | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    // console.log('album data: ', albumData?.relationships?.tracks.data)
    // const { relatedAlbums } = FetchRelatedAlbums(albumId)
    // const { appearsOn } = FetchAppearsOn(albumId)
    // const [similarArtistsData, setSimilarArtistsData] =
    //     useState<Array<Artist> | null>(null)

    // const [featuredAlbumsData, setFeaturedAlbumsData] =
    //     useState<Array<AlbumType> | null>(null)
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
        const fetchAlbumData = async () => {
            if (!musicKitInstance) {
                await authorizeMusicKit()
                return
            }
            if (!musicKitInstance || !albumId) {
                return
            }
            setLoading(true)
            try {
                if (albumId.startsWith('l')) {
                    try {
                        const res = await musicKitInstance.api.music(
                            `/v1/me/library/albums/${albumId}`
                        )
                        const artistRes = await musicKitInstance.api.music(
                            `/v1/me/library/albums/${albumId}/artists`
                        )

                        const artistId = await artistRes.data.data[0].id

                        const data: AlbumTypeObject[] = await res.data.data
                        console.log('album data:', data)
                        setAlbumData(data[0])
                        setArtistId(artistId)
                    } catch (error: any) {
                        console.error(error)
                        setError(error)
                    } finally {
                        setLoading(false)
                    }
                } else {
                    try {
                        const queryParameters = { l: 'en-us' }
                        const res = await musicKitInstance.api.music(
                            `/v1/catalog/${musicKitInstance.storefrontId}/albums/${albumId}`,

                            queryParameters
                        )
                        const artistRes = await musicKitInstance.api.music(
                            `/v1/catalog/${musicKitInstance.storefrontId}/albums/${albumId}/artists`,

                            queryParameters
                        )

                        const artistId = await artistRes.data.data[0].id

                        const data: AlbumTypeObject = await res.data.data[0]

                        console.log('album data: ', data)

                        setAlbumData(data)
                        setArtistId(artistId)
                    } catch (error: any) {
                        console.error(error)
                        setError(error)
                    } finally {
                        setLoading(false)
                    }
                }
            } catch (error: any) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }

        fetchAlbumData()
    }, [albumId, musicKitInstance])

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
        if (musicKitInstance && albumData) {
            if (
                musicKitInstance.nowPlayingItem &&
                musicKitInstance.nowPlayingItem.container &&
                musicKitInstance.nowPlayingItem.container.id == albumData.id
            ) {
                musicKitInstance.playbackState == 2
                    ? await musicKitInstance.pause()
                    : await musicKitInstance.play()
            } else {
                console.log('setting playlist and start position')
                await musicKitInstance.setQueue({
                    album: albumData?.id,
                    startWith: 0,
                    startPlaying: true,
                })
            }
        }
        // await retrieveAlbumTracks()
    }

    const styleButton = { fontSize: '3rem', color: 'dodgerblue ' }
    const styleSmall = { fontSize: '1.6rem', color: 'dodgerblue ' }

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
                    className={`${queueToggle ? ' flex-col' : 'lg:flex-row flex-col'}   gap-4 flex pb-10  justify-around  items-start`}
                >
                    <div
                        className={`relative ${queueToggle ? ' w-1/2' : 'lg:w-1/2 w-full'} h-fit `}
                    >
                        {albumData.attributes?.artwork?.url ? (
                            <img
                                className="w-full"
                                src={constructImageUrl(
                                    albumData.attributes.artwork.url,
                                    1000
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
                            className=" absolute bottom-2 left-2 hover:cursor-pointer transform    hover:scale-110 active:scale-95 transition-transform duration-100 easy-ease"
                            onClick={async e => {
                                e.preventDefault()
                                e.stopPropagation() // Prevents the link's default behavior
                                // await FetchAlbumData(albumId)
                                // handlePlayPause()

                                await loadPlayer()
                            }}
                        >
                            {' '}
                            {musicKitInstance.playbackState == 2 &&
                            musicKitInstance.nowPlayingItem.container &&
                            musicKitInstance.nowPlayingItem.container.id ==
                                albumData.id ? (
                                queueToggle ? (
                                    <FaRegCirclePause style={styleSmall} />
                                ) : (
                                    <FaRegCirclePause style={styleButton} />
                                )
                            ) : queueToggle ? (
                                <FaCirclePlay style={styleSmall} />
                            ) : (
                                <FaCirclePlay style={styleButton} />
                            )}
                        </div>
                        <div className="absolute bottom-1 right-2">
                            <div
                                onClick={e => {
                                    e.preventDefault()
                                    e.stopPropagation() // Prevents the link's default behavior
                                }}
                                className=""
                            >
                                {queueToggle ? (
                                    <OptionsModal
                                        small={true}
                                        object={albumData}
                                    />
                                ) : (
                                    <OptionsModal
                                        big={true}
                                        object={albumData}
                                    />
                                )}
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
                {/* <FetchRecommendedAlbums albumId={albumData.id} /> */}
                <FetchFeaturedAlbums artistId={artistId} type={type} />
                <FetchRelatedAlbums albumId={albumData.id} />

                <ArtistSimilarArtists id={artistId} />
                <FetchAppearsOn albumId={albumData.id} />

                {/* {featuredAlbumsData && (
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
                )} */}

                {/* {similarArtistsData && (
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
                )} */}

                {/* {appearsOn && (
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
                )} */}
            </div>
        )
    }
}

export default Album
