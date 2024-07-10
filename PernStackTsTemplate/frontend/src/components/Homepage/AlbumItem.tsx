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
        releaseDate?: string
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
        if (lib || albumItem.id.startsWith('l')) {
            try {
                console.log('albumItemTest')
                const resAlbum = await musicKitInstance?.api.music(
                    `/v1/me/library/albums/${albumItem.id}/catalog`
                )

                const catAlbumId = await resAlbum.data.data[0].id

                if (catAlbumId) {
                    navigate(`/album/${catAlbumId}`)
                } else {
                    {
                        navigate(`/album/${albumItem.id}`)
                    }
                }
            } catch (error: any) {
                {
                    navigate(`/album/${albumItem.id}`)
                }
                console.error(error)
            }
        } else {
            navigate(`/album/${albumItem.id}`)
        }
    }

    const navigateToArtist = async () => {
        try {
            if (albumItem.id.startsWith('l')) {
                const artistRes = await musicKitInstance?.api.music(
                    `/v1/me/library/albums/${albumItem.id}/artists`
                )

                const artistId = await artistRes.data.data[0].id
                if (artistId) {
                    navigate(`/artist/${artistId}`)
                }
            } else if (albumItem.id.startsWith('r')) {
                navigate(`/album/${albumItem.id}`)
            } else {
                const artistRes = await musicKitInstance?.api.music(
                    `/v1/catalog/ca/albums/${albumItem.id}/artists`
                )

                const artistId = await artistRes.data.data[0].id
                if (artistId) {
                    navigate(`/artist/${artistId}`)
                }
            }
        } catch (error: any) {
            console.error(error)
        }
    }

    const style = { fontSize: '2rem', color: 'dodgerblue ' }

    return (
        <div
            className={`${carousel && 'carousel-item'} select-none  flex-col ${width ? width : queueToggle ? 'w-3/12' : ' w-2/12'}  ${darkMode ? 'text-slate-300' : 'text-slate-800'}    rounded-3xl flex `}
            title={`${albumItem.attributes?.name} by ${albumItem.attributes?.artistName}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div
                className=" relative flex-col h-full w-full flex flex-shrink  "
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

            <div className="flex-col w-full h-full justify-between overflow-hidden">
                <h2
                    className={`text-md truncate ${darkMode ? 'hover:text-slate-500' : 'hover:text-slate-300'} font-bold`}
                    onClick={handleNavigation}
                >
                    {albumItem.attributes.name}
                </h2>
                <div className="justify-between items-center">
                    <div
                        onClick={e => {
                            lib ? handleNavigation(e) : navigateToArtist()
                        }}
                        className={`truncate ${darkMode ? 'hover:text-slate-500' : 'hover:text-slate-300'}`}
                    >
                        {albumItem.attributes.artistName}
                    </div>
                    {albumItem.attributes.releaseDate && (
                        <h3 className="text-sm font-bold">
                            {albumItem.attributes.releaseDate?.split('-')[0]}
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
