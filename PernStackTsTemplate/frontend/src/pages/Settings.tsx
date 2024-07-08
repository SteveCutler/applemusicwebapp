import { useState } from 'react'
import { useStore } from '../store/store'

const Settings = () => {
    const { darkMode, queueToggle } = useStore(state => ({
        darkMode: state.darkMode,
        queueToggle: state.queueToggle,
    }))
    return (
        <div
            className={`flex-col font-semibold flex w-11/12 gap-5 ${darkMode ? 'text-white' : 'text-black'} justify-start`}
        >
            <h1 className="text-3xl w-11/12 mx-auto font-bold italic">
                Account Settings
            </h1>
            <div>Dark mode</div>

            <div>music kit bitate</div>
            <div>Sync</div>
        </div>
    )
}

export default Settings
