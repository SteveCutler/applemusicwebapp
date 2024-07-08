import { useEffect } from 'react'
import { useStore } from '../../store/store'

export const usePodcastPlayer = () => {
    const {
        podcastUrl,
        isPlayingPodcast,
        playPodcast,
        pausePodcast,
        stopPodcast,
        updatePodcastTime,
        setPodcastDuration,
        podcastAudio,
    } = useStore(state => ({
        podcastUrl: state.podcastUrl,
        isPlayingPodcast: state.isPlayingPodcast,
        playPodcast: state.playPodcast,
        pausePodcast: state.pausePodcast,
        stopPodcast: state.stopPodcast,
        updatePodcastTime: state.updatePodcastTime,
        setPodcastDuration: state.setPodcastDuration,
        podcastAudio: state.podcastAudio,
    }))

    useEffect(() => {
        if (podcastAudio && podcastUrl) {
            podcastAudio.src = podcastUrl
            if (isPlayingPodcast) {
                podcastAudio.play()
                podcastAudio.ontimeupdate = () =>
                    updatePodcastTime(podcastAudio.currentTime)
                podcastAudio.onloadedmetadata = () =>
                    setPodcastDuration(podcastAudio.duration)
                podcastAudio.onended = () => stopPodcast()
            } else {
                podcastAudio.pause()
            }

            return () => {
                podcastAudio.pause()
                podcastAudio.ontimeupdate = null
                podcastAudio.onloadedmetadata = null
                podcastAudio.onended = null
            }
        }
    }, [
        isPlayingPodcast,
        podcastUrl,
        podcastAudio,
        updatePodcastTime,
        setPodcastDuration,
        stopPodcast,
    ])

    return { playPodcast, pausePodcast, stopPodcast }
}
