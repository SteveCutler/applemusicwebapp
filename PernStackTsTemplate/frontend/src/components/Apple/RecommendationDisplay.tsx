import React, { useEffect, useState } from 'react'
import { FaCaretDown, FaCaretUp } from 'react-icons/fa6'
import PlaylistItem from '../Homepage/PlaylistItem'
import StationItem from '../Homepage/StationItem'
import SongItem from '../Homepage/SongItem'
import ArtistItem from '../Homepage/ArtistItem'
import AlbumItem from '../Homepage/AlbumItem'
import { useStore } from '../../store/store'

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

interface recoProps {
    reco: RecommendationType
    sliceNumber: number
    noTitle?: boolean
}

const RecommendationDisplay: React.FC<recoProps> = ({
    reco,
    sliceNumber,
    noTitle,
}) => {
    const style = { fontSize: '1.5rem' }

    const { queueToggle, darkMode, musicKitInstance } = useStore(state => ({
        musicKitInstance: state.musicKitInstance,

        darkMode: state.darkMode,
        queueToggle: state.queueToggle,
    }))

    const constructImageUrl = (url: String, size: Number) => {
        return url
            .replace('{w}', size.toString())
            .replace('{h}', size.toString())
    }

    const [moreLikeAlbumImage, setMoreLikeAlbumImage] = useState<string | null>(
        null
    )

    useEffect(() => {
        const retrieveMoreLikeImage = async () => {
            if (reco.attributes.title.contentIds) {
                try {
                    if (reco.attributes.title.contentIds[0].startsWith('l')) {
                        try {
                            const res = await musicKitInstance?.api.music(
                                `/v1/me/library/albums/${reco.attributes.title.contentIds[0]}`
                            )

                            const data =
                                await res.data.data[0].attributes.artwork.url

                            console.log('data1: ', data)
                            {
                                data && setMoreLikeAlbumImage(data)
                            }
                        } catch (error: any) {
                            console.error(error)
                        }
                    } else {
                        try {
                            const queryParameters = { l: 'en-us' }
                            const res = await musicKitInstance?.api.music(
                                `/v1/catalog/${musicKitInstance.storefrontId}/albums/${reco.attributes.title.contentIds[0]}`,

                                queryParameters
                            )

                            const data =
                                await res.data.data[0].attributes.artwork.url

                            // console.log('data2: ', data)

                            {
                                data && setMoreLikeAlbumImage(data)
                            }
                        } catch (error: any) {
                            console.error(error)
                        }
                    }
                } catch (error: any) {
                    console.error(error)
                }
            }
        }

        if (!moreLikeAlbumImage && reco && reco.attributes.title.contentIds) {
            // console.log('running image retrieval')
            retrieveMoreLikeImage()
        }
    }, [reco])

    // console.log('reco:', reco, 'sliceNunber:', sliceNumber)
    const [expand, setExpand] = useState(false)

    return (
        <div className="h-full">
            {reco && moreLikeAlbumImage && reco.attributes.title.contentIds ? (
                <div
                    className={`text-lg font-bold w-11/12 border-b-2 pb-2 mb-4 flex mx-auto ${darkMode ? 'text-white border-white' : 'text-black border-black'}`}
                >
                    <div className="px-5">
                        <img src={constructImageUrl(moreLikeAlbumImage, 75)} />
                    </div>
                    <h2 className="text-xl italic  font-bold">
                        {reco.attributes.title.stringForDisplay}
                    </h2>
                </div>
            ) : (
                !noTitle &&
                reco && (
                    <div
                        className={`text-lg font-bold italic w-11/12 border-b-2 pb-2 mb-4 flex mx-auto ${darkMode ? 'text-white border-white' : 'text-black border-black'}`}
                    >
                        <h2 className=" px-5 text-xl font-bold">
                            {reco.attributes.title.stringForDisplay}
                        </h2>
                    </div>
                )
            )}
            {reco && (
                <div className="flex flex-col mb-10  ">
                    <div className=" flex flex-wrap w-full px-2 justify-center gap-y-10 mx-auto gap-1">
                        {reco.relationships.contents.data
                            .slice(0, 20)
                            .slice(
                                0,
                                expand
                                    ? reco.relationships.contents.data.length
                                    : sliceNumber
                            )
                            .map(item =>
                                item.type === 'library-playlists' ||
                                item.type === 'playlists' ? (
                                    <PlaylistItem
                                        playlistItem={item}
                                        carousel={true}
                                        width={` ${queueToggle ? 'w-full md:w-5/12 lg:w-3/12 2xl:w-2/12' : 'w-full md:w-5/12 lg:w-3/12 xl:w-2/12 2xl:w-1/12'} `}
                                    />
                                ) : item.type === 'stations' ? (
                                    <StationItem
                                        stationItem={item}
                                        carousel={true}
                                        width={` ${queueToggle ? 'w-full md:w-5/12 lg:w-3/12 2xl:w-2/12' : 'w-full md:w-5/12 lg:w-3/12 xl:w-2/12 2xl:w-1/12'} `}
                                    />
                                ) : item.type === 'songs' ||
                                  item.type === 'library-songs' ? (
                                    <SongItem
                                        song={item}
                                        carousel={true}
                                        width={` ${queueToggle ? 'w-full md:w-5/12 lg:w-3/12 2xl:w-2/12' : 'w-full md:w-5/12 lg:w-3/12 xl:w-2/12 2xl:w-1/12'} `}
                                    />
                                ) : item.type === 'artists' ||
                                  item.type === 'library-artists' ? (
                                    <ArtistItem carousel={true} artist={item} />
                                ) : (
                                    item.attributes && (
                                        <AlbumItem
                                            albumItem={item}
                                            carousel={true}
                                            releaseDate={
                                                item.attributes.releaseDate
                                            }
                                            width={` ${queueToggle ? 'w-full md:w-5/12 lg:w-3/12 2xl:w-2/12' : 'w-full md:w-5/12 lg:w-3/12 xl:w-2/12 2xl:w-1/12 3xl:w-full'} `}
                                        />
                                    )
                                )
                            )}
                    </div>

                    {reco &&
                        reco.relationships.contents.data.length >
                            sliceNumber && (
                            <button
                                onClick={e => {
                                    e.preventDefault()
                                    setExpand(!expand)
                                }}
                                className=" hidden  rounded-b-lg  w-4/12 mx-auto md:flex justify-center items-center flex-col mt-3 bg-blue-500 hover:bg-blue-400 active:bg-blue-600"
                            >
                                {expand ? (
                                    <div className="mx-auto flex-col justify-center py-2 items-center flex text-slate-300 font-bold text-sm">
                                        <FaCaretUp style={style} />
                                    </div>
                                ) : (
                                    <div className="mx-auto flex-col justify-center items-center flex text-slate-300 font-bold text-sm">
                                        See more
                                        <FaCaretDown style={style} />
                                    </div>
                                )}
                            </button>
                        )}
                </div>
            )}
        </div>
    )
}

export default RecommendationDisplay
