import { useState, useEffect } from 'react'
import useMusicKit from './LoadMusickit'
// import { useMusickitContext } from '../../context/MusickitContext'
import AlbumItem from '../Homepage/AlbumItem'
import DisplayRow from '../Homepage/DisplayRow'
import fetchHeavyRotation from './FetchHeavyRotation'
import FetchRecentlyPlayed from './FetchRecentlyPlayed'
import FetchRecommendations from './FetchRecommendations'
import { useStore } from '../../store/store'
import FetchRecentlyAddedToLib from './FetchRecentlyAddedToLib'
import { FaCaretDown, FaCaretUp } from 'react-icons/fa'
import PlaylistItem from '../Homepage/PlaylistItem'
import StationItem from '../Homepage/StationItem'
import SongItem from '../Homepage/SongItem'
import ArtistItem from '../Homepage/ArtistItem'
import { useMediaQuery } from 'react-responsive'
import RecommendationDisplay from './RecommendationDisplay'

type AlbumType = {
    attributes: {
        artistName: string
        artwork?: {
            height: number
            width: number
            url: string
        }
        dateAdded: string
        genreNames: Array<string>
        name: string
        releasedDate: string
        trackCount: number
    }
    id: string
    type: string
}

type playlist = {
    attributes: {
        artwork?: {
            bgColor: string
            url: string
        }
        description?: string
        curatorName?: string
        canEdit: boolean
        playlistType?: string
        dataAdded: string
        isPublic: boolean
        lastModifiedDate: string
        name: string
    }
    href: string
    id: string
    type: string
}

interface RecommendationType {
    attributes: {
        title: {
            stringForDisplay: string
            contentIds?: string[]
        }
    }
    relationships: {
        contents: {
            data: Array<playlist | AlbumType | StationType>
        }
    }
}

interface StationType {
    attributes: {
        artwork: {
            bgColor: string
            url: string
        }
        mediaKind: string
        name: string
        url: string
        playParams: {
            format: string
            id: string
            kind: string
            stationHash: string
        }
    }
    id: String
    type: string
}

type AttributeObject = {
    artistName: String
    artwork: ArtworkObject
    dateAdded: String
    genreNames: Array<String>
    name: String
    releasedDate: String
    trackCount: Number
}

type ArtworkObject = {
    height: Number
    width: Number
    url: String
}

const AppleDashboard = () => {
    const {
        musicKitInstance,
        authorizeMusicKit,
        darkMode,
        queueToggle,
        heavyRotation,
        themedRecommendations,
        setHeavyRotation,
        recommendations,
        recentlyPlayedAlbums,
        personalizedPlaylists,
        recentlyPlayed,
        recentlyAddedToLib,
        moreLikeRecommendations,
        stationsForYou,
    } = useStore(state => ({
        queueToggle: state.queueToggle,
        musicKitInstance: state.musicKitInstance,
        recentlyAddedToLib: state.recentlyAddedToLib,
        darkMode: state.darkMode,
        moreLikeRecommendations: state.moreLikeRecommendations,
        themedRecommendations: state.themedRecommendations,
        personalizedPlaylists: state.personalizedPlaylists,
        recommendations: state.recommendations,
        authorizeMusicKit: state.authorizeMusicKit,
        heavyRotation: state.heavyRotation,
        recentlyPlayedAlbums: state.recentlyPlayedAlbums,
        setHeavyRotation: state.setHeavyRotation,
        recentlyPlayed: state.recentlyPlayed,
        stationsForYou: state.stationsForYou,
    }))

    const [moreAddedToLib, setMoreAddedToLib] = useState(false)
    const [moreRecentlyPlayed, setMoreRecentlyPlayed] = useState(false)
    const [moreMoreLike, setMoreMoreLike] = useState(false)
    const [moreStations, setMoreStations] = useState(false)
    const [moreThemed, setMoreThemed] = useState(false)
    const [moreHeavyRotation, setMoreHeavyRotation] = useState(false)
    const [moreMadeForYou, setMoreMadeForYou] = useState(false)

    const style = { fontSize: '1.5rem' }

    const constructImageUrl = (url: String, size: Number) => {
        return url
            .replace('{w}', size.toString())
            .replace('{h}', size.toString())
    }
    const [moreLikeAlbumImage, setMoreLikeAlbumImage] = useState<string | null>(
        null
    )
    // const [heavyRotation, setHeavyRotation] = useState<Array<AlbumType> | null>(
    //     null
    // )
    // console.log('more like recommendations: ', moreLikeRecommendations)

    const shuffle = (array: Array<RecommendationType>) => {
        console.log('array', array)
        const newArray = array.sort(() => Math.random() - 0.5)
        return newArray
    }
    // if (recommendations) {
    //     console.log('shuffled', shuffle(recommendations))
    // }

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
        if (!musicKitInstance) {
            authorizeMusicKit()
        }
    }, [musicKitInstance])

    fetchHeavyRotation()
    FetchRecentlyPlayed()
    FetchRecommendations()

    // console.log('recommendations: ', recommendations)

    // const { recommendations } = FetchRecommendations()

    return (
        <div
            className={`h-100vh flex-col flex-grow ${darkMode ? 'text-slate-200' : 'text-slate-800'}  relative z-10 flex justify-center `}
        >
            {recommendations &&
                recommendations.map((reco, index) => (
                    <RecommendationDisplay
                        key={index}
                        reco={reco}
                        sliceNumber={sliceNumber}
                    />
                ))}
        </div>
    )
}

export default AppleDashboard
