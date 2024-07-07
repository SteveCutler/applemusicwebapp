import { useMusickitContext } from '../../context/MusickitContext'
import { FaCirclePlay } from 'react-icons/fa6'
import { FaRegCirclePause } from 'react-icons/fa6'
import { IoPlayBackCircleSharp } from 'react-icons/io5'
import { IoPlayForwardCircleSharp } from 'react-icons/io5'
import Timeline from './Timeline'
import { LuShuffle, LuRepeat, LuRepeat1 } from 'react-icons/lu'
import { FaListOl } from 'react-icons/fa'

import { useStore } from '../../store/store'
import VolumeSlider from './VolumeSlider'
import { Link } from 'react-router-dom'
import defaultPlaylistArtwork from '../../assets/images/defaultPlaylistArtwork.png'
import OptionsModal from './OptionsModal'
import { useNavigate } from 'react-router-dom'

function Footer() {
    // const { musicInstance } = useMusickitContext()
    // const [playbackState, setPlaybackState] = useState(2)
    const {
        playSong,
        pauseSong,
        isPlaying,
        musicKitInstance,
        setCurrentSongIndex,
        setCurrrentSongId,
        authorizeMusicKit,
        switchTrack,
        currentElapsedTime,
        currentSongIndex,
        albumArtUrl,
        currentSongId,
        currentSongDuration,
        nextSong,
        previousSong,
        shuffle,
        setShuffle,
        repeat,
        setRepeat,
        playlist,
        setPlaylist,
        queueToggle,
        setQueueToggle,
    } = useStore(state => ({
        repeat: state.repeat,
        queueToggle: state.queueToggle,
        setQueueToggle: state.setQueueToggle,
        setRepeat: state.setRepeat,
        currentSongDuration: state.currentSongDuration,
        shuffle: state.shuffle,
        setShuffle: state.setShuffle,
        switchTrack: state.switchTrack,
        currentElapsedTime: state.currentElapsedTime,
        albumArtUrl: state.albumArtUrl,
        pauseSong: state.pauseSong,
        nextSong: state.nextSong,
        previousSong: state.previousSong,
        setCurrentSongIndex: state.setCurrentSongIndex,
        currentSongId: state.currentSongId,
        setCurrrentSongId: state.setCurrentSongId,
        currentSongIndex: state.currentSongIndex,
        playlist: state.playlist,
        authorizeMusicKit: state.authorizeMusicKit,
        isPlaying: state.isPlaying,
        musicKitInstance: state.musicKitInstance,
        playSong: state.playSong,
        setPlaylist: state.setPlaylist,
    }))

    const createSongObject = (item: any) => {
        return {
            id: item.id,
            type: 'songs',
            href: item.attributes.url,
            attributes: {
                name: item.attributes.name,
                id: item.id,
                trackNumber: item.attributes.trackNumber,
                artistName: item.attributes.artistName,
                albumName: item.attributes.albumName,
                durationInMillis: item.attributes.durationInMillis,
                playParams: {
                    catalogId: item.attributes.playParams.catalogId ?? '',
                },
                artwork: {
                    bgColor:
                        item.attributes.artwork?.bgColor ??
                        defaultPlaylistArtwork,
                    url: item.attributes.artwork?.url ?? defaultPlaylistArtwork,
                },
            },
        }
    }

    const navigate = useNavigate()

    const goToAlbum = async () => {
        console.log('item check: ', await musicKitInstance?.queue.items[0])
        if (
            musicKitInstance?.nowPlayingItem.container.id &&
            Number(musicKitInstance?.nowPlayingItem.container.id)
        ) {
            navigate(`/album/${musicKitInstance?.nowPlayingItem.container.id}`)
        } else {
            if (musicKitInstance?.nowPlayingItem.id.startsWith('i')) {
                try {
                    //track data api call
                    const res = await musicKitInstance?.api.music(
                        `/v1/me/library/songs/${musicKitInstance?.nowPlayingItem.id}/catalog`
                    )

                    const catSongId = await res.data.data[0].id

                    const resAlbum = await musicKitInstance?.api.music(
                        `/v1/catalog/ca/songs/${catSongId}/albums`
                    )
                    // const resArtist = await musicKitInstance?.api.music(
                    //     `/v1/catalog/ca/songs/${catSongId}/artists`
                    // )

                    // const trackArtistData = await resArtist.data.data[0]

                    const trackAlbumData = await resAlbum.data.data[0]

                    if (trackAlbumData) {
                        navigate(`/album/${trackAlbumData.id}`)
                    } else {
                        {
                            musicKitInstance.nowPlayingItem.container.id.startsWith(
                                'l'
                            ) &&
                                navigate(
                                    `/album/${musicKitInstance.nowPlayingItem.container.id}`
                                )
                        }
                    }
                    console.log('track album data: ', trackAlbumData)
                    // console.log('track artist data: ', trackArtistData)

                    // const data: Song = await res.data.data[0]
                    // console.log(res)
                    // return { data, trackAlbumData }
                } catch (error: any) {
                    {
                        musicKitInstance.nowPlayingItem.container.id.startsWith(
                            'l'
                        ) &&
                            navigate(
                                `/album/${musicKitInstance.nowPlayingItem.container.id}`
                            )
                    }
                    console.error(error)
                }
            } else {
                try {
                    const resAlbum = await musicKitInstance?.api.music(
                        `/v1/catalog/ca/songs/${musicKitInstance?.nowPlayingItem.id}/albums`
                    )
                    // const resArtist = await musicKitInstance?.api.music(
                    //     `/v1/catalog/ca/songs/${musicKitInstance?.nowPlayingItem.id}/artists`
                    // )

                    const trackAlbumData = await resAlbum.data.data[0]
                    if (trackAlbumData) {
                        navigate(`/album/${trackAlbumData.id}`)
                    } else if (
                        musicKitInstance?.nowPlayingItem.container.id.startsWith(
                            'l'
                        )
                    ) {
                        navigate(
                            `/album/${musicKitInstance.nowPlayingItem.container.id}`
                        )
                    }

                    // const trackArtistData = await resArtist.data.data[0]
                } catch (error: any) {
                    if (
                        musicKitInstance?.nowPlayingItem.container.id.startsWith(
                            'l'
                        )
                    ) {
                        navigate(
                            `/album/${musicKitInstance.nowPlayingItem.container.id}`
                        )
                    }
                    console.error(error)
                }
            }
        }
    }

    const goToArtist = async () => {
        if (
            musicKitInstance?.nowPlayingItem.container.id &&
            musicKitInstance?.nowPlayingItem
        ) {
            console.log(
                'artist check: ',
                await musicKitInstance?.queue.items[0]
            )

            if (
                musicKitInstance?.nowPlayingItem.container.id &&
                Number(musicKitInstance?.nowPlayingItem.container.id)
            ) {
                navigate(
                    `/artist/${musicKitInstance?.nowPlayingItem.container.id}`
                )
            } else {
                if (musicKitInstance?.nowPlayingItem.id.startsWith('i')) {
                    try {
                        //track data api call
                        const res = await musicKitInstance?.api.music(
                            `/v1/me/library/songs/${musicKitInstance?.nowPlayingItem.id}/catalog`
                        )

                        const catSongId = await res.data.data[0].id

                        // const resAlbum = await musicKitInstance?.api.music(
                        //     `/v1/catalog/ca/songs/${catSongId}/albums`
                        // )
                        const resArtist = await musicKitInstance?.api.music(
                            `/v1/catalog/ca/songs/${catSongId}/artists`
                        )

                        const trackArtistData = await resArtist.data.data[0]

                        // const trackAlbumData = await resAlbum.data.data[0]

                        if (trackArtistData) {
                            navigate(`/artist/${trackArtistData.id}`)
                        } else {
                            {
                                musicKitInstance.nowPlayingItem.container.id.startsWith(
                                    'r'
                                ) &&
                                    navigate(
                                        `/artist/${musicKitInstance.nowPlayingItem.container.id}`
                                    )
                            }
                        }
                        console.log('track album data: ', trackAlbumData)
                    } catch (error: any) {
                        {
                            musicKitInstance.nowPlayingItem.container.id.startsWith(
                                'l'
                            ) &&
                                navigate(
                                    `/artist/${musicKitInstance.nowPlayingItem.container.id}`
                                )
                        }
                        console.error(error)
                    }
                } else {
                    try {
                        const resAlbum = await musicKitInstance?.api.music(
                            `/v1/catalog/ca/songs/${musicKitInstance?.nowPlayingItem.id}/albums`
                        )
                        // const resArtist = await musicKitInstance?.api.music(
                        //     `/v1/catalog/ca/songs/${musicKitInstance?.nowPlayingItem.id}/artists`
                        // )

                        // const trackAlbumData = await resAlbum.data.data[0]
                        if (trackAlbumData) {
                            navigate(`/artist/${trackAlbumData.id}`)
                        } else if (
                            musicKitInstance?.nowPlayingItem.container.id.startsWith(
                                'r'
                            )
                        ) {
                            navigate(
                                `/artist/${musicKitInstance.nowPlayingItem.container.id}`
                            )
                        }

                        const trackArtistData = await resArtist.data.data[0]
                    } catch (error: any) {
                        if (
                            musicKitInstance?.nowPlayingItem.container.id.startsWith(
                                'r'
                            )
                        ) {
                            navigate(
                                `/artist/${musicKitInstance.nowPlayingItem.container.id}`
                            )
                        }
                        console.error(error)
                    }
                }
            }

            // try {
            //     const artistRes = await musicKitInstance.api.music(
            //         `/v1/catalog/ca/albums/${musicKitInstance?.nowPlayingItem.container.id}/artists`
            //     )

            //     const artistId = await artistRes.data.data[0].id

            //     navigate(`/artist/${artistId}`)
            // } catch (error) {
            //     console.error(error)
            // }
        }
    }

    const playPauseHandler = (e: any) => {
        e.preventDefault()
        isPlaying ? pauseSong() : playSong()
    }
    const playPrev = (e: any) => {
        e.preventDefault()
        previousSong()
    }
    const playNext = (e: any) => {
        e.preventDefault()
        nextSong()
    }

    const handleQueueToggle = (e: any) => {
        setQueueToggle()
    }

    // const albumId =
    //     musicKitInstance?.nowPlayingItem?.relationships?.albums?.data[0]?.id

    const style = { fontSize: '3em' }
    const styleSmall = { fontSize: '2em' }

    return (
        <div className="footer px-5 flex  items-center justify-between  bg-gradient-to-b from-gray-900 to-black">
            <div className="flex justify-between items-center  mt-3 w-full">
                <div
                    // to={`/album/${albumId}`}

                    className="flex gap-2 justify-start hover:cursor-pointer hover:text-white w-1/4"
                    onClick={goToAlbum}
                >
                    {albumArtUrl ? (
                        <img
                            src={albumArtUrl}
                            alt="album image"
                            style={{ width: '70px' }}
                            className="  hover:scale-105"
                        />
                    ) : (
                        isPlaying && (
                            <img
                                src={defaultPlaylistArtwork}
                                alt="album image"
                                style={{ width: '70px' }}
                                className="  hover:scale-105"
                            />
                        )
                    )}
                    <div className="flex flex-col w-full justify-center items-start text-xs font-normal">
                        {musicKitInstance?.nowPlayingItem ? (
                            <>
                                <div className="font-semibold hover:cursor-pointer hover:text-white w-full flex-col ">
                                    <div>
                                        {
                                            musicKitInstance?.nowPlayingItem
                                                .attributes.name
                                        }
                                    </div>
                                    <div>
                                        {musicKitInstance.queue.items &&
                                            musicKitInstance.queue.items[
                                                musicKitInstance
                                                    ?.nowPlayingItemIndex
                                            ].attributes.albumName}
                                    </div>
                                </div>
                                {/* <div onClick={goToAlbum}>
                                    {musicKitInstance.queue.items &&
                                        musicKitInstance.queue.items[
                                            musicKitInstance
                                                ?.nowPlayingItemIndex
                                        ].attributes.albumName}
                                </div> */}
                                <div className="flex items-center gap-2">
                                    <div
                                        className={`${
                                            musicKitInstance.nowPlayingItem &&
                                            musicKitInstance.nowPlayingItem.id.startsWith(
                                                'i'
                                            )
                                                ? ''
                                                : 'hover:cursor-pointer hover:text-white'
                                        }`}
                                    >
                                        {musicKitInstance.queue.items &&
                                            musicKitInstance.queue.items[
                                                musicKitInstance
                                                    ?.nowPlayingItemIndex
                                            ].attributes.artistName}
                                    </div>
                                    <div className="flex justify-start items-end">
                                        {musicKitInstance?.queue &&
                                            musicKitInstance?.nowPlayingItem && (
                                                <OptionsModal
                                                    small={true}
                                                    object={createSongObject(
                                                        musicKitInstance.queue
                                                            .items[
                                                            musicKitInstance
                                                                ?.nowPlayingItemIndex
                                                        ]
                                                    )}
                                                />
                                            )}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <span className="flex flex-grow w-full"></span>
                        )}
                    </div>
                </div>
                <div className="flex flex-col justify-between items-around gap-3  w-1/2 mx-auto ">
                    <div className="flex gap-1 mx-auto w-1/4 justify-center mx-10">
                        <button
                            className={` ${shuffle && 'text-blue-600'}  flex rounded-full mx-2 items-center justify-center active:scale-95`}
                            onClick={e => {
                                e.preventDefault()
                                setShuffle()
                            }}
                        >
                            <LuShuffle style={styleSmall} />
                        </button>
                        <button
                            className={` flex rounded-full items-center justify-center  hover:text-white active:scale-95`}
                            onClick={e => playPrev(e)}
                        >
                            <IoPlayBackCircleSharp style={style} />
                        </button>
                        <button
                            className={` flex items-center rounded-full justify-center ${isPlaying && `text-blue-600`} hover:text-white active:scale-95`}
                            onClick={e => playPauseHandler(e)}
                        >
                            {isPlaying ? (
                                <FaRegCirclePause style={style} />
                            ) : (
                                <FaCirclePlay style={style} />
                            )}
                        </button>
                        <button
                            className=" flex rounded-full items-center justify-center hover:text-white active:scale-95"
                            onClick={e => playNext(e)}
                        >
                            <IoPlayForwardCircleSharp style={style} />
                        </button>
                        <button
                            className={` ${repeat && 'text-blue-600'}  flex rounded-full mx-2 items-center justify-center active:scale-95 `}
                            onClick={e => {
                                e.preventDefault()
                                setRepeat()
                            }}
                        >
                            {repeat === 2 ? (
                                <LuRepeat1 style={styleSmall} />
                            ) : (
                                <LuRepeat style={styleSmall} />
                            )}
                        </button>
                    </div>
                    <div className="">
                        <Timeline />
                    </div>
                </div>
            </div>
            <div className=" flex items-center justify-end mx-5">
                <button
                    className={` ${queueToggle && 'text-blue-600'}  flex rounded-full items-center pe-10 justify-end  active:scale-95`}
                    title="Display Queue"
                    onClick={e => {
                        e.preventDefault()
                        handleQueueToggle(e)
                    }}
                >
                    <FaListOl style={styleSmall} />
                </button>{' '}
                <VolumeSlider />
            </div>
        </div>
    )
}

export default Footer
