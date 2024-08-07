import { useState, useEffect } from 'react'
import useMusicKit from '../../components/Apple/LoadMusickit'
// import { useMusickitContext } from '../../context/MusickitContext'
import { useStore } from '../../store/store'
import AlbumItem from '../../components/Homepage/AlbumItem'

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
        releaseDate?: string
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

const ArtistLatestRelease = ({ id }) => {
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    const [latestReleaseData, setLatestReleaseData] =
        useState<Array<AlbumData> | null>(null)

    // const musicKitLoaded = useMusicKit()
    const {
        musicKitInstance,
        authorizeMusicKit,

        darkMode,
        queueToggle,
    } = useStore(state => ({
        musicKitInstance: state.musicKitInstance,

        darkMode: state.darkMode,
        queueToggle: state.queueToggle,
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
                        const latestRelease = await musicKitInstance.api.music(
                            `/v1/me/library/artists/${id}/view/latest-release`
                        )
                        if (latestRelease.status === 200) {
                            const latestReleaseData: Array<AlbumData> =
                                await latestRelease.data.data
                            setLatestReleaseData(latestReleaseData)
                        }
                    } catch (error: any) {
                        console.error(error)
                        setError(error)
                    } finally {
                        setLoading(false)
                    }
                } else {
                    try {
                        const latestRelease = await musicKitInstance.api.music(
                            `/v1/catalog/${musicKitInstance.storefrontId}/artists/${id}/view/latest-release`
                        )
                        console.log('latest release', latestRelease)

                        const latestReleaseData: Array<AlbumData> =
                            await latestRelease.data.data
                        setLatestReleaseData(latestReleaseData)
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
        latestReleaseData && (
            <div className="w-full flex-col flex  justify-center">
                <h2
                    className={`pb-3  text-center text-xl ${darkMode ? 'text-slate-200' : 'text-slate-800'} font-bold`}
                >
                    Latest Release:
                </h2>
                <div className=" gap-1 justify-center  flex flex-wrap">
                    {latestReleaseData.map(album => (
                        <>
                            <AlbumItem
                                albumItem={album}
                                width={
                                    queueToggle
                                        ? ' w-full md:w-3/4'
                                        : ' w-full md:w-3/4'
                                }
                                releaseDate={album.attributes.releaseDate}
                            />
                        </>
                        // <p className="">{album.attributes.name}</p>
                    ))}
                    <div className="w-1/2 flex ">
                        {latestReleaseData[0].attributes.editorialNotes
                            ? latestReleaseData[0].attributes.editorialNotes
                                  .standard ??
                              latestReleaseData[0].attributes.editorialNotes
                                  .short
                            : ''}
                    </div>
                </div>
            </div>
        )
    )
}

export default ArtistLatestRelease
