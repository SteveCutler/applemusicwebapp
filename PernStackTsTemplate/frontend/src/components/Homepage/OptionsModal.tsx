import React from 'react'
import { SlOptions } from 'react-icons/sl'
import { useStore } from '../../store/store'
import { toast } from 'react-hot-toast'

interface OptionsProps {
    name: string
    type: string
    id: string
}

const OptionsModal: React.FC<OptionsProps> = ({ name, type, id }) => {
    const style = { fontSize: '1.5rem', color: 'white' }
    const { musicKitInstance, authorizeMusicKit } = useStore(state => ({
        authorizeMusicKit: state.authorizeMusicKit,
        musicKitInstance: state.musicKitInstance,
    }))

    const addToLibrary = async (e: React.MouseEvent) => {
        e.stopPropagation()
        if (!musicKitInstance) {
            return
        }
        try {
            const res = await musicKitInstance.api.music(
                `/v1/me/library?ids${type}=${id}`,
                {
                    method: 'POST',
                }
            )

            console.log('res: ', res)
            const data = await res
            console.log('data: ', data)

            if (res.status === 202) {
                toast.success(`${name} successfully added to library!`)
            }
        } catch (error) {
            toast.error(`Error adding ${name} to library...`)
        }
    }

    const handleClick = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        e.stopPropagation() // Prevents the click from propagating to the parent elements
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
                className=" bg-slate-400 transform  relative rounded-full justify-right hover:scale-110 active:scale-95 transition-transform duration-100 easy-ease p-1"
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
                className="dropdown-content font-bold z-[50000] relative bottom-0 menu p-2 shadow w-fit bg-base-100  rounded-box "
                onClick={async e => {
                    e.preventDefault()
                    e.stopPropagation() // Prevents the link's default behavior
                    // await FetchAlbumData(albumId)
                    // handlePlayPause()
                }}
            >
                <li className="w-fit">
                    <div
                        onClick={async e => {
                            e.preventDefault()
                            e.stopPropagation() // Prevents the link's default behavior
                            // await FetchAlbumData(albumId)
                            // handlePlayPause()
                        }}
                    >
                        Like
                    </div>
                </li>
                <li className="w-fit">
                    <div
                        onClick={async e => {
                            e.preventDefault()
                            e.stopPropagation() // Prevents the link's default behavior
                            // await FetchAlbumData(albumId)
                            handleClick
                            console.log('click')
                            // handlePlayPause()
                        }}
                    >
                        Add to Library
                    </div>
                </li>
                <li
                    onClick={async e => {
                        e.preventDefault()
                        e.stopPropagation() // Prevents the link's default behavior
                        // await FetchAlbumData(albumId)
                        // handlePlayPause()
                    }}
                    className="w-fit"
                >
                    <a>Add to Playlist</a>
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
