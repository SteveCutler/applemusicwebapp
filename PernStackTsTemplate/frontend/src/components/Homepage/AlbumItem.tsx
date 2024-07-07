import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../store/store'
import { FaCirclePlay } from 'react-icons/fa6'
import OptionsModal from './OptionsModal'
import defaultPlaylistArtwork from '../../assets/images/defaultPlaylistArtwork.png'
import axios from 'axios'

interface AlbumPropTypes {
    albumItem: AlbumData
    carousel?: boolean
    releaseDate?: string
    width?: string
    lib?: boolean
}

type AlbumData = {
    attributes: {
        artistName: string
        artwork: {
            bgColor: string
            url: string
        }
        editorialNotes: {
            short: string
            standard: string
        }
        genreName: Array<string>
        name: string
        trackCount: number
        url: string
    }
    href: string
    id: string
    type: string
}

const AlbumItem: React.FC<AlbumPropTypes> = ({
    albumItem,
    carousel,
    releaseDate,
    lib,
    width,
}) => {
    const constructImageUrl = (url: string, size: number) =>
        url.replace('{w}', size.toString()).replace('{h}', size.toString())
    const {
        isPlaying,
        authorizeMusicKit,
        queueToggle,
        backendToken,
        setPlaylist,
        darkMode,
        playSong,
        pause,
        playlist,
        musicKitInstance,
    } = useStore(state => ({
        darkMode: state.darkMode,
        backendToken: state.backendToken,
        isPlaying: state.isPlaying,
        pause: state.pauseSong,
        queueToggle: state.queueToggle,
        playSong: state.playSong,
        musicKitInstance: state.musicKitInstance,
        authorizeMusicKit: state.authorizeMusicKit,
        setPlaylist: state.setPlaylist,
        playlist: state.playlist,
    }))

    const [isHovered, setIsHovered] = useState(false)
    const [artworkUrl, setArtworkUrl] = useState(
        albumItem.attributes?.artwork?.url
    )
    const navigate = useNavigate()

    const fetchNewArtworkUrl = async () => {
        try {
            const res = await musicKitInstance?.api.music(
                `/v1/me/library/albums/${albumItem.id}`
            )
            const newArtworkUrl = res.data.data[0].attributes.artwork.url
            if (newArtworkUrl) {
                setArtworkUrl(newArtworkUrl)

                await axios.post(
                    'http://localhost:5000/api/apple/update-album-artwork',
                    {
                        albumId: albumItem.id,
                        newArtworkUrl: newArtworkUrl,
                    },
                    { withCredentials: true }
                )
            }
        } catch (error) {
            console.error('Error fetching new artwork URL:', error)
        }
    }

    useEffect(() => {
        const checkArtworkUrl = async () => {
            try {
                const response = await fetch(artworkUrl)
                if (!response.ok) {
                    await fetchNewArtworkUrl()
                }
            } catch (error) {
                console.error('Error checking artwork URL:', error)
            }
        }

        if (lib) {
            checkArtworkUrl()
        }
    }, [artworkUrl, lib])

    const playData = async () => {
        if (musicKitInstance) {
            await musicKitInstance.setQueue({
                album: albumItem.id,
                startWith: 0,
                startPlaying: true,
            })
        }
    }

    const handleNavigation = async (e: any) => {
        e.preventDefault()
        e.stopPropagation()
        navigate(`/album/${albumItem.id}`)
    }

    const style = { fontSize: '2rem', color: 'dodgerblue ' }

    return (
        <div
            className={`${carousel && 'carousel-item'} select-none flex-col ${width ? width : queueToggle ? 'w-3/12' : 'w-2/12'} ${darkMode ? 'text-slate-300' : 'text-slate-800'} rounded-3xl flex`}
            title={`${albumItem.attributes?.name} by ${albumItem.attributes?.artistName}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div
                className="relative z-1 w-fit shadow-lg"
                onClick={handleNavigation}
            >
                {artworkUrl ? (
                    <img
                        src={constructImageUrl(artworkUrl, 600)}
                        alt={albumItem.attributes?.name}
                        onError={fetchNewArtworkUrl}
                    />
                ) : (
                    <img src={defaultPlaylistArtwork} alt="default artwork" />
                )}

                <div
                    className={`absolute bottom-1 right-1 ${isHovered ? 'block' : 'hidden'}`}
                >
                    <OptionsModal object={albumItem} />
                </div>
                <div className="absolute bottom-1 left-1">
                    <div
                        className={`transform p-1 flex justify-right hover:scale-110 active:scale-95 transition-transform duration-100 easy-ease ${isHovered ? 'block' : 'hidden'}`}
                        onClick={e => {
                            e.stopPropagation()
                            playData()
                        }}
                    >
                        <FaCirclePlay style={style} />
                    </div>
                </div>
            </div>

            <div className="flex-col h-full overflow-hidden">
                <h2
                    className={`text-md truncate ${darkMode ? 'hover:text-slate-500' : 'hover:text-slate-300'} font-bold`}
                    onClick={handleNavigation}
                >
                    {albumItem.attributes.name}
                </h2>
                <div className="justify-between items-center">
                    <div
                        onClick={() =>
                            navigate(
                                `/artist/${albumItem.attributes.artistName}`
                            )
                        }
                        className={`truncate ${darkMode ? 'hover:text-slate-500' : 'hover:text-slate-300'}`}
                    >
                        {albumItem.attributes.artistName}
                    </div>
                    {releaseDate && (
                        <h3 className="text-sm font-bold">
                            {releaseDate.split('-')[0]}
                        </h3>
                    )}
                </div>
                {albumItem.type === 'library-albums' && (
                    <div className="bg-slate-300 text-slate-600 w-fit h-fit p-1 font-bold text-sm flex rounded-lg">
                        <span>Library</span>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AlbumItem
