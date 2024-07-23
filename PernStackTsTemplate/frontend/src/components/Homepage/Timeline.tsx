import { useStore } from '../../store/store'
import { useEffect, useState } from 'react'

const Timeline = () => {
    let {
        currentSongDuration,
        currentElapsedTime,
        musicKitInstance,
        currentSongId,
        currentTime,
        isPlayingPodcast,
        podcastDuration,
        seekPodcast,
        setCurrentElapsedTime,
        scrubTime,
        podcastAudio,
        scrubPod,
        setScrubPod,
        setScrubTime,
    } = useStore(state => ({
        podcastDuration: state.podcastDuration,
        scrubPod: state.scrubPod,
        setScrubPod: state.setScrubPod,
        podcastAudio: state.podcastAudio,
        seekPodcast: state.seekPodcast,
        currentTime: state.currentTime,
        isPlayingPodcast: state.isPlayingPodcast,
        currentSongDuration: state.currentSongDuration,
        currentSongId: state.currentSongId,
        scrubTime: state.scrubTime,
        setScrubTime: state.setScrubTime,
        setCurrentElapsedTime: state.setCurrentElapsedTime,
        currentElapsedTime: state.currentElapsedTime,
        musicKitInstance: state.musicKitInstance,
    }))

    const [scrubbing, setScrubbing] = useState(false)

    const handleScrub = (e: any) => {
        console.log('scrubbing')
        if (isPlayingPodcast) {
            // setScrubbing(true)
            setScrubPod(e.target.value)
        } else if (musicKitInstance) {
            setScrubTime(e.target.value)
        }
    }

    const handleScrubEnd = (e: any) => {
        if (isPlayingPodcast && scrubPod) {
            // seekPodcast(scrubPod)
            podcastAudio.currentTime = scrubPod
            setScrubPod(null)
            // setScrubbing(false)
        } else if (musicKitInstance && scrubTime) {
            // setCurrentElapsedTime(scrubTime / 1000)
            musicKitInstance.seekToTime(scrubTime / 1000)
        }

        // setScrubTime(null)
    }

    if (isPlayingPodcast) {
        return (
            <>
                <input
                    type="range"
                    min={0}
                    max={podcastDuration ? podcastDuration : '100'}
                    value={
                        scrubPod
                            ? scrubPod
                            : currentTime
                              ? currentTime.toFixed(0)
                              : '0'
                    }
                    className="range range-xs mb-2 range-info flex"
                    onChange={handleScrub}
                    onMouseUp={e => {
                        handleScrubEnd(e)
                        setScrubPod(null)
                    }}
                    onTouchEnd={e => {
                        handleScrubEnd(e)
                        setScrubPod(null)
                    }}
                />
            </>
        )
    } else {
        return (
            <>
                <input
                    type="range"
                    min={0}
                    max={
                        currentSongDuration
                            ? String(currentSongDuration)
                            : '100'
                    }
                    value={
                        scrubTime
                            ? scrubTime
                            : musicKitInstance?.currentPlaybackTime
                              ? String(
                                    Number(
                                        musicKitInstance?.currentPlaybackTime
                                    ) * 1000
                                )
                              : '0'
                    }
                    // value={currentElapsedTime ? String(currentElapsedTime) : '0'}
                    className="range range-xs mb-2 range-info flex"
                    onChange={handleScrub}
                    onMouseUp={handleScrubEnd}
                    onTouchEnd={handleScrubEnd}
                />
            </>
        )
    }
}

export default Timeline
