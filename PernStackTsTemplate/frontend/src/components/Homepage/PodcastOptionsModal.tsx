import React, { useState } from 'react'
import { SlOptions } from 'react-icons/sl'
import { useStore } from '../../store/store'
import { toast } from 'react-hot-toast'
import { IoHeartDislikeCircleOutline } from 'react-icons/io5'
import { IoHeartCircleOutline } from 'react-icons/io5'
import axios from 'axios'

type podcastInfo = {
    artwork: string
    author: string
    categories: {
        [key: number]: string
    }
    contentType: string
    crawlErrors: number
    dead: number
    description: string
    episodeCount: number
    explicit: boolean
    generator: string
    id: number
    image: string
    imageUrlHash: number
    inPollingQueue: number
    itunesId: number
    language: string
    lastCrawlTime: number
    lastGoodHttpStatusTime: number
    lastHttpStatus: number
    lastParseTime: number
    lastUpdateTime: number
    link: string
    locked: number
    medium: string
    newestItemPubdate: number
    originalUrl: string
    ownerName: string
    parseErrors: number
    podcastGuid: string
    priority: number
    title: string
    type: number
    url: string
}

interface OptionsProps {
    id: string
    small?: boolean
    big?: boolean
}

const PodcastOptionsModal: React.FC<OptionsProps> = ({ id, small, big }) => {
    const style = { fontSize: '1.5rem', color: 'white' }
    const styleDark = { fontSize: '1.5rem', color: 'black' }

    const [isHovered, setIsHovered] = useState(false)

    const {
        musicKitInstance,
        authorizeMusicKit,
        darkMode,
        fetchAppleToken,
        libraryPlaylists,
        appleMusicToken,
        backendToken,
    } = useStore(state => ({
        darkMode: state.darkMode,
        fetchAppleToken: state.fetchAppleToken,
        libraryPlaylists: state.libraryPlaylists,
        authorizeMusicKit: state.authorizeMusicKit,
        backendToken: state.backendToken,
        appleMusicToken: state.appleMusicToken,
        musicKitInstance: state.musicKitInstance,
    }))

    const userId = backendToken
    // console.log('object', object)
    const [isOpen, setIsOpen] = useState(false)

    const followPodcast = () => {
        console.log('follow click')
    }

    const styleSmall = { fontSize: '1rem' }
    const styleBig = { fontSize: '2.3rem' }

    const subscribeToPodcast = async () => {
        try {
            const response = await fetch(
                'http://localhost:5000/api/podcast/subscribe',

                {
                    method: 'POST',

                    headers: {
                        'Content-type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId,
                        podcastIndexId: id,
                    }),
                    credentials: 'include',
                }
            )
            const data = await response.json()

            if (response.status === 200 || response.status === 201) {
                toast.success('Subscribed!')
            }
            console.log(response)
            console.log(data)
        } catch (error) {
            console.error('Error subscribing to podcast:', error)
            toast.error('Error subscribing..')
        }
    }

    return (
        <div
            onClick={async e => {
                e.preventDefault()
                e.stopPropagation() // Prevents the link's default behavior
                // await FetchAlbumData(albumId)
                // handlePlayPause()
            }}
            className={`dropdown ${darkMode ? 'text-slate-900 ' : 'text-white '} relative`}
        >
            <div className="relative z-10">
                <div
                    tabIndex={0}
                    role="button"
                    className="bg-slate-400 transform rounded-full relative justify-right hover:scale-110 active:scale-95 transition-transform duration-100 easy-ease p-1"
                    onClick={async e => {
                        e.preventDefault()
                        e.stopPropagation()
                        setIsOpen(!isOpen)
                        // Prevents the link's default behavior
                        // await FetchAlbumData(albumId)
                        // handlePlayPause()
                    }}
                >
                    {small ? (
                        <SlOptions style={styleSmall} />
                    ) : big ? (
                        <SlOptions style={styleBig} />
                    ) : (
                        <SlOptions style={style} />
                    )}
                </div>
            </div>

            {isOpen && (
                <ul
                    tabIndex={0}
                    className={`dropdown-content ${darkMode ? 'bg-slate-300' : 'bg-slate-800'} fixed z-50 font-bold -right-20 -translate-y-20 -translate-x-20  menu w-40 p-2 shadow-md rounded-box`}
                >
                    <li className="w-full flex justify-between items-center">
                        <a
                            className=" justify-center items-center w-full"
                            onClick={async e => {
                                subscribeToPodcast()
                                setIsOpen(!isOpen)
                            }}
                        >
                            Subscribe{' '}
                            <IoHeartCircleOutline
                                style={darkMode ? styleDark : style}
                            />
                        </a>
                    </li>
                </ul>
            )}
        </div>
    )
}

export default PodcastOptionsModal
