import React, { useState } from 'react'
import { FaCaretDown, FaCaretUp, FaCirclePlay } from 'react-icons/fa6'
import { useStore } from '../../store/store'
import parse from 'html-react-parser'

interface listItemProp {
    podcast: podcastEpisode
    title: string
    id: number
}

interface podcastEpisode {
    dateCrawled: number
    datePublished: number
    datePublishedPretty: string
    description: string
    duration: number
    enclosureLength: number
    enclosureType: string
    enclosureUrl: string
    episodeType: string
    explicit: number
    feedDead: number
    feedDuplicateOf: number
    feedId: number
    feedImage: string
    feedItunesId: number
    feedLanguage: string
    feedUrl: string
    guid: string
    id: number
    image: string
    link: string
    podcastGuid: string
    season: number
    title: string
}

const PodcastListItem: React.FC<listItemProp> = ({ podcast, title, id }) => {
    const { darkMode, queueToggle, playPodcast } = useStore(state => ({
        queueToggle: state.queueToggle,
        playPodcast: state.playPodcast,
        darkMode: state.darkMode,
    }))

    const [expandDescription, setExpandDescription] = useState(false)

    const handlePlayPodcast = async () => {
        if (podcast) {
            playPodcast(
                podcast.enclosureUrl,
                podcast.duration,
                podcast.feedImage,
                podcast.title,
                title,
                id
            )
        }
    }
    const styleButton = { fontSize: '1.2rem', color: 'dodgerblue' }

    const style = { fontSize: '1.5em' }

    function formatTime(sec: number) {
        // Calculate hours, minutes, and seconds
        let hours = Math.floor(sec / 3600)
        let minutes = Math.floor((sec % 3600) / 60)
        let seconds = sec % 60

        // Format hours, minutes, and seconds to be two digits if needed
        hours = hours.toString()
        minutes = minutes.toString()
        seconds = seconds.toString().padStart(2, '0')

        if (hours == 0) {
            return `${minutes}m`
        } else {
            return `${hours}h${minutes}m`
        }
    }
    return (
        <div
            className={`flex flex-col gap-2 select-none ${darkMode ? 'text-white bg-slate-700' : 'text-black bg-slate-300'} rounded-lg p-3 my-2 w-full`}
        >
            <div className="flex items-end px-3 pb-3 gap-2  ">
                <img src={podcast.feedImage} style={{ height: '70px' }} />
                <div className="flex flex-col w-10/12">
                    <div className="font-semibold truncate">
                        {podcast.title}
                    </div>
                    <div className="flex items-center gap-2">
                        <div
                            className="hover:scale-110 active:scale-90 hover:cursor-pointer text-blue-600 hover:text-blue-400"
                            onClick={handlePlayPodcast}
                        >
                            <FaCirclePlay style={styleButton} />
                        </div>
                        <div>{formatTime(podcast.duration)}</div>
                    </div>
                    <div>{podcast.datePublishedPretty}</div>
                </div>
            </div>

            {/* className={` ${expandDescription ? 'line-clamp-none overflow-auto' : 'line-clamp-5'} select-none`} */}
            <div
                className={` px-1  ${expandDescription ? 'line-clamp-none overflow-auto' : 'line-clamp-3'} select-none`}
            >
                {parse(podcast.description)}
            </div>
            <button
                onClick={e => {
                    e.preventDefault()
                    setExpandDescription(!expandDescription)
                }}
                className="  rounded-b-lg  w-2/12 mx-auto md:flex justify-center items-center flex-col mt-3 bg-blue-500 hover:bg-blue-400 active:bg-blue-600"
            >
                {expandDescription ? (
                    <div className="mx-auto flex-col justify-center py-2 items-center flex text-slate-300 font-bold text-sm">
                        <FaCaretUp style={style} />
                    </div>
                ) : (
                    <div className="mx-auto flex-col justify-center items-center flex text-slate-300 font-bold text-sm">
                        Show more
                        <FaCaretDown style={style} />
                    </div>
                )}
            </button>
        </div>
    )
}

export default PodcastListItem