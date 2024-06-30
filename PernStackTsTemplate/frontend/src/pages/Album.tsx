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

type AlbumType = {
    attributes: AttributeObject
    relationships: RelationshipObject
    id: string
}

type AttributeObject = {
    artistName: string
    artwork: ArtworkObject
    dateAdded: string
    genreNames: Array<string>
    name: string
    releasedDate: string
    trackCount: Number
}
type RelationshipObject = {
    tracks: TracksObject
}

type TracksObject = {
    data: Array<Track>
}
type Track = {
    attributes: TrackAttributeObject
}

type TrackAttributeObject = {
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
    console.log(type)

    const { albumData, artistId, loading, error } = useFetchAlbumData(albumId)
    const { relatedAlbums } = FetchRelatedAlbums(albumId)
    const { appearsOn } = FetchAppearsOn(albumId)
    const [similarArtistsData, setSimilarArtistsData] =
        useState<Array<Artist> | null>(null)

    const [featuredAlbumsData, setFeaturedAlbumsData] =
        useState<Array<AlbumType> | null>(null)
    const {
        setSearchTerm,
        musicKitInstance,
        authorizeMusicKit,
        isPlaying,
        playlist,
        setPlaylist,
    } = useStore(state => ({
        setSearchTerm: state.setSearchTerm,
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

            try {
                const featuredAlbums = await musicKitInstance.api.music(
                    `/v1/catalog/us/artists/${artistId}/view/featured-albums`
                )

                const featuredAlbumsData: Array<AlbumType> =
                    await featuredAlbums.data.data
                setFeaturedAlbumsData(featuredAlbumsData)
            } catch (error: any) {
                console.error(error)
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
                    `/v1/catalog/us/artists/${artistId}/view/similar-artists`
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

    // console.log('album data: ', albumData)
    const constructImageUrl = (url: string, size: number) => {
        return url
            .replace('{w}', size.toString())
            .replace('{h}', size.toString())
    }

    const setTerm = () => {
        setSearchTerm(albumData.attributes.artistName)
    }

    const loadPlayer = async () => {
        console.log('track data: ', albumData.relationships.tracks.data)
        setPlaylist(albumData.relationships.tracks.data, 0, true)
        // await retrieveAlbumTracks()
    }

    const styleButton = { fontSize: '3rem', color: 'royalblue ' }

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
            <div className="flex-col w-11/12 mx-auto text-slate-900 h-full">
                <ScrollToTop />
                {/* <Link to="/">
                    <div className="sticky mb-10 mt-5 top-1 left-1">
                        {' '}
                        <MdArrowBackIosNew style={style} />
                    </div>
                </Link> */}
                <div className="flex-col ">
                    <h1 className="text-3xl w-1/2 font-bold">
                        {albumData.attributes.name}
                    </h1>
                    <Link
                        to={
                            type === 'library-albums'
                                ? `/search/`
                                : `/artist/${artistId}`
                        }
                        onClick={
                            type === 'library-albums' ? setTerm : undefined
                        }
                        className="text-2xl hover:text-blue-200 text-slate-800  hover:cursor-pointer font-bold"
                    >
                        {albumData.attributes.artistName}
                    </Link>
                </div>
                <div className="flex w-full justify-between gap-4 py-3  ">
                    <div className="relative h-fit w-fit">
                        <img
                            className=""
                            src={constructImageUrl(
                                albumData.attributes.artwork.url,
                                500
                            )}
                            alt=""
                        />
                        <div
                            className=" absolute bottom-10 right-10 hover:cursor-pointer transform    hover:scale-110 active:scale-95 transition-transform duration-100 easy-ease"
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
                    </div>
                    <div className=" w-1/2">
                        <TrackDisplay
                            albumTracks={albumData.relationships.tracks.data}
                        />
                    </div>
                    {/* MAKE TRACK GETTER, ETC. DESIGN PAGE LAYOUT */}
                </div>

                {relatedAlbums && (
                    <div className="w-full flex  mx-auto overflow-auto">
                        <DisplayRow
                            title={'Similar Albums:'}
                            albums={relatedAlbums}
                        />
                    </div>
                )}
                {featuredAlbumsData && (
                    <div>
                        <DisplayRow
                            title={`More by ${albumData.attributes.artistName}`}
                            albums={featuredAlbumsData}
                            width={'w-full'}
                        />
                    </div>
                )}

                {similarArtistsData && (
                    <div>
                        <DisplayRow
                            title={'Similar Artists:'}
                            albums={similarArtistsData}
                        />
                    </div>
                )}
                {appearsOn && (
                    <div>
                        <DisplayRow title={'Appears On:'} albums={appearsOn} />
                    </div>
                )}
            </div>
        )
    }
}

export default Album
