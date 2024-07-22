import React, { useEffect, useState } from 'react'
import { useStore } from '../store/store'
import { Link, useNavigate } from 'react-router-dom'
import defaultPlaylistArtwork from '../assets/images/defaultPlaylistArtwork.png'
import { IoMdAddCircleOutline } from 'react-icons/io'
import toast from 'react-hot-toast'
import { FaCirclePause, FaCirclePlay } from 'react-icons/fa6'
import RecommendationDisplay from '../components/Apple/RecommendationDisplay'
import { useMediaQuery } from 'react-responsive'
import SkeletonDropdownDisplay from '../components/Apple/SkeletonDropdownDisplay'

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

const PlaylistDisplay = () => {
    const {
        libraryPlaylists,
        queueToggle,
        musicKitInstance,
        authorizeMusicKit,
        appleMusicToken,
        personalizedPlaylists,
        fetchAppleToken,
        recommendations,
        setPersonalizedPlaylists,
        setRecommendations,
        darkMode,
    } = useStore(state => ({
        queueToggle: state.queueToggle,
        setPersonalizedPlaylists: state.setPersonalizedPlaylists,
        recommendations: state.recommendations,
        setRecommendations: state.setRecommendations,
        darkMode: state.darkMode,
        libraryPlaylists: state.libraryPlaylists,
        musicKitInstance: state.musicKitInstance,
        personalizedPlaylists: state.personalizedPlaylists,
        authorizeMusicKit: state.authorizeMusicKit,
        appleMusicToken: state.appleMusicToken,
        fetchAppleToken: state.fetchAppleToken,
    }))

    const [personal, setPersonal] = useState<RecommendationType | null>(null)

    const [loadingRecommendations, setLoadingRecommendations] = useState(true)

    const constructImageUrl = (url: String, size: Number) => {
        return url
            .replace('{w}', size.toString())
            .replace('{h}', size.toString())
    }

    const style = { fontSize: '1.8rem', fontWeight: 'bold' }
    const navigate = useNavigate()
    const playPauseHandler = async (id: string) => {
        if (musicKitInstance) {
            if (
                musicKitInstance.nowPlayingItem &&
                musicKitInstance.nowPlayingItem.container &&
                musicKitInstance.nowPlayingItem.container.id == id
            ) {
                musicKitInstance.playbackState == 2
                    ? await musicKitInstance.pause()
                    : await musicKitInstance.play()
            } else {
                await musicKitInstance.setQueue({
                    playlist: id,
                    startWith: 0,
                    startPlaying: true,
                })
            }
        }
    }

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

    const removePlaylist = async (playlistId: string) => {
        if (!musicKitInstance) {
            await authorizeMusicKit()
        }
        if (!appleMusicToken) {
            await fetchAppleToken()
        }

        const deletePlaylist = async () => {
            if (musicKitInstance && appleMusicToken) {
                try {
                    const response = await fetch(
                        `https://api.music.apple.com/v1/me/library/playlists/${playlistId}`,
                        {
                            method: 'DELETE',
                            headers: {
                                Authorization: `Bearer ${
                                    import.meta.env
                                        .VITE_MUSICKIT_DEVELOPER_TOKEN
                                }`,
                                'Music-User-Token': appleMusicToken ?? '', // Add Music User Token here
                                'Content-Type': 'application/json',
                            },
                            // credentials: 'include',
                        }
                    )

                    if (response.status === 204) {
                        toast.success('Playlist deleted')
                    } else {
                        const errorData = await response.json()
                        toast.error('Problem deleting playlist...')
                        console.error('Failed to delete playlist:', errorData)
                    }
                } catch (error) {
                    console.error('Error deleting playlist:', error)
                }
            }
        }
        if (musicKitInstance && appleMusicToken) {
            await deletePlaylist()
        }
    }

    useEffect(() => {
        const fetchRecommendations = async () => {
            if (musicKitInstance) {
                try {
                    const queryParameters = {
                        l: 'en-us',
                        limit: 20,
                    }
                    const res = await musicKitInstance.api.music(
                        '/v1/me/recommendations/',
                        queryParameters
                    )

                    const data = await res.data.data
                    console.log('loading recommendations: ', data)

                    setPersonalizedPlaylists(data[0])

                    const newList = [
                        data[1],
                        data[6],
                        data[0],
                        data[11],
                        data[10],
                        data[12],
                        data[8],
                        data[9],
                        data[7],
                        data[2],
                        data[4],
                        data[5],
                        data[13],

                        data[3],
                    ]

                    setRecommendations(newList)
                    setLoadingRecommendations(false)
                } catch (error: any) {
                    console.error(error)
                    setLoadingRecommendations(false)
                    // setError(error)
                }
            }
        }

        if (!recommendations && musicKitInstance && appleMusicToken) {
            fetchRecommendations()
        } else {
            setLoadingRecommendations(false)
        }
    }, [musicKitInstance, appleMusicToken, recommendations])

    // useEffect(() => {
    //     if (personalizedPlaylists && !personal) {
    //         setPersonal(personalizedPlaylists)
    //     }
    // }, [personalizedPlaylists, personal])

    const styleBlue = { color: 'dodgerblue', fontSize: '2.5rem' }

    return (
        <div className="flex flex-col w-full  justify-start items-center">
            {personalizedPlaylists ? (
                <>
                    <div
                        className={`text-left font-bold ${darkMode ? 'text-slate-200 border-white ' : ' text-black border-black'}  w-11/12 border-b-2 mt-0 mb-2 pb-1 text-xl`}
                    >
                        <p className="px-5 italic">Made for You</p>
                    </div>
                    <RecommendationDisplay
                        reco={personalizedPlaylists}
                        noTitle={true}
                        sliceNumber={sliceNumber}
                    />
                </>
            ) : (
                <SkeletonDropdownDisplay sliceNumber={sliceNumber} />
            )}
            <button
                className="btn btn-primary  mb-3 mt-5 bg-blue-500 hover:bg-blue-600  flex justify-center  border-none text-white text-xl font-bold w-fit"
                onClick={e => {
                    e.preventDefault()
                    navigate('/new-playlist')
                }}
            >
                {' '}
                <h1>Create New Playlist</h1>
                <div>
                    <IoMdAddCircleOutline style={style} />
                </div>
            </button>
            {libraryPlaylists ? (
                <div className="w-full flex h-full text-black justify-start pb-20 items-center flex-col">
                    {libraryPlaylists.map((playlist, index) => (
                        <>
                            <Link
                                to={`/playlist/${playlist.id}`}
                                className={`w-4/5 flex bg-slate-900 text-xl justify-between text-white p-3 hover:bg-slate-700 ${index === libraryPlaylists.length - 1 && 'rounded-b-lg'} ${index === 0 && 'rounded-t-lg'}`}
                            >
                                <div className="flex gap-6 items-center ">
                                    <div className=" flex ">
                                        {playlist.attributes.artwork?.url ? (
                                            <img
                                                src={constructImageUrl(
                                                    playlist.attributes.artwork
                                                        ?.url,
                                                    60
                                                )}
                                                style={{ maxWidth: '60px' }}
                                            />
                                        ) : (
                                            <img
                                                src={defaultPlaylistArtwork}
                                                style={{ maxWidth: '60px' }}
                                            />
                                        )}
                                    </div>
                                    <div className="">
                                        {playlist.attributes.name}
                                    </div>
                                </div>
                                <button
                                    className="transform hover:scale-110 items-center flex active:scale-95 transition-transform duration-100 easy-ease"
                                    onClick={async e => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        await playPauseHandler(playlist.id)
                                    }}
                                >
                                    {musicKitInstance.nowPlayingItem &&
                                    musicKitInstance.nowPlayingItem.container &&
                                    musicKitInstance.playbackState == 2 &&
                                    musicKitInstance.nowPlayingItem.container
                                        .id == playlist.id ? (
                                        <FaCirclePause style={styleBlue} />
                                    ) : (
                                        <FaCirclePlay style={styleBlue} />
                                    )}

                                    {/* <Link
                                        to={`/playlist-edit/${playlist.id}`}
                                        state={{ playlist }}
                                        className="btn btn-primary bg-blue-500 border-none hover:cursor-pointer  hover:bg-blue-600"
                                    >
                                        Edit
                                    </Link> */}
                                    {/* <button
                                        className="btn btn-primary bg-red-500 border-none hover:cursor-pointer  hover:bg-red-600"
                                        onClick={async e => {
                                            e.preventDefault()
                                            await removePlaylist(playlist.id)
                                        }}
                                    >
                                        Delete
                                    </button> */}
                                </button>
                            </Link>
                        </>
                    ))}
                </div>
            ) : (
                <div className="w-full flex flex-col text-black items-center mx-auto text-lg font-bold">
                    No playlists to display...
                </div>
            )}
        </div>
    )
}

export default PlaylistDisplay
