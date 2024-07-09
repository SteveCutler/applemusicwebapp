import React, { useEffect, useState } from 'react'
import { useStore } from '../store/store'
import toast from 'react-hot-toast'
import PodcastItem from '../components/Homepage/PodcastItem'

const Podcasts = () => {
    const { darkMode, backendToken, podSubs, queueToggle, setPodSubs } =
        useStore(state => ({
            darkMode: state.darkMode,
            queueToggle: state.queueToggle,
            podSubs: state.podSubs,
            setPodSubs: state.setPodSubs,
            backendToken: state.backendToken,
        }))

    const [loading, setLoading] = useState(false)
    useEffect(() => {
        const getSubs = async () => {
            setLoading(true)
            const userId = backendToken
            try {
                const response = await fetch(
                    'http://localhost:5000/api/podcast/get-subs',

                    {
                        method: 'POST',
                        headers: {
                            'Content-type': 'application/json',
                        },
                        body: JSON.stringify({
                            userId,
                        }),
                        credentials: 'include',
                    }
                )

                const data = await response.json()

                setPodSubs(data)
                setLoading(false)
            } catch (error) {
                console.error('Error subscribing to podcast:', error)
                setLoading(false)
                toast.error('Error retrieving podcasts..')
            }
        }
        if (!podSubs) {
            getSubs()
        }
    }, [podSubs])
    if (loading) {
        return <div>loading</div>
    }
    return (
        <div className={`flex flex-col`}>
            {podSubs && (
                <div
                    className={`text-xl font-bold w-11/12 border-b-2 pb-2 mb-4 flex mx-auto ${darkMode ? 'text-white border-white' : 'text-black border-black'}`}
                >
                    <div className="px-5">Subscriptions</div>
                </div>
            )}
            <div className="flex flex-wrap justify-center w-fit gap-1 ">
                {podSubs &&
                    podSubs.map((sub, index) => (
                        <PodcastItem
                            key={index}
                            podcast={sub}
                            sub={true}
                            width={` ${queueToggle ? 'w-full md:w-5/12 lg:w-3/12 2xl:w-2/12' : 'w-full md:w-5/12 lg:w-3/12 xl:w-2/12 2xl:w-1/12 '} `}
                        />
                    ))}
            </div>
        </div>
    )
}

export default Podcasts
