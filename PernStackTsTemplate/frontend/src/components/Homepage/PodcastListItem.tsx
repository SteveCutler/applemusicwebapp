import React, { useState } from 'react'
import { FaCaretDown, FaCaretUp, FaCirclePlay } from 'react-icons/fa6'
import { useStore } from '../../store/store'

interface listItemProp {
    podcast: podcastEpisode
}

interface podcastEpisode {
    artistIds: Array<string>
    artworkUrl160: string
    artworkUrl60: string
    artworkUrl600: string
    closedCaptioning: string
    collectionId: number
    collectionName: string
    collectionViewUrl: string
    contentAdvisoryRating: string
    country: string
    description: string
    episodeContentType: string
    episodeFileExtension: string
    episodeGuid: string
    episodeUrl: string
    feedUrl: string
    genres: Array<{
        id: string
        name: string
    }>
    kind: string
    previewUrl: string
    releaseDate: string
    shortDescription: string
    trackId: number
    trackName: string
    trackTimeMillis: number
    trackViewUrl: string
    wrapperType: string
}

const PodcastListItem: React.FC<listItemProp> = ({ podcast }) => {
    const { darkMode, queueToggle } = useStore(state => ({
        queueToggle: state.queueToggle,
        darkMode: state.darkMode,
    }))

    const [expandDescription, setExpandDescription] = useState(false)

    const styleButton = { fontSize: '1rem' }

    const style = { fontSize: '1.5em' }

    function formatTime(ms: number) {
        // Calculate hours, minutes, and seconds
        let hours = Math.floor(ms / 3600000)
        let minutes = Math.floor((ms % 3600000) / 60000)
        let seconds = Math.floor((ms % 60000) / 1000)

        // Format hours, minutes, and seconds to be two digits if needed
        hours = hours.toString()
        minutes = minutes.toString().padStart(2, '0')
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
                <img src={podcast.artworkUrl160} style={{ height: '70px' }} />
                <div className="flex flex-col w-10/12">
                    <div className="font-semibold truncate">
                        {podcast.trackName}
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="hover:scale-115 active:scale-90 hover:cursor-pointer text-blue-600 hover:text-blue-400">
                            <FaCirclePlay style={styleButton} />
                        </div>
                        <div>{formatTime(podcast.trackTimeMillis)}</div>
                    </div>
                    <div>{podcast.releaseDate.split('T')[0]}</div>
                </div>
            </div>

            {/* className={` ${expandDescription ? 'line-clamp-none overflow-auto' : 'line-clamp-5'} select-none`} */}
            <div
                className={` px-1  ${expandDescription ? 'line-clamp-none overflow-auto' : 'line-clamp-3'} select-none`}
            >
                {podcast.description}
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
