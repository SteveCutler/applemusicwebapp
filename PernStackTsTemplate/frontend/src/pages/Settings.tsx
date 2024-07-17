import { useState } from 'react'
import { useStore } from '../store/store'
import ImportPodcasts from '../components/Homepage/ImportPodcasts'

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
            <div className="text-xl font-bold italic">Podcast Import</div>
            <div className="border-2 max-w-96 bg-blue-500 text-white border-white rounded-lg p-5">
                Use this tool to export a list of your podcast subscriptions and
                upload it below
                <a
                    href="https://www.icloud.com/shortcuts/44009520675540d7945263e088f6e915"
                    target="_blank" // Optional: Opens the link in a new tab
                    rel="noopener noreferrer" // Optional: Adds security for external links
                    className="block bg-white text-center hover:text-blue-600  active:scale-95 text-blue-400 p-1 mt-3 text-md rounded-full" // Replace with your button styles
                >
                    Podcast Export Tool
                </a>
            </div>
            <div className="flex justify-start w-fit">
                <ImportPodcasts />
            </div>
        </div>
    )
}

export default Settings
