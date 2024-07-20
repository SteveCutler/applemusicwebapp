import React, { useEffect, useState } from 'react'
import { FaCaretDown, FaCaretUp } from 'react-icons/fa6'
import PlaylistItem from '../Homepage/PlaylistItem'
import StationItem from '../Homepage/StationItem'
import SongItem from '../Homepage/SongItem'
import ArtistItem from '../Homepage/ArtistItem'
import AlbumItem from '../Homepage/AlbumItem'
import { useStore } from '../../store/store'
import PodcastEpisode from '../../pages/PodcastEpisode'
import PodcastEpisodeItem from '../Homepage/PodcastEpisodeItem'
import PodcastItem from '../Homepage/PodcastItem'
import GradientAnimation from '../Homepage/GradientAnimation'
import SkeletonItem from '../Homepage/SkeletonItem'

interface podcastEpisode {
    dateCrawled: number
    datePublished: number
    datePublishedPretty: string
    description: string
    duration: number
    enclosureLength: number
    enclosureType: string
    enclosureUrl: string
    episodeType: string
    explicit: number
    feedDead: number
    feedDuplicateOf: number
    feedId: number
    feedImage: string
    feedItunesId: number
    feedLanguage: string
    feedUrl: string
    guid: string
    id: number
    image: string
    link: string
    podcastGuid: string
    season: number
    title: string
    released?: string
}

type podcastInfo = {
    artwork: string
    author: string
    categories: {
        [key: number]: string
    }
    contentType: string
    crawlErrors: number
    dead: number
    description: string
    episodeCount: number
    explicit: boolean
    generator: string
    id: number
    image: string
    imageUrlHash: number
    inPollingQueue: number
    itunesId: number
    language: string
    lastCrawlTime: number
    lastGoodHttpStatusTime: number
    lastHttpStatus: number
    lastParseTime: number
    lastUpdateTime: number
    link: string
    locked: number
    medium: string
    newestItemPubdate: number
    originalUrl: string
    ownerName: string
    parseErrors: number
    podcastGuid: string
    priority: number
    title: string
    type: number
    url: string
}

interface podcastProp {
    podcast: podcastEpisode
    width?: string
    sub?: boolean
}

type RecommendationType = {
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
        }
    }
    id: string
    type: string
}

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

type StationType = {
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

interface recoProps {
    sliceNumber: number
    shrink?: boolean
    loading?: boolean
}

const SkeletonDropdownDisplay: React.FC<recoProps> = ({
    sliceNumber,
    shrink,
    loading,
}) => {
    const style = { fontSize: '1.5rem' }

    const { queueToggle, darkMode, musicKitInstance } = useStore(state => ({
        musicKitInstance: state.musicKitInstance,
        darkMode: state.darkMode,
        queueToggle: state.queueToggle,
    }))

    // useEffect(() => {}, [object])

    // console.log('object:', object, 'sliceNunber:', sliceNumber)

    return (
        <div className="  ">
            <div
                className={`text-lg font-bold w-11/12 border-b-2 pb-2 mb-4 flex mx-auto ${darkMode ? 'text-white border-white' : 'text-black border-black'}`}
            >
                <div className=" px-5 italic text-xl w-1/4 bg-blue-400 animation-pulse h-8 rounded-full font-bold"></div>
            </div>

            <div className="flex flex-col mb-10  rounded-xl w-fit">
                <div className=" flex w-full flex-wrap px-2 justify-center gap-y-10 mx-auto gap-1">
                    {Array.from({ length: sliceNumber }).map((_, index) => (
                        <SkeletonItem
                            key={index}
                            width={` ${
                                queueToggle
                                    ? shrink
                                        ? 'w-full md:w-5/12 lg:w-3/12 xl:w-2/12'
                                        : 'w-full md:w-5/12 lg:w-3/12 xl:w-3/12'
                                    : shrink
                                      ? 'w-full md:w-5/12 lg:w-3/12 xl:w-2/12 2xl:w-1/12'
                                      : 'w-full md:w-5/12 lg:w-3/12 xl:w-2/12 2xl:w-2/12'
                            } `}
                        />
                    ))}
                </div>

                <button
                    // onClick={e => {
                    //     e.preventDefault()
                    //     setExpand(!expand)
                    // }}
                    className=" hidden  rounded-b-lg  w-4/12 mx-auto animate-pulse md:flex justify-center items-center flex-col mt-3 bg-blue-500"
                >
                    <div className="mx-auto flex-col h-10  justify-center items-center flex text-slate-300 font-bold text-sm">
                        <p> </p>
                        {/* <FaCaretDown style={style} /> */}
                    </div>
                </button>
            </div>
        </div>
    )
}

export default SkeletonDropdownDisplay
