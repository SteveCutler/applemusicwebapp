import { useState, useEffect } from 'react'
import {
    FaCaretDown,
    FaCaretUp,
    FaCirclePause,
    FaCirclePlay,
} from 'react-icons/fa6'
import { useStore } from '../../store/store'
import parse from 'html-react-parser'
import { BsFillPatchCheckFill } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'

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
    const {
        darkMode,
        queueToggle,
        playPodcast,
        podcastProgress,
        isPlayingPodcast,
        epId,
        podcastAudio,
    } = useStore(state => ({
        isPlayingPodcast: state.isPlayingPodcast,
        epId: state.epId,
        podcastAudio: state.podcastAudio,
        queueToggle: state.queueToggle,
        playPodcast: state.playPodcast,
        darkMode: state.darkMode,
        podcastProgress: state.podcastProgress,
    }))

    const [expandDescription, setExpandDescription] = useState(false)

    const handlePlayPodcast = async () => {
        if (isPlayingPodcast && epId === podcast.id) {
            podcastAudio.paused ? podcastAudio.play() : podcastAudio.pause()
        } else {
            if (podcast) {
                playPodcast(
                    podcast.enclosureUrl,
                    podcast.duration,
                    podcast.feedImage,
                    podcast.title,
                    title,
                    id,
                    podcast.id
                )
            }
        }
    }

    const styleButton = { fontSize: '1.2rem', color: 'dodgerblue' }

    const style = { fontSize: '1.5em' }
    const styleSmall = { fontSize: '1em' }

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

    const getEpisodeProgress = (episodeId, listenedEpisodes) => {
        const episode = listenedEpisodes.find(
            episode => episode.episodeId === episodeId
        )
        return episode ? episode.progress : 0
    }
    const [progress, setProgress] = useState<number | null>(null)

    const navigate = useNavigate()
    useEffect(() => {
        const progressPercent = getEpisodeProgress(
            String(podcast.id),
            podcastProgress
        )

        const progress = Number(progressPercent)
        setProgress(progress)
    }, [])
    const handleNavigation = () => {
        navigate(`/podcast-episode/${podcast.id}`)
    }

    return (
        <div
            onClick={handleNavigation}
            className={`flex flex-col gap-2  select-none ${darkMode ? 'text-white bg-slate-700' : 'text-black bg-slate-300'} rounded-lg p-3 my-2 w-full`}
        >
            <div className="flex hover:cursor-pointer hover:text-slate-500 w-fit items-end px-3 pb-3 gap-2  ">
                <img src={podcast.feedImage} style={{ height: '70px' }} />
                <div className="flex flex-col w-10/12">
                    <div className="font-semibold truncate">
                        {podcast.title}
                    </div>
                    <div className="flex items-center gap-2">
                        <div
                            className="hover:scale-110 active:scale-90 hover:cursor-pointer text-blue-600 hover:text-blue-400"
                            onClick={e => {
                                e.preventDefault()
                                e.stopPropagation()
                                handlePlayPodcast()
                            }}
                        >
                            {isPlayingPodcast &&
                            podcast &&
                            epId === podcast.id &&
                            !podcastAudio.paused &&
                            !podcastAudio.ended ? (
                                <FaCirclePause style={styleButton} />
                            ) : (
                                <FaCirclePlay style={styleButton} />
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <div>{formatTime(podcast.duration)}</div>
                            {progress !== 0 && (
                                <div
                                    className={`${darkMode ? 'text-black' : 'text-white'}  bg-blue-400 p-1 w-fit font-bold text-xs  flex m-0 rounded-lg`}
                                >
                                    {progress < 99 ? (
                                        <div className="drop-shadow-md">
                                            {String(progress)}%
                                        </div>
                                    ) : (
                                        <div className="drop-shadow-md">
                                            {
                                                <BsFillPatchCheckFill
                                                    style={style}
                                                />
                                            }
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
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
