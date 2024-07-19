import { useState, useEffect } from 'react'
import useMusicKit from '../../components/Apple/LoadMusickit'
// import { useMusickitContext } from '../../context/MusickitContext'
import { useStore } from '../../store/store'
import AlbumItem from '../../components/Homepage/AlbumItem'
import { useMediaQuery } from 'react-responsive'
import DropdownDisplay from '../../components/Apple/DropdownDisplay'

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
    releaseDate: string
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
        releaseDate?: string
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

type AlbumType = {
    attributes: {
        artistName: String
        artwork?: { height: Number; width: Number; url?: String }
        dateAdded: String
        genreNames: Array<String>
        name: String
        releaseDate: String
        trackCount: Number
    }
    id: string
    href?: string
    type: string
}

const ArtistAlbumData = ({ id }) => {
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    const [artistAlbumData, setArtistAlbumData] =
        useState<Array<AlbumType> | null>(null)

    // const musicKitLoaded = useMusicKit()
    const {
        musicKitInstance,
        authorizeMusicKit,
        storefront,
        queueToggle,
        darkMode,
    } = useStore(state => ({
        musicKitInstance: state.musicKitInstance,
        storefront: state.storefront,
        queueToggle: state.queueToggle,
        darkMode: state.darkMode,
        authorizeMusicKit: state.authorizeMusicKit,
        albumData: state.albumData,
        setAlbumData: state.setAlbumData,
    }))

    // const musicKitInstance = useStore(state => state.musicKitInstance)
    // const authorizeMusicKit = useStore(state => state.authorizeMusicKit)

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

    useEffect(() => {
        const fetchArtistAlbumData = async () => {
            if (!musicKitInstance) {
                await authorizeMusicKit()
                return
            }
            if (!musicKitInstance || !id) {
                return
            }
            console.log('id', id)

            try {
                if (id && id.startsWith('r')) {
                    console.log(`${id} start with 'r'`)
                    try {
                        const albumRes = await musicKitInstance.api.music(
                            `/v1/me/library/artists/${id}/albums`
                        )

                        console.log('test album res: ', albumRes)

                        const albumData: Array<AlbumType> =
                            await albumRes.data.data
                        console.log('artist album data: ', albumData)
                        setArtistAlbumData(albumData)
                    } catch (error: any) {
                        console.error(error)
                        setError(error)
                    } finally {
                        setLoading(false)
                    }
                } else {
                    try {
                        const albumRes = await musicKitInstance.api.music(
                            `/v1/catalog/${storefront}/artists/${id}/albums`
                        )

                        const albumData: Array<AlbumType> =
                            await albumRes.data.data

                        setArtistAlbumData(albumData)
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

        fetchArtistAlbumData()
    }, [musicKitInstance, id, authorizeMusicKit])

    return (
        <>
            <div className=" ">
                <DropdownDisplay
                    object={artistAlbumData}
                    sliceNumber={sliceNumber}
                    noTitle={true}
                    title={'Albums'}
                />
            </div>
            {/* {artistAlbumData && (
                <h2
                    className={`mx-3 px-3 text-xl ${darkMode ? 'text-slate-200' : 'text-slate-800'} font-bold`}
                >
                    Albums:
                </h2>
            )}
            {artistAlbumData && (
                <div className="w-full justify-left flex flex-wrap">
                    {artistAlbumData.map(album => (
                        <>
                            <AlbumItem
                                albumItem={album}
                                width={
                                    queueToggle
                                        ? ' w-full p-1 pb-2 sm:w-1/2 lg:w-1/3 xl:w-1/4'
                                        : ' w-1/2 p-1 pb-2 sm:w-1/4 md:w-1/5 lg:w-1/6'
                                }
                            />
                        </>
                    ))}
                </div>
            )} */}
        </>
    )
}

export default ArtistAlbumData
