import React, { useEffect } from 'react'
import { useStore } from '../../store/store'
import CollapsibleList from '../Apple/CollapsibleList'
import CollapsibleListFavs from '../Apple/CollapsibleListFavs'

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
        ratedAt?: Date
    }
}

const SidebarFavouriteSongs = () => {
    const {
        favouriteSongs,
        libraryPlaylists,
        setFavouriteSongs,
        backendToken,
        appleMusicToken,
    } = useStore(state => ({
        favouriteSongs: state.favouriteSongs,
        libraryPlaylists: state.libraryPlaylists,
        setFavouriteSongs: state.setFavouriteSongs,
        backendToken: state.backendToken,
        appleMusicToken: state.appleMusicToken,
    }))

    const userId = backendToken

    useEffect(() => {
        const fetchFavouriteSongs = async () => {
            console.log('test')
            try {
                const res = await fetch(
                    'https://mus-backend-b262ef3b1b65.herokuapp.com/api/apple/get-ratings',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            userId,
                        }),

                        credentials: 'include',
                    }
                )

                // const data = await res
                console.log('fav songs: ', res)
                if (res.status === 200) {
                    const data = await res.json()
                    console.log('fav songs data: ', data.data.slice(0, 15))

                    const sortedFavs = data.data.sort((a: Song, b: Song) => {
                        const dateA: Date = a.attributes.ratedAt
                            ? new Date(a.attributes.ratedAt)
                            : new Date(0) // Default to epoch if undefined
                        const dateB: Date = b.attributes.ratedAt
                            ? new Date(b.attributes.ratedAt)
                            : new Date(0) // Default to epoch if undefined
                        return dateB.getTime() - dateA.getTime() // For ascending order
                        // return dateB.getTime() - dateA.getTime(); // For descending order
                    })
                    console.log('sorted favs', sortedFavs)

                    setFavouriteSongs(sortedFavs)
                    console.log('success')
                }
            } catch (error) {
                console.error(error)
                console.log('failure')
            }
        }

        // if (!favouriteSongs && backendToken) {
        //     fetchFavouriteSongs()
        // }
        // if(favouriteSongs && libraryPlaylists){
        //     //check for favourite songs playlist
        //     if()
        // }
    }, [backendToken, favouriteSongs])

    return <></>
}

export default SidebarFavouriteSongs
