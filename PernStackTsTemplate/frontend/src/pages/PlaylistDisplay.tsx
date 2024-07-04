import React from 'react'
import { useStore } from '../store/store'
import { Link, useNavigate } from 'react-router-dom'
import defaultPlaylistArtwork from '../assets/images/defaultPlaylistArtwork.png'
import { IoMdAddCircleOutline } from 'react-icons/io'
import toast from 'react-hot-toast'
import { FaCirclePlay } from 'react-icons/fa6'

const PlaylistDisplay = () => {
    const {
        libraryPlaylists,
        musicKitInstance,
        authorizeMusicKit,
        appleMusicToken,
        fetchAppleToken,
    } = useStore(state => ({
        libraryPlaylists: state.libraryPlaylists,
        musicKitInstance: state.musicKitInstance,
        authorizeMusicKit: state.authorizeMusicKit,
        appleMusicToken: state.appleMusicToken,
        fetchAppleToken: state.fetchAppleToken,
    }))

    const constructImageUrl = (url: String, size: Number) => {
        return url
            .replace('{w}', size.toString())
            .replace('{h}', size.toString())
    }

    const style = { fontSize: '1.8rem', fontWeight: 'bold' }
    const navigate = useNavigate()
    const playPauseHandler = async (id: string) => {
        if (musicKitInstance) {
            await musicKitInstance.setQueue({
                playlist: id,
                startWith: 0,
                startPlaying: true,
            })
        }
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

    const styleBlue = { color: 'royalblue', fontSize: '2.5rem' }

    return (
        <>
            {/* <h1 className="text-center text-5xl  text-black p-4 font-bold mx-auto">
                Playlists
            </h1> */}
            <button
                className="btn btn-primary my-5 mb-8 bg-blue-500 hover:bg-blue-600  flex justify-center  border-none text-white text-xl font-bold w-fit"
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
                <div className="w-full flex text-black items-center pb-20 justify-center flex-col">
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
                                    <FaCirclePlay style={styleBlue} />
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
        </>
    )
}

export default PlaylistDisplay
