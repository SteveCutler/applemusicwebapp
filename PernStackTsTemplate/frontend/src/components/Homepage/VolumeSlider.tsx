import React from 'react'
import { RiVolumeVibrateLine } from 'react-icons/ri'
import { FiVolume } from 'react-icons/fi'
import { useStore } from '../../store/store'

const VolumeSlider = () => {
    const { volume, setCurrrentVolume, musicKitInstance, muted, setMuted } =
        useStore(state => ({
            volume: state.volume,
            muted: state.muted,
            setMuted: state.setMuted,
            setCurrrentVolume: state.setCurrentVolume,
            musicKitInstance: state.musicKitInstance,
        }))

    console.log('currentVolume: ', volume)
    const handleChange = (e: any) => {
        setCurrrentVolume(e.target.value)
    }
    const style = { fontSize: '1.5rem' }

    const muteHandler = () => {
        if (muted) {
            setMuted(false)
        } else {
            setMuted(true)
        }
    }
    return (
        <div className="flex items-center gap-2 justify-between ">
            <div
                onClick={muteHandler}
                className="hover: cursor-pointer hover:text-white w-1/5"
            >
                {volume == 0 ? (
                    <FiVolume style={style} />
                ) : (
                    <RiVolumeVibrateLine style={style} />
                )}
            </div>
            <div className="w-full flex">
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    className="range-xs range range-info"
                    onChange={handleChange}
                />
            </div>
        </div>
    )
}

export default VolumeSlider
