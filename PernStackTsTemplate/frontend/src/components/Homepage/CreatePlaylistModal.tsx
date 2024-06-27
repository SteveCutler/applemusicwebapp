import e from 'express'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useStore } from '../../store/store'

interface CreatePlaylistModalProps {
    isOpen: boolean
    onClose: () => void
}

interface playlist {
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

const CreatePlaylistModal: React.FC<CreatePlaylistModalProps> = ({
    isOpen,
    onClose,
}) => {
    const { appleMusicToken, setLibraryPlaylists, libraryPlaylists } = useStore(
        state => ({
            appleMusicToken: state.appleMusicToken,
            setLibraryPlaylists: state.setLibraryPlaylists,
            libraryPlaylists: state.libraryPlaylists,
        })
    )

    const [playlistName, setPlaylistName] = useState('')
    const [playlistDescription, setPlaylistDescription] = useState('')

    const createPlaylist = async (e: any) => {
        e.preventDefault()

        try {
            const response = await fetch(
                'https://api.music.apple.com/v1/me/library/playlists',
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${
                            import.meta.env.VITE_MUSICKIT_DEVELOPER_TOKEN
                        }`,
                        'Music-User-Token': appleMusicToken ?? '', // Add Music User Token here
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        attributes: {
                            name: playlistName,
                            description: playlistDescription ?? '',
                        },
                    }),
                    // credentials: 'include',
                }
            )

            console.log('response: ', response)
            const data = await response.json()
            console.log('data: ', data)
            if (response.status === 201) {
                //check for success
                toast.success('Playlist created!')
                //update sidebar playlists before refresh
                const newPlaylist = {
                    attributes: {
                        description: playlistDescription ?? '',

                        canEdit: data.data[0].attributes.canEdit,

                        dataAdded: data.data[0].attributes.dateAdded,
                        isPublic: data.data[0].attributes.isPublic,
                        lastModifiedDate:
                            data.data[0].attributes.lastModifiedDate,
                        name: playlistName,
                    },
                    href: data.data[0].href,
                    id: data.data[0].id,
                    type: 'library-playlists',
                }
                if (libraryPlaylists) {
                    setLibraryPlaylists([newPlaylist, ...libraryPlaylists])
                } else {
                    setLibraryPlaylists([newPlaylist])
                }
            }
        } catch (error: any) {
            console.error(error)
            toast.error('An error occurred..')
        } finally {
            onClose()
            setPlaylistName('')
            setPlaylistDescription('')
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-40"></div>
            <div className="bg-slate-600 rounded-lg p-6 w-full max-w-md z-50">
                <h2 className="text-2xl mb-4">Create New Playlist</h2>
                <form>
                    <div className="mb-4 gap-4 ">
                        <label
                            className="block text-sm font-bold mb-2"
                            htmlFor="playlistName"
                        >
                            Playlist name:
                        </label>
                        <input
                            type="text"
                            id="playlistName"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Enter playlist name..."
                            onChange={e => setPlaylistName(e.target.value)}
                            value={playlistName}
                        />
                        <label
                            className="block text-sm pt-4 font-bold mb-2"
                            htmlFor="playlistDescription"
                        >
                            Description:
                        </label>
                        <input
                            type="text"
                            id="playlistDescription"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Enter playlist description..."
                            onChange={e =>
                                setPlaylistDescription(e.target.value)
                            }
                            value={playlistDescription}
                        />
                    </div>
                    <div className="flex justify-center">
                        <button
                            type="button"
                            className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                            onClick={e => createPlaylist(e)}
                        >
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreatePlaylistModal
