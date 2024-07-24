import React, { useEffect, useState } from 'react'
import { useStore } from '../../store/store'
import SkeletonDropdownDisplay from './SkeletonDropdownDisplay'
import { useMediaQuery } from 'react-responsive'
import DropdownDisplay from './DropdownDisplay'

type RecentlyAddedItem = AlbumType | playlist | StationType | Song

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
interface Album {
    id: string
    albumId: string
    name: string
    artistName: string
    artworkUrl: string
    trackCount: number
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

const RecentlyAddedToLib = () => {
    const {
        musicKitInstance,
        appleMusicToken,
        queueToggle,
        setRecentlyAddedToLib,
        authorizeMusicKit,
        recentlyAddedToLib,
        isAuthorized,
    } = useStore(state => ({
        musicKitInstance: state.musicKitInstance,
        appleMusicToken: state.appleMusicToken,
        queueToggle: state.queueToggle,
        setRecentlyAddedToLib: state.setRecentlyAddedToLib,
        authorizeMusicKit: state.authorizeMusicKit,
        recentlyAddedToLib: state.recentlyAddedToLib,
        isAuthorized: state.isAuthorized,
    }))
    const [loadingRecent, setLoadingRecent] = useState(true)

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
        const recent: RecentlyAddedItem[] = []

        const fetchRecentlyAddedToLib = async (url: string) => {
            if (musicKitInstance) {
                try {
                    const queryParameters = {
                        l: 'en-us',
                        limit: 10,
                        headers: {
                            Authorization: `Bearer ${import.meta.env.VITE_MUSICKIT_DEVELOPER_TOKEN}`,
                            'Music-User-Token': appleMusicToken,
                        },
                    }
                    const res = await musicKitInstance.api.music(
                        url,
                        queryParameters
                    )

                    // if (res.status !== 200) {

                    // }

                    const data: RecentlyAddedItem[] = await res.data.data
                    recent.push(...data)
                    // console.log('recent', recent)

                    if (res.data.next && recent.length <= 20) {
                        await fetchRecentlyAddedToLib(res.data.next)
                    } else {
                        setRecentlyAddedToLib(recent)
                        setLoadingRecent(false)
                    }
                } catch (error: any) {
                    console.error(error)
                    setLoadingRecent(false)
                }
            }
        }

        if (!musicKitInstance || !appleMusicToken) {
            authorizeMusicKit()
        }
        if (
            musicKitInstance &&
            appleMusicToken &&
            recentlyAddedToLib.length < 1
        ) {
            fetchRecentlyAddedToLib('/v1/me/library/recently-added')
        } else {
            setLoadingRecent(false)
        }
    }, [musicKitInstance, appleMusicToken, isAuthorized, recentlyAddedToLib])

    return (
        <>
            {loadingRecent ? (
                <SkeletonDropdownDisplay sliceNumber={sliceNumber} />
            ) : (
                !loadingRecent &&
                recentlyAddedToLib.length >= 1 && (
                    <DropdownDisplay
                        object={recentlyAddedToLib.slice(0, 15)}
                        sliceNumber={sliceNumber}
                        noTitle={true}
                        title={'Recently Added to Library'}
                    />
                )
            )}
        </>
    )
}

export default RecentlyAddedToLib
