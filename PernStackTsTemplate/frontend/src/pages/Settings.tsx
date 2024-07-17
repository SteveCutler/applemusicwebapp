import { useState } from 'react'
import { useStore } from '../store/store'
import ImportPodcasts from '../components/Homepage/ImportPodcasts'

const Settings = () => {
    const {
        darkMode,
        queueToggle,
        albums,
        backendToken,
        appleMusicToken,
        setAlbums,
    } = useStore(state => ({
        albums: state.albums,
        backendToken: state.backendToken,
        appleMusicToken: state.appleMusicToken,
        setAlbums: state.setAlbums,
        darkMode: state.darkMode,
        queueToggle: state.queueToggle,
    }))

    const [loadingLibrary, setLoadingLibrary] = useState(false)
    const [libSuccess, setLibSuccess] = useState(false)
    const [lib, setLib] = useState(false)
    const [loadingLibraryError, setLoadingLibraryError] = useState<
        string | null
    >(null)

    const syncLibrary = async () => {
        setLoadingLibrary(true)
        const userId = backendToken
        try {
            const res = await fetch(
                'https://mus-backend-b262ef3b1b65.herokuapp.com/api/apple/fetch-albums',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, appleMusicToken }),
                    credentials: 'include',
                }
            )

            const data = await res.json()
            setAlbums(data.albums)
            setLibSuccess(true)
            setLoadingLibrary(false)
        } catch (error) {
            setLoadingLibraryError('Failed to fetch albums')
            setLoadingLibrary(false)
        }
    }

    return (
        <div
            className={`flex-col font-semibold flex w-11/12 gap-5 ${darkMode ? 'text-white' : 'text-black'} justify-start`}
        >
            <h1 className="text-3xl w-11/12 mx-auto font-bold italic">
                Account Settings
            </h1>
            <div>Dark mode</div>

            <div>music kit bitate</div>
            <div className="text-xl font-bold italic">Sync Library</div>
            <button
                onClick={e => {
                    loadingLibrary
                        ? e.preventDefault()
                        : libSuccess
                          ? e.preventDefault()
                          : e.preventDefault()
                    syncLibrary()
                }}
                className={`rounded-full py-2 w-96 px-4 ${loadingLibrary ? 'hover:cursor-default' : libSuccess ? '' : 'hover:bg-blue-600 hover:cursor-default active:scale-95'} ${libSuccess ? 'bg-white text-green-400' : ''} text-md font-bold bg-blue-500 text-white  btn-info`}
            >
                {libSuccess
                    ? 'success!'
                    : loadingLibrary
                      ? 'syncing...'
                      : loadingLibraryError
                        ? 'error'
                        : 'Sync Library'}
            </button>

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
