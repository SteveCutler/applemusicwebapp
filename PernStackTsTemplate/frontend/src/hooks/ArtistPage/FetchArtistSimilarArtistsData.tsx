import { useState, useEffect } from 'react'
import useMusicKit from '../../components/Apple/LoadMusickit'
// import { useMusickitContext } from '../../context/MusickitContext'
import { useStore } from '../../store/store'
import ArtistItem from '../../components/Homepage/ArtistItem'
import { useMediaQuery } from 'react-responsive'
import DropdownDisplay from '../../components/Apple/DropdownDisplay'

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

const ArtistSimilarArtists = ({ id }) => {
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    const [similarArtistsData, setSimilarArtistsData] =
        useState<Array<Artist> | null>(null)

    // const musicKitLoaded = useMusicKit()
    const {
        musicKitInstance,
        authorizeMusicKit,
        storefront,
        darkMode,
        queueToggle,
    } = useStore(state => ({
        musicKitInstance: state.musicKitInstance,
        storefront: state.storefront,
        darkMode: state.darkMode,
        queueToggle: state.queueToggle,
        authorizeMusicKit: state.authorizeMusicKit,
        albumData: state.albumData,
        setAlbumData: state.setAlbumData,
    }))

    const isMedium = useMediaQuery({ query: '(min-width: 768px)' })
    const isLarge = useMediaQuery({ query: '(min-width: 1024px)' })
    const isXLarge = useMediaQuery({ query: '(min-width: 1280px)' })
    const is2XLarge = useMediaQuery({ query: '(min-width: 1536px)' })

    let sliceNumber

    if (is2XLarge) {
        sliceNumber = queueToggle ? 9 : 11 // For 2xl screens and larger
    } else if (isXLarge) {
        sliceNumber = queueToggle ? 3 : 5 // For 2xl screens and larger
    } else if (isLarge) {
        sliceNumber = 3 // For xl screens and larger
    } else if (isMedium) {
        sliceNumber = 4 // For md screens and larger
    } else {
        sliceNumber = 2 // For small screens
    }

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
                        const similarArtists = await musicKitInstance.api.music(
                            `/v1/me/library/artists/${id}/view/similar-artists`
                        )

                        const similarArtistsData: Array<Artist> =
                            await similarArtists.data.data
                        setSimilarArtistsData(similarArtistsData)
                    } catch (error: any) {
                        console.error(error)
                        setError(error)
                    } finally {
                        setLoading(false)
                    }
                } else {
                    try {
                        const similarArtists = await musicKitInstance.api.music(
                            `/v1/catalog/${storefront}/artists/${id}/view/similar-artists`
                        )

                        const similarArtistsData: Array<Artist> =
                            await similarArtists.data.data
                        setSimilarArtistsData(similarArtistsData)
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

    return (
        similarArtistsData && (
            <div className="w-full justify-left flex flex-col flex-wrap">
                <div className=" ">
                    <DropdownDisplay
                        object={similarArtistsData}
                        sliceNumber={sliceNumber}
                        noTitle={true}
                        title={'Similar Artists'}
                    />
                </div>
                {/* <h2
                    className={`p-1 pb-0 text-xl ${darkMode ? 'text-slate-200' : 'text-slate-800'} font-bold`}
                >
                    Similar Artists:
                </h2> */}
                {/* <div className="flex flex-wrap">
                    {similarArtistsData.map(artist => (
                        <>
                            <ArtistItem
                                artist={artist}
                                width={
                                    queueToggle
                                        ? ' w-full p-1 pb-2 sm:w-1/2 lg:w-1/3 xl:w-1/4'
                                        : ' w-1/2 p-1 pb-2 sm:w-1/4 md:w-1/5 lg:w-1/6'
                                }
                            />
                        </>
                    ))}
                </div> */}
                {/* <div className="flex flex-wrap">
                    {similarArtistsData.map(artist => (
                        <>
                            <ArtistItem
                                artist={artist}
                                width={
                                    queueToggle
                                        ? ' w-full p-1 pb-2 sm:w-1/2 lg:w-1/3 xl:w-1/4'
                                        : ' w-1/2 p-1 pb-2 sm:w-1/4 md:w-1/5 lg:w-1/6'
                                }
                            />
                        </>
                    ))}
                </div> */}
            </div>
        )
    )
}

export default ArtistSimilarArtists
