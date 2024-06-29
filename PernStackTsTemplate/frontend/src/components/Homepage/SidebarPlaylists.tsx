import React, { useEffect, useState } from 'react'
import { useStore } from '../../store/store'
import PlaylistRow from './PlaylistRow'
import { PiPlaylistBold } from 'react-icons/pi'
import CollapsibleListPlaylist from '../Apple/CollapsibleListPlaylist'
import { CiCirclePlus } from 'react-icons/ci'
import CreatePlaylistModal from './CreatePlaylistModal'
// import { fetchLibraryPlaylists } from '../Apple/FetchLibraryPlaylists'

type playlist = {
    attributes: {
        canEdit: boolean
        dataAdded: string
        isPublic: boolean
        lastModifiedDate: string
        name: string
    }
    href: string
    id: string
    type: string
}
// const handleClick = () => {
//     console.log('launch modal')
// }

const SidebarPlaylists = () => {
    const {
        libraryPlaylists,
        setLibraryPlaylists,
        musicKitInstance,
        authorizeMusicKit,
    } = useStore(state => ({
        libraryPlaylists: state.libraryPlaylists,
        setLibraryPlaylists: state.setLibraryPlaylists,
        musicKitInstance: state.musicKitInstance,
        authorizeMusicKit: state.authorizeMusicKit,
    }))

    const [isModalOpen, setIsModalOpen] = useState(false)
    const fetchLibraryPlaylists = async () => {
        if (!musicKitInstance) {
            await authorizeMusicKit()
            return
        }

        try {
            try {
                const res = await musicKitInstance.api.music(
                    '/v1/me/library/playlists'
                )
                const playlists: Array<playlist> = res.data.data
                console.log('User Playlists:', playlists)

                setLibraryPlaylists(playlists)
            } catch (error: any) {
                console.error(error)
                // setError(error)
            } finally {
                // setLoading(false)
            }
        } catch (error: any) {
            console.error(error)
        } finally {
            // setLoading(false)
        }
    }

    useEffect(() => {
        if (libraryPlaylists === null) {
            fetchLibraryPlaylists()
        }
    }, [musicKitInstance])

    const style = { fontSize: '2rem' }

    return (
        <></>
        // <div className="flex-col w-full">
        //     <p className=" flex font-semibold text-2xl pb-2 w-full select-none border-slate-600 justify-center gap-2 items-center">
        //         <PiPlaylistBold style={style} />
        //         Playlists
        //         <div
        //             className="hover:cursor-pointer  rounded-full hover:bg-slate-200 hover:text-slate-700 hover:scale-110 active:scale-95"
        //             onClick={() => {
        //                 setIsModalOpen(true)
        //             }}
        //         >
        //             <CiCirclePlus />
        //         </div>
        //     </p>
        //     {libraryPlaylists && (
        //         <CollapsibleListPlaylist items={libraryPlaylists} />
        //     )}

        //     <CreatePlaylistModal
        //         isOpen={isModalOpen}
        //         onClose={() => setIsModalOpen(false)}
        //     />
        // </div>
    )
}

export default SidebarPlaylists
