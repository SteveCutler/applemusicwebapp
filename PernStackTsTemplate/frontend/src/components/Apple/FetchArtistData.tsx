import { useState, useEffect } from 'react'
import useMusicKit from './LoadMusickit'
// import { useMusickitContext } from '../../context/MusickitContext'
import { useStore } from '../../store/store'

type AlbumType = {
    attributes?: AttributeObject
    relationships: RelationshipObject
    id: string
}

type playlist = {
    attributes: {
        canEdit: boolean
        dataAdded: string
        isPublic: boolean
        lastModifiedDate: string
        name: string
        artwork?: {
            url: string
        }
    }
    href: string
    id: string
    type: string
}

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

type AlbumData = {
    attributes: {
        artistName: string
        artwork: {
            bgColor: string
            url: string
        }
        editorialNotes: {
            short: string
            standard: string
        }
        genreName: Array<string>
        name: string
        trackCount: number
        url: string
    }
    href: string
    id: string
    type: string
}

const FetchArtistData = (id: string | undefined) => {
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [artistData, setArtistData] = useState<Artist | null>(null)
    const [artistAlbumData, setArtistAlbumData] =
        useState<Array<AlbumData> | null>(null)
    const [topSongsData, setTopSongsData] = useState<Array<Song> | null>(null)
    const [singlesData, setSinglesData] = useState<Array<Song> | null>(null)
    const [similarArtistsData, setSimilarArtistsData] =
        useState<Array<Artist> | null>(null)
    const [featuredPlaylistsData, setFeaturedPlaylistsData] =
        useState<Array<playlist> | null>(null)
    const [featuredAlbumsData, setFeaturedAlbumsData] =
        useState<Array<AlbumData> | null>(null)
    const [appearsOnAlbumsData, setAppearsOnAlbumsData] =
        useState<Array<AlbumData> | null>(null)
    const [compilationAlbumsData, setCompilationAlbumsData] =
        useState<Array<AlbumData> | null>(null)
    const [fullAlbumsData, setFullAlbumsData] =
        useState<Array<AlbumData> | null>(null)
    const [latestReleaseData, setLatestReleaseData] =
        useState<Array<AlbumData> | null>(null)

    // const musicKitLoaded = useMusicKit()
    const { musicKitInstance, authorizeMusicKit } = useStore(state => ({
        musicKitInstance: state.musicKitInstance,
        authorizeMusicKit: state.authorizeMusicKit,
        albumData: state.albumData,
        setAlbumData: state.setAlbumData,
    }))

    // const musicKitInstance = useStore(state => state.musicKitInstance)
    // const authorizeMusicKit = useStore(state => state.authorizeMusicKit)

    useEffect(() => {
        const fetchArtistData = async () => {
            if (!musicKitInstance) {
                await authorizeMusicKit()
                return
            }
            if (!musicKitInstance || !id) {
                return
            }

            try {
                if (id.startsWith('r')) {
                    console.log(`${id} start with 'r'`)
                    try {
                        const res = await musicKitInstance.api.music(
                            `/v1/me/library/artists/${id}`
                        )
                        const albumRes = await musicKitInstance.api.music(
                            `/v1/me/library/artists/${id}/albums`
                        )

                        const data: Artist = await res.data.data[0]
                        const albumData: Array<AlbumData> =
                            await albumRes.data.data
                        console.log('artist album data: ', albumData)
                        setArtistAlbumData(albumData)

                        setArtistData(data)
                    } catch (error: any) {
                        console.error(error)
                        setError(error)
                    } finally {
                        setLoading(false)
                    }
                } else {
                    try {
                        const res = await musicKitInstance.api.music(
                            `/v1/catalog/us/artists/${id}`
                        )
                        const albumRes = await musicKitInstance.api.music(
                            `/v1/catalog/us/artists/${id}/albums`
                        )
                        const topSongs = await musicKitInstance.api.music(
                            `/v1/catalog/us/artists/${id}/view/top-songs`
                        )
                        const singles = await musicKitInstance.api.music(
                            `/v1/catalog/us/artists/${id}/view/singles`
                        )
                        const similarArtists = await musicKitInstance.api.music(
                            `/v1/catalog/us/artists/${id}/view/similar-artists`
                        )
                        const featuredPlaylists =
                            await musicKitInstance.api.music(
                                `/v1/catalog/us/artists/${id}/view/featured-playlists`
                            )
                        const featuredAlbums = await musicKitInstance.api.music(
                            `/v1/catalog/us/artists/${id}/view/featured-albums`
                        )
                        const appearsOnAlbums =
                            await musicKitInstance.api.music(
                                `/v1/catalog/us/artists/${id}/view/appears-on-albums`
                            )
                        const compilationAlbums =
                            await musicKitInstance.api.music(
                                `/v1/catalog/us/artists/${id}/view/compilation-albums`
                            )
                        const fullAlbums = await musicKitInstance.api.music(
                            `/v1/catalog/us/artists/${id}/view/full-albums`
                        )
                        const latestRelease = await musicKitInstance.api.music(
                            `/v1/catalog/us/artists/${id}/view/latest-release`
                        )

                        const data: Artist = await res.data.data[0]

                        const albumData: Array<AlbumData> =
                            await albumRes.data.data

                        if (topSongs.response.status == 200) {
                            const topSongsData: Array<Song> =
                                await topSongs.data.data
                            setTopSongsData(topSongsData)
                        }

                        if (singles.response.status == 200) {
                            const singlesData: Array<Song> =
                                await singles.data.data
                            setSinglesData(singlesData)
                        }

                        if (similarArtists.response.status == 200) {
                            const similarArtistsData: Array<Artist> =
                                await similarArtists.data.data
                            setSimilarArtistsData(similarArtistsData)
                        }
                        if (featuredPlaylists.response.status == 200) {
                            const featuredPlaylistsData: Array<playlist> =
                                await featuredPlaylists.data.data
                            setFeaturedPlaylistsData(featuredPlaylistsData)
                        }
                        if (featuredAlbums.response.status == 200) {
                            const featuredAlbumsData: Array<AlbumData> =
                                await featuredAlbums.data.data
                            setFeaturedAlbumsData(featuredAlbumsData)
                        }
                        if (appearsOnAlbums.response.status == 200) {
                            const appearsOnAlbumsData: Array<AlbumData> =
                                await appearsOnAlbums.data.data
                            setAppearsOnAlbumsData(appearsOnAlbumsData)
                        }
                        if (compilationAlbums.response.status == 200) {
                            const compilationAlbumsData: Array<AlbumData> =
                                await compilationAlbums.data.data
                            setCompilationAlbumsData(compilationAlbumsData)
                        }
                        if (fullAlbums.response.status == 200) {
                            const fullAlbumsData: Array<AlbumData> =
                                await fullAlbums.data.data
                            setFullAlbumsData(fullAlbumsData)
                        }
                        if (latestRelease.response.status == 200) {
                            const latestReleaseData: Array<AlbumData> =
                                await latestRelease.data.data
                            setLatestReleaseData(latestReleaseData)
                        }

                        setArtistAlbumData(albumData)

                        setArtistData(data)
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

        fetchArtistData()
    }, [musicKitInstance, id, authorizeMusicKit])

    return {
        artistData,
        artistAlbumData,
        topSongsData,
        singlesData,
        similarArtistsData,
        featuredPlaylistsData,
        featuredAlbumsData,
        appearsOnAlbumsData,
        compilationAlbumsData,
        fullAlbumsData,
        latestReleaseData,
        loading,
        error,
    }
}

export default FetchArtistData
