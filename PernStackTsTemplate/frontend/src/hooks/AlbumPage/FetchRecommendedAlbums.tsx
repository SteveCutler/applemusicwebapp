import { useState, useEffect } from 'react'
import useMusicKit from './LoadMusickit'
// import { useMusickitContext } from '../../context/MusickitContext'
import { useStore } from '../../store/store'
import DropdownDisplay from '../../components/Apple/DropdownDisplay'
import { useMediaQuery } from 'react-responsive'

type AlbumType = {
    attributes?: AttributeObject
    relationships: RelationshipObject
    id: string
}

type AttributeObject = {
    artistName: string
    artwork: ArtworkObject
    dateAdded: string
    genreNames: Array<string>
    name: string
    releaseDate?: string
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

interface relatedAlbumsProps {
    albumId: string
}

const FetchRecommendedAlbums: React.FC<relatedAlbumsProps> = ({ albumId }) => {
    const {
        musicKitInstance,
        authorizeMusicKit,
        appleMusicToken,
        queueToggle,
    } = useStore(state => ({
        musicKitInstance: state.musicKitInstance,
        appleMusicToken: state.appleMusicToken,
        queueToggle: state.queueToggle,
        authorizeMusicKit: state.authorizeMusicKit,
    }))
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [recommendedAlbums, setRecommendedAlbums] = useState<string | null>(
        null
    )

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

    // const musicKitLoaded = useMusicKit()

    // const musicKitInstance = useStore(state => state.musicKitInstance)
    // const authorizeMusicKit = useStore(state => state.authorizeMusicKit)

    const fetchRelatedAlbums = async () => {
        if (!musicKitInstance) {
            await authorizeMusicKit()
            return
        }
        setLoading(true)
        console.log('album id', albumId)

        try {
            const res = await fetch(
                `https://api.music.apple.com/v1/me/recommendations/${albumId}`,
                {
                    headers: {
                        Authorization: `Bearer ${import.meta.env.VITE_MUSICKIT_DEVELOPER_TOKEN}`,
                        'Music-User-Token': appleMusicToken,
                    },
                }
            )
            const data = await res.json()
            console.log('recommended albums:', data)
            // const relatedAlbums = await data.data.data

            // setRecommendedAlbums(relatedAlbums)
        } catch (error: any) {
            console.error(error)
            setError(error)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchRelatedAlbums()
    }, [musicKitInstance])

    return (
        recommendedAlbums && (
            <div className="">
                <DropdownDisplay
                    object={recommendedAlbums}
                    sliceNumber={sliceNumber}
                    noTitle={true}
                    title={'Recommended Albums'}
                />
            </div>
        )
    )
}

export default FetchRecommendedAlbums
