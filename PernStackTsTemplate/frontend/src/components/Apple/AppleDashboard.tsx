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

interface appleDashboardProps {
    musicUserToken: String
}

type AlbumType = {
    attributes: AttributeObject
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
    console.log('more like recommendations: ', moreLikeRecommendations)

    const isMedium = useMediaQuery({ query: '(min-width: 768px)' })
    const isLarge = useMediaQuery({ query: '(min-width: 1024px)' })
    const isXLarge = useMediaQuery({ query: '(min-width: 1280px)' })
    const is2XLarge = useMediaQuery({ query: '(min-width: 1536px)' })

    let sliceNumber

    if (is2XLarge) {
        sliceNumber = 11 // For 2xl screens and larger
    } else if (isXLarge) {
        sliceNumber = 5 // For 2xl screens and larger
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

        const retrieveMoreLikeImage = async () => {
            try {
                if (
                    moreLikeRecommendations.attributes.title.contentIds[0].startsWith(
                        'l'
                    )
                ) {
                    try {
                        const res = await musicKitInstance?.api.music(
                            `/v1/me/library/albums/${moreLikeRecommendations.attributes.title.contentIds[0]}`
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
                            `/v1/catalog/ca/albums/${moreLikeRecommendations.attributes.title.contentIds[0]}`,

                            queryParameters
                        )

                        const data =
                            await res.data.data[0].attributes.artwork.url

                        console.log('data2: ', data)

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

        if (!moreLikeAlbumImage && moreLikeRecommendations) {
            console.log('running image retrieval')
            retrieveMoreLikeImage()
        }
    }, [musicKitInstance, moreLikeRecommendations])

    fetchHeavyRotation()
    FetchRecentlyPlayed()
    FetchRecommendations()

    // const { recommendations } = FetchRecommendations()

    // Recently played tracks: https://api.music.apple.com/v1/me/recent/played/tracks
    // Recently played stations: https://api.music.apple.com/v1/me/recent/radio-stations
    // Get recommendation based on ID https://api.music.apple.com/v1/me/recommendations/{id}

    return (
        <div
            className={`h-100vh flex-col flex-grow ${darkMode ? 'text-slate-200' : 'text-slate-800'}  relative z-10 flex justify-center `}
        >
            {/* MAIN DISPLAY */}
            {recentlyAddedToLib && (
                <h2 className="text-lg w-full px-2 mx-auto font-bold">
                    Recently Added to Library
                </h2>
            )}
            {recentlyAddedToLib && (
                <div className="flex flex-col mb-10  ">
                    <div className=" flex flex-wrap w-full px-2 justify-center gap-y-10 mx-auto gap-1">
                        {recentlyAddedToLib
                            .slice(0, 15)
                            .slice(
                                0,
                                moreAddedToLib
                                    ? recentlyAddedToLib.length
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
                                    <SongItem song={item} carousel={true} />
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

                    {recentlyAddedToLib &&
                        recentlyAddedToLib.length > sliceNumber && (
                            <button
                                onClick={e => {
                                    e.preventDefault()
                                    setMoreAddedToLib(!moreAddedToLib)
                                }}
                                className=" hidden  rounded-b-lg  w-4/12 mx-auto md:flex justify-center items-center flex-col mt-3 bg-blue-800 hover:bg-blue-700 active:bg-blue-600"
                            >
                                {moreAddedToLib ? (
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

            {/* {recentlyPlayedAlbums && (
                <DisplayRow
                    title={
                        recentlyPlayedAlbums.attributes.title.stringForDisplay
                    }
                    albums={recentlyPlayedAlbums.relationships.contents.data}
                />
            )} */}

            {/* MAIN DISPLAY */}
            {recentlyPlayed && (
                <h2 className="text-lg w-full px-2 mx-auto font-bold">
                    Recently Played
                </h2>
            )}
            {recentlyPlayed && (
                <div className="flex flex-col mb-10  ">
                    <div className=" flex flex-wrap w-full px-2 justify-center gap-y-10 mx-auto gap-1">
                        {recentlyPlayed
                            .slice(
                                0,
                                moreRecentlyPlayed
                                    ? recentlyPlayed.length
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
                                    <SongItem song={item} carousel={true} />
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

                    {recentlyPlayed && recentlyPlayed.length > sliceNumber && (
                        <button
                            onClick={e => {
                                e.preventDefault()
                                setMoreRecentlyPlayed(!moreRecentlyPlayed)
                            }}
                            className=" hidden  rounded-b-lg  w-4/12 mx-auto md:flex justify-center items-center flex-col mt-3 bg-blue-800 hover:bg-blue-700 active:bg-blue-600"
                        >
                            {moreRecentlyPlayed ? (
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

            {/* {heavyRotation && (
                <DisplayRow title={'Heavy Rotation'} albums={heavyRotation} />
            )} */}
            {/* {recentlyPlayed && (
                <DisplayRow title={'Recently Played'} albums={recentlyPlayed} />
            )} */}

            {heavyRotation && (
                <h2 className="text-lg w-full px-2 mx-auto font-bold">
                    Heavy Rotation
                </h2>
            )}
            {heavyRotation && (
                <div className="flex flex-col mb-10  ">
                    <div className=" flex flex-wrap w-full px-2 justify-center gap-y-10 mx-auto gap-1">
                        {heavyRotation
                            .slice(
                                0,
                                moreHeavyRotation
                                    ? heavyRotation.length
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
                                    <SongItem song={item} carousel={true} />
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
                    {heavyRotation && heavyRotation.length > sliceNumber && (
                        <button
                            onClick={e => {
                                e.preventDefault()
                                setMoreHeavyRotation(!moreHeavyRotation)
                            }}
                            className=" hidden  rounded-b-lg  w-4/12 mx-auto md:flex justify-center items-center flex-col mt-3 bg-blue-800 hover:bg-blue-700 active:bg-blue-600"
                        >
                            {moreHeavyRotation ? (
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

            {/* NEED TO MAKE A CUSTOM HOOK FOR DISPLAYING RECOMMMENDATIONS */}
            {/* {personalizedPlaylists && (
                <DisplayRow
                    title={
                        personalizedPlaylists.attributes.title.stringForDisplay
                    }
                    albums={personalizedPlaylists.relationships.contents.data}
                />
            )} */}

            {personalizedPlaylists && (
                <h2 className="text-lg w-full px-2 mx-auto font-bold">
                    Your mixes
                </h2>
            )}
            {personalizedPlaylists && (
                <div className="flex flex-col mb-10  ">
                    <div className=" flex flex-wrap w-full px-2 justify-center gap-y-10 mx-auto gap-1">
                        {personalizedPlaylists.relationships.contents.data
                            .slice(
                                0,
                                moreMadeForYou
                                    ? personalizedPlaylists.relationships
                                          .contents.data.length
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
                                    <SongItem song={item} carousel={true} />
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
                    {personalizedPlaylists &&
                        personalizedPlaylists.relationships.contents.data
                            .length > sliceNumber && (
                            <button
                                onClick={e => {
                                    e.preventDefault()
                                    setMoreMadeForYou(!moreMadeForYou)
                                }}
                                className=" hidden  rounded-b-lg  w-4/12 mx-auto md:flex justify-center items-center flex-col mt-3 bg-blue-800 hover:bg-blue-700 active:bg-blue-600"
                            >
                                {moreMadeForYou ? (
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

            {/* {themedRecommendations && (
                <DisplayRow
                    title={
                        themedRecommendations.attributes.title.stringForDisplay
                    }
                    albums={themedRecommendations.relationships.contents.data}
                />
            )} */}

            {themedRecommendations && (
                <h2 className="text-lg w-full px-2 mx-auto font-bold">
                    {themedRecommendations.attributes.title.stringForDisplay}
                </h2>
            )}
            {themedRecommendations && (
                <div className="flex flex-col mb-10  ">
                    <div className=" flex flex-wrap w-full px-2 justify-center gap-y-10 mx-auto gap-1">
                        {themedRecommendations.relationships.contents.data
                            .slice(
                                0,
                                moreThemed
                                    ? themedRecommendations.relationships
                                          .contents.data.length
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
                                    <SongItem song={item} carousel={true} />
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
                    {themedRecommendations &&
                        themedRecommendations.relationships.contents.data
                            .length > sliceNumber && (
                            <button
                                onClick={e => {
                                    e.preventDefault()
                                    setMoreThemed(!moreThemed)
                                }}
                                className=" hidden  rounded-b-lg  w-4/12 mx-auto md:flex justify-center items-center flex-col mt-3 bg-blue-800 hover:bg-blue-700 active:bg-blue-600"
                            >
                                {moreThemed ? (
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

            {/* {moreLikeRecommendations && (
                <DisplayRow
                    title={
                        moreLikeRecommendations.attributes.title
                            .stringForDisplay
                    }
                    url={
                        moreLikeAlbumImage &&
                        constructImageUrl(moreLikeAlbumImage, 100)
                    }
                    albums={moreLikeRecommendations.relationships.contents.data}
                />
            )} */}

            {moreLikeRecommendations && (
                <div className="flex items-center pb-3  ">
                    {moreLikeAlbumImage && moreLikeAlbumImage && (
                        <img src={constructImageUrl(moreLikeAlbumImage, 75)} />
                    )}
                    <h2 className="text-lg w-full  px-2 mx-auto font-bold">
                        {
                            moreLikeRecommendations.attributes.title
                                .stringForDisplay
                        }
                    </h2>
                </div>
            )}
            {moreLikeRecommendations && (
                <div className="flex flex-col mb-10  ">
                    <div className=" flex flex-wrap w-full px-2 justify-center gap-y-10 mx-auto gap-1">
                        {moreLikeRecommendations.relationships.contents.data
                            .slice(
                                0,
                                moreMoreLike
                                    ? moreLikeRecommendations.relationships
                                          .contents.data.length
                                    : sliceNumber
                            )
                            .map(item =>
                                item.type === 'library-playlists' ||
                                item.type === 'playlists' ? (
                                    <PlaylistItem
                                        playlistItem={item}
                                        carousel={true}
                                        width={` ${queueToggle ? 'w-full md:w-5/12 lg:w-3/12 2xl:w-2/12' : 'w-full md:w-5/12 lg:w-3/12 xl:w-2/12 2xl:w-1/12 3xl:w-full'} `}
                                    />
                                ) : item.type === 'stations' ? (
                                    <StationItem
                                        stationItem={item}
                                        carousel={true}
                                        width={` ${queueToggle ? 'w-full md:w-5/12 lg:w-3/12 2xl:w-2/12' : 'w-full md:w-5/12 lg:w-3/12 xl:w-2/12 2xl:w-1/12 3xl:w-full'} `}
                                    />
                                ) : item.type === 'songs' ||
                                  item.type === 'library-songs' ? (
                                    <SongItem song={item} carousel={true} />
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
                    {moreLikeRecommendations &&
                        moreLikeRecommendations.relationships.contents.data
                            .length > sliceNumber && (
                            <button
                                onClick={e => {
                                    e.preventDefault()
                                    setMoreMoreLike(!moreMoreLike)
                                }}
                                className=" hidden  rounded-b-lg  w-4/12 mx-auto md:flex justify-center items-center flex-col mt-3 bg-blue-800 hover:bg-blue-700 active:bg-blue-600"
                            >
                                {moreMoreLike ? (
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

            {/* {stationsForYou && (
                <DisplayRow
                    title={stationsForYou.attributes.title.stringForDisplay}
                    albums={stationsForYou.relationships.contents.data}
                />
            )} */}

            {stationsForYou && (
                <h2 className="text-lg w-full px-2 mx-auto font-bold">
                    Stations
                </h2>
            )}
            {stationsForYou && (
                <div className="flex flex-col mb-10  ">
                    <div className=" flex flex-wrap w-full px-2 justify-center gap-y-10 mx-auto gap-1">
                        {stationsForYou.relationships.contents.data
                            .slice(
                                0,
                                moreStations
                                    ? stationsForYou.relationships.contents.data
                                          .length
                                    : sliceNumber
                            )
                            .map(item =>
                                item.type === 'library-playlists' ||
                                item.type === 'playlists' ? (
                                    <PlaylistItem
                                        playlistItem={item}
                                        carousel={true}
                                        width={` ${queueToggle ? 'w-full md:w-5/12 lg:w-3/12 2xl:w-2/12' : 'w-full md:w-5/12 lg:w-3/12 xl:w-2/12 2xl:w-1/12 3xl:w-full'} `}
                                    />
                                ) : item.type === 'stations' ? (
                                    <StationItem
                                        stationItem={item}
                                        carousel={true}
                                        width={` ${queueToggle ? 'w-full md:w-5/12 lg:w-3/12 2xl:w-2/12' : 'w-full md:w-5/12 lg:w-3/12 xl:w-2/12 2xl:w-1/12 3xl:w-full'} `}
                                    />
                                ) : item.type === 'songs' ||
                                  item.type === 'library-songs' ? (
                                    <SongItem song={item} carousel={true} />
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
                    {stationsForYou &&
                        stationsForYou.relationships.contents.data.length >
                            sliceNumber && (
                            <button
                                onClick={e => {
                                    e.preventDefault()
                                    setMoreStations(!moreStations)
                                }}
                                className=" hidden  rounded-b-lg  w-4/12 mx-auto md:flex justify-center items-center flex-col mt-3 bg-blue-800 hover:bg-blue-700 active:bg-blue-600"
                            >
                                {moreStations ? (
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

export default AppleDashboard
