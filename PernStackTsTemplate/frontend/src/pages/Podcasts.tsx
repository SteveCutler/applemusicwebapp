import React from 'react'
import { useStore } from '../store/store'

const Podcasts = () => {
    const { darkMode } = useStore(state => ({
        darkMode: state.darkMode,
    }))
    return (
        <div
            className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-black'}`}
        >
            Podcasts
        </div>
    )
}

export default Podcasts
