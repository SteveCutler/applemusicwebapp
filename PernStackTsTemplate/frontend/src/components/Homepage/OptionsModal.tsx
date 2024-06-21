import React from 'react'
import { SlOptions } from 'react-icons/sl'
import { useStore } from '../../store/store'
import { toast } from 'react-hot-toast'
import { IoHeartDislikeCircleOutline } from 'react-icons/io5'
import { IoHeartCircleOutline } from 'react-icons/io5'

interface OptionsProps {
    name: string
    type: string
    id: string
}

const OptionsModal: React.FC<OptionsProps> = ({ name, type, id }) => {
    const style = { fontSize: '1.5rem', color: 'white' }
    const { musicKitInstance, authorizeMusicKit, appleMusicToken } = useStore(
        state => ({
            authorizeMusicKit: state.authorizeMusicKit,
            appleMusicToken: state.appleMusicToken,
            musicKitInstance: state.musicKitInstance,
        })
    )

    const addToLibrary = async (e: React.MouseEvent) => {
        e.stopPropagation()
        if (!musicKitInstance) {
            return
        }
        if (
            id.startsWith('l') ||
            id.startsWith('i') ||
            (id.startsWith('p') && !id.startsWith('pl'))
        ) {
            toast.error(`${name} is already in your library!`)
            return
        }
        try {
            const params = { [type]: [id] }
            const queryParameters = { ids: params }
            const { response } = await musicKitInstance.api.music(
                '/v1/me/library',
                queryParameters,
                { fetchOptions: { method: 'POST' } }
            )

            if ((await response.status) === 202) {
                toast.success(`${name} added to library!`)
                return
            }
        } catch (error) {
            toast.error(`Error adding ${name} to library...`)
            return
        }
    }

    const addFavorite = async (e: React.MouseEvent) => {
        e.stopPropagation()
        if (!musicKitInstance) {
            return
        }
        if (!appleMusicToken) {
            toast.error('Apple Music Token is missing')
            return
        }

        try {
            const response = await fetch(
                `https://api.music.apple.com/v1/me/ratings/${type}/${id}`,
                {
                    method: 'PUT',

                    headers: {
                        Authorization: `Bearer ${
                            import.meta.env.VITE_MUSICKIT_DEVELOPER_TOKEN
                        }`,
                        'Music-User-Token': appleMusicToken, // Add Music User Token here
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        type: 'rating',
                        attributes: {
                            value: 1,
                        },
                    }),
                }
            )

            //api.music.apple.com/v1/me/ratings/albums/1138988512

            console.log('response: ', response)

            if (response.status === 200) {
                toast.success(`${name} added to favorites`)
            } else {
                toast.error(`Error adding ${name} to favorites...`)
            }
        } catch (error) {
            toast.error(`Error adding ${name} to favorites...`)
        }
    }
    const addDislike = async (e: React.MouseEvent) => {
        e.stopPropagation()
        if (!musicKitInstance) {
            return
        }
        if (!appleMusicToken) {
            toast.error('Apple Music Token is missing')
            return
        }

        try {
            const response = await fetch(
                `https://api.music.apple.com/v1/me/ratings/${type}/${id}`,
                {
                    method: 'PUT',

                    headers: {
                        Authorization: `Bearer ${
                            import.meta.env.VITE_MUSICKIT_DEVELOPER_TOKEN
                        }`,
                        'Music-User-Token': appleMusicToken, // Add Music User Token here
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        type: 'rating',
                        attributes: {
                            value: -1,
                        },
                    }),
                }
            )

            //api.music.apple.com/v1/me/ratings/albums/1138988512

            console.log('response: ', response)

            if (response.status === 200) {
                toast.success(`${name} added to dislikes`)
            } else {
                toast.error(`Error adding ${name} to dislikes...`)
            }
        } catch (error) {
            toast.error(`Error adding ${name} to dislikes...`)
        }
    }

    const handleClick = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        e.preventDefault()
        e.stopPropagation() // Prevents the click from propagating to the parent elements

        addToLibrary(e)
        console.log('click')
    }

    return (
        <div
            onClick={async e => {
                e.preventDefault()
                e.stopPropagation() // Prevents the link's default behavior
                // await FetchAlbumData(albumId)
                // handlePlayPause()
            }}
            className=" dropdown  "
        >
            <div
                tabIndex={0}
                role="button"
                className=" bg-slate-400 transform  relative z-50000 rounded-full justify-right hover:scale-110 active:scale-95 transition-transform duration-100 easy-ease p-1"
                onClick={async e => {
                    e.preventDefault()
                    e.stopPropagation() // Prevents the link's default behavior
                    // await FetchAlbumData(albumId)
                    // handlePlayPause()
                }}
            >
                <SlOptions style={style} />
            </div>
            <ul
                tabIndex={0}
                className="dropdown-content font-bold bottom-0 menu p-2 shadow w-fit bg-base-100 rounded-box"
            >
                <li className="w-full flex justify-between items-center">
                    <div
                        className=" justify-center items-center w-1/2"
                        onClick={async e => {
                            addFavorite(e)
                        }}
                    >
                        <IoHeartCircleOutline style={style} />
                    </div>
                    <div
                        className=" justify-center items-center w-1/2"
                        onClick={async e => {
                            addDislike(e)
                        }}
                    >
                        <IoHeartDislikeCircleOutline style={style} />
                    </div>
                </li>
                <li
                    onClick={e => {
                        addToLibrary(e)
                    }}
                    className="w-fit"
                >
                    <div>Add to Library</div>
                </li>
                <li
                    onClick={async e => {
                        e.preventDefault()
                        e.stopPropagation() // Prevents the link's default behavior
                        // await FetchAlbumData(albumId)
                        // handlePlayPause()
                        console.log('click')
                    }}
                    className="w-fit"
                >
                    <a
                        onClick={() => {
                            console.log('click')
                        }}
                    >
                        Add to Playlist
                    </a>
                </li>
            </ul>
        </div>
        // <details className="dropdown rounded-full p-1 bg-slate-400">
        //     <summary>
        //
        //     </summary>
        //     <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
        //         <li>
        //             <a>Item 1</a>
        //         </li>
        //         <li>
        //             <a>Item 2</a>
        //         </li>
        //     </ul>
        // </details>
    )
}

export default OptionsModal
