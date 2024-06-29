import React, { useEffect } from 'react'
import { useStore } from '../../store/store'
import CollapsibleList from '../Apple/CollapsibleList'
import CollapsibleListFavs from '../Apple/CollapsibleListFavs'
import { ActivityIcon } from 'lucide-react'
import ActivityRow from './ActivityRow'

interface ActivityProp {
    type: string
}
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

const SidebarActivity: React.FC<ActivityProp> = ({ type }) => {
    const {
        favouriteSongs,
        libraryPlaylists,
        backendToken,
        recentActivity,
        setRecentActivity,
        musicKitInstance,
    } = useStore(state => ({
        favouriteSongs: state.favouriteSongs,
        libraryPlaylists: state.libraryPlaylists,
        recentActivity: state.recentActivity,
        setRecentActivity: state.setRecentActivity,
        musicKitInstance: state.musicKitInstance,
        setFavouriteSongs: state.setFavouriteSongs,
        backendToken: state.backendToken,
        appleMusicToken: state.appleMusicToken,
    }))

    const userId = backendToken

    useEffect(() => {
        const fetchRecentActivity = async () => {
            console.log(' history test')
            try {
                const res = await musicKitInstance?.api.music(
                    '/v1/me/recent/played'
                )

                // const data = await res.json()
                console.log('response activity: ', res.data.data)

                setRecentActivity(res.data.data)

                // console.log('activity: ', data)
            } catch (error: any) {
                console.error(error)
                // setError(error)
            } finally {
                // setLoading(false)
            }
        }

        if (musicKitInstance) {
            fetchRecentActivity()
        }
        //
    }, [musicKitInstance])

    switch (type) {
        case 'likes':
            if (recentActivity) {
                return (
                    <div className="w-full  border-2 flex text-sm  font-normal flex-col text-white border-slate-600 h-full rounded-md bg-slate-900">
                        {favouriteSongs?.map(item => (
                            <ActivityRow item={item} />
                        ))}
                        {/* {recentActivity && <CollapsibleListFavs items={recentActivity} />} */}
                    </div>
                )
            }
            break
        case 'playlists':
            if (libraryPlaylists) {
                return (
                    <div className="w-full  border-2 flex text-sm  font-normal flex-col text-white border-slate-600 h-full rounded-md bg-slate-900">
                        {libraryPlaylists?.map(item => (
                            <ActivityRow item={item} />
                        ))}
                        {/* {recentActivity && <CollapsibleListFavs items={recentActivity} />} */}
                    </div>
                )
            }
            break
        case 'library':
            if (recentActivity) {
                return (
                    <div className="w-full  border-2 flex text-sm  font-normal flex-col text-white border-slate-600 h-full rounded-md bg-slate-900">
                        {recentActivity.map(item => (
                            <ActivityRow item={item} />
                        ))}
                        {/* {recentActivity && <CollapsibleListFavs items={recentActivity} />} */}
                    </div>
                )
            }
            break

        case 'history':
            if (recentActivity) {
                return (
                    <div className="w-full  border-2 flex text-sm  font-normal flex-col text-white border-slate-600 h-full rounded-md bg-slate-900">
                        {recentActivity.map(item => (
                            <ActivityRow item={item} />
                        ))}
                        {/* {recentActivity && <CollapsibleListFavs items={recentActivity} />} */}
                    </div>
                )
            }

            break

        default:
            break
    }
}

export default SidebarActivity
