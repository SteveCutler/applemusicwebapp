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
    const { favouriteSongs, setFavouriteSongs, backendToken, appleMusicToken } =
        useStore(state => ({
            favouriteSongs: state.favouriteSongs,
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
                    'http://localhost:5000/api/apple/get-ratings',
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

                    setFavouriteSongs(sortedFavs.slice(0, 15))
                    console.log('success')
                }
            } catch (error) {
                console.error(error)
                console.log('failure')
            }
        }

        if (!favouriteSongs) {
            fetchFavouriteSongs()
        }
    }, [backendToken, favouriteSongs])

    return (
        <div>
            {favouriteSongs && <CollapsibleListFavs items={favouriteSongs} />}
        </div>
    )
}

export default SidebarFavouriteSongs
