import { useStore } from '../../store/store'
import { useState } from 'react'

const Timeline = () => {
    let {
        currentSongDuration,
        currentElapsedTime,
        musicKitInstance,
        currentSongId,
        setCurrentElapsedTime,
        scrubTime,
        setScrubTime,
    } = useStore(state => ({
        currentSongDuration: state.currentSongDuration,
        currentSongId: state.currentSongId,
        scrubTime: state.scrubTime,
        setScrubTime: state.setScrubTime,
        setCurrentElapsedTime: state.setCurrentElapsedTime,
        currentElapsedTime: state.currentElapsedTime,
        musicKitInstance: state.musicKitInstance,
    }))

    const handleScrub = (e: any) => {
        console.log('scrubbing')
        if (musicKitInstance) {
            setScrubTime(e.target.value)
        }
    }

    const handleScrubEnd = (e: any) => {
        if (musicKitInstance && scrubTime) {
            setCurrentElapsedTime(scrubTime / 1000)
            musicKitInstance.seekToTime(scrubTime / 1000)
        }
        // setScrubTime(null)
    }

    return (
        <>
            <input
                type="range"
                min={0}
                max={currentSongDuration ? String(currentSongDuration) : '100'}
                value={
                    scrubTime
                        ? scrubTime
                        : currentElapsedTime
                          ? String(currentElapsedTime)
                          : '0'
                }
                // value={currentElapsedTime ? String(currentElapsedTime) : '0'}
                className="range range-xs mb-5 range-info flex"
                onChange={handleScrub}
                onMouseUp={handleScrubEnd}
                onTouchEnd={handleScrubEnd}
            />
        </>
    )
}

export default Timeline
