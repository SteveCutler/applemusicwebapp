import React from 'react'
import { FaCirclePlay, FaRegCirclePause } from 'react-icons/fa6'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../../store/store'
import defaultPlaylistArtwork from '../../assets/images/defaultPlaylistArtwork.png'
import OptionsModal from './OptionsModal'
import { Navigate } from 'react-router-dom'

interface playlistProps {
    song: Song
    index: number
    albumId?: string
}

interface Song {
    id: string
    href?: string
    type: string
    attributes: {
        id?: string
        name: string
        trackNumber: number
        artistName: string
        albumName: string
        durationInMillis: number
        playParams: {
            catalogId: string
        }
        artwork?: {
            bgColor: string
            url: string
        }
    }
}
const QueueTrackDisplay: React.FC<playlistProps> = ({
    song,
    index,
    albumId,
}) => {
    const {
        isPlaying,
        currentSongId,
        playlist,
        authorizeMusicKit,

        switchTrack,
        setPlaylist,
        pause,
        play,
        musicKitInstance,
    } = useStore(state => ({
        isPlaying: state.isPlaying,
        authorizeMusicKit: state.authorizeMusicKit,
        currentSongId: state.currentSongId,
        musicKitInstance: state.musicKitInstance,
        setPlaylist: state.setPlaylist,
        playlist: state.playlist,

        pause: state.pauseSong,
        play: state.playSong,
        switchTrack: state.switchTrack,
    }))

    const createSongObject = (item: any) => {
        if (song.attributes.artwork) {
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
                        catalogId:
                            item.attributes.playParams.catalogId ?? item.id,
                    },
                    artwork: {
                        bgColor: item.attributes.artwork.bgColor ?? '',
                        url: item.attributes.artwork.url ?? '',
                    },
                },
            }
        } else {
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
                        catalogId:
                            item.attributes.playParams.catalogId ?? item.id,
                    },
                },
            }
        }
    }

    // console.log(
    //     'song',
    //     song,
    //     'queue',
    //     musicKitInstance.queue.items,
    //     'now playing',
    //     musicKitInstance.nowPlayingItem
    // )

    // const makeSong = (songObject: any) => {
    //     return {
    //         id: songObject.id,
    //         href: songObject.attributes.url,
    //         type: 'songs',
    //         attributes: {
    //             id: songObject.id,
    //             name: songObject.attributes.name,
    //             trackNumber: songObject.attributes.trackNumber,
    //             artistName: songObject.attributes.artistName,
    //             albumName: songObject.attributes.albumName,
    //             durationInMillis: songObject.attributes.durationInMillis,

    //             artwork: {
    //                 bgColor: songObject.attributes.artwork.bgColor,
    //                 url: songObject.attributes.artwork.url,
    //             },
    //         },
    //     }
    // }

    // const songObject = makeSong(song)
    const playPauseHandler = async () => {
        if (song.id === musicKitInstance.nowPlayingItem.id) {
            // console.log('songId is current song')
            musicKitInstance.playbackState == 2
                ? // console.log('is playing: pausing')
                  await musicKitInstance.pause()
                : // console.log('isnt playing: playing')
                  await musicKitInstance.play()

            // setCurrrentSongId()
        } else {
            // console.log('isnt playing: setting track')
            await musicKitInstance?.changeToMediaItem(song)
            // setCurrrentSongId()
        }
    }

    const navigate = useNavigate()

    const constructImageUrl = (url: string, size: number) => {
        return url
            .replace('{w}', size.toString())
            .replace('{h}', size.toString())
    }

    const style = { fontSize: '1.5rem', color: 'dodgerblue' }

    const handleClick = async () => {
        if (!musicKitInstance) {
            await authorizeMusicKit()
            return
        }
        if (!musicKitInstance || !song.id) {
            return
        }

        console.log(
            'musicKitInstance.storefrontId',
            musicKitInstance.storefrontId
        )

        try {
            // console.log('music kit instance and album id')
            // console.log('music kit instance: ', musicKitInstance)
            console.log('songId: ', song.id)

            if (song.id.startsWith('i')) {
                try {
                    //track data api call
                    const res = await musicKitInstance.api.music(
                        `/v1/me/library/songs/${song.id}/catalog`
                    )
                    // track album data api call

                    const catSongId = await res.data.data[0].id

                    const resAlbum = await musicKitInstance.api.music(
                        `/v1/catalog/${musicKitInstance.storefrontId}/songs/${catSongId}/albums`
                    )
                    // const resArtist = await musicKitInstance.api.music(
                    //     `/v1/catalog/${musicKitInstance.storefrontId}/songs/${catSongId}/artists`
                    // )

                    // const resAlbum = await musicKitInstance.api.music(
                    //     `/v1/me/library/songs/${songId}/albums`
                    // )
                    // const resArtist = await musicKitInstance.api.music(
                    //     `/v1/me/library/songs/${songId}/artists`
                    // )

                    // console.log('track album: ', await resAlbum)

                    const trackAlbumData = await resAlbum.data.data[0]
                    // const trackArtistData = await resArtist.data.data[0]

                    console.log('track album data: ', trackAlbumData)
                    // console.log('track artist data: ', trackArtistData)

                    const data: Song = await res.data.data[0]
                    console.log(res)
                    navigate(`/album/${trackAlbumData.id}`)

                    // return { data, trackAlbumData }
                    // setTrackAlbumData(trackAlbumData)
                } catch (error: any) {
                    // const songState = createSongObject(song)
                    // console.log('song state', songState)
                    navigate(`/album/${song.container.id}`)
                    console.error(error)
                }
            } else {
                try {
                    console.log('fetching song data')
                    // const queryParameters = { l: 'en-us' }
                    // const res = await musicKitInstance.api.music(
                    //     `/v1/catalog/${musicKitInstance.storefrontId}/songs/${songId}`,

                    //     queryParameters
                    // )

                    const resAlbum = await musicKitInstance.api.music(
                        `/v1/catalog/${musicKitInstance.storefrontId}/songs/${song.id}/albums`
                    )
                    // const resArtist = await musicKitInstance.api.music(
                    //     `/v1/catalog/${musicKitInstance.storefrontId}/songs/${song.id}/artists`
                    // )

                    // console.log('track album: ', await resAlbum)
                    const trackAlbumData = await resAlbum.data.data[0]
                    // const trackArtistData = await resArtist.data.data[0]
                    navigate(`/album/${trackAlbumData.id}`)
                    // const data: Song = await res.data.data[0]

                    // console.log('song data: ', data)
                    // return { data, trackAlbumData }
                    // setTrackAlbumData(trackAlbumData)

                    // setSongData(data)
                } catch (error: any) {
                    console.error(error)
                    navigate(`/album/${song.container.id}`)
                    console.error(error)
                }
            }
        } catch (error: any) {
            navigate(`/album/${song.container.id}`)
            console.error(error)
            console.error(error)
        }
    }
    // console.log('song sending: ', makeSong(song))
    if (song) {
        return (
            <div
                onClick={handleClick}
                className="  overflow-hidden text-ellipsis whitespace-nowrap flex m-1 truncate  mx-auto w-11/12  font-semibold hover:text-slate-200 text-slate-400 border-2 border-slate-300  px-1 py-1 rounded-lg hover:cursor-pointer"
            >
                {song.attributes.artwork ? (
                    <img
                        src={constructImageUrl(
                            song.attributes.artwork?.url,
                            100
                        )}
                        style={{ width: '60px' }}
                        className="pe-2 w-1/4"
                    />
                ) : (
                    <img
                        src={defaultPlaylistArtwork}
                        width="50px"
                        className="pe-2"
                    />
                )}
                <div
                    className="text-sm  flex-col overflow-hidden flex justify-center text-ellipsis whitespace-nowrap  truncate w-full mx-auto  "
                    title={`${song.attributes.name} by ${song.attributes.artistName}`}
                >
                    <div className="overflow-hidden text-ellipsis whitespace-nowrap truncate font-semibold">
                        {song.attributes.name}
                    </div>
                    <div className="overflow-hidden text-ellipsis whitespace-nowrap truncate font-normal">
                        {song.attributes.artistName}
                    </div>
                </div>
                {/* <div className="transform scale-75  items-center flex  transition-transform duration-100 easy-ease">
                {musicKitInstance?.queue &&
                    musicKitInstance?.nowPlayingItem && (
                        <OptionsModal
                            object={createSongObject(
                                musicKitInstance.queue.items[
                                    musicKitInstance?.nowPlayingItemIndex
                                ]
                            )}
                        />
                    )}
            </div> */}
                <div
                    className="transform hover:scale-110 shadow-lg items-center pe-1 flex active:scale-95 transition-transform duration-100 easy-ease"
                    onClick={async e => {
                        e.preventDefault()
                        e.stopPropagation() // Prevents the d's default behavior
                        // await FetchAlbumData(albumId)
                        // handlePlayPause()

                        await playPauseHandler()
                    }}
                >
                    {musicKitInstance.playbackState == 2 &&
                    song.id === musicKitInstance?.nowPlayingItem.id ? (
                        <FaRegCirclePause style={style} />
                    ) : (
                        <FaCirclePlay style={style} />
                    )}
                </div>
            </div>
        )
    }
}

export default QueueTrackDisplay
