import { useEffect } from 'react'
import { useStore } from '../store/store'
import { useParams } from 'react-router-dom'
import useFetchArtistData from '../hooks/ArtistPage/FetchArtistData'
import useFetchArtistAlbumData from '../hooks/ArtistPage/FetchArtistAlbumData'
import useFetchArtistAppearsOnAlbumsData from '../hooks/ArtistPage/FetchArtistAppearsOnAlbumsData'
import useFetchArtistCompilationAlbumsData from '../hooks/ArtistPage/FetchArtistCompilationAlbumsData'
import useFetchArtistFeaturedPlaylistsData from '../hooks/ArtistPage/FetchArtistFeaturedPlaylistsData'
import useFetchArtistLatestReleaseData from '../hooks/ArtistPage/FetchArtistLatestReleaseData'
import useFetchArtistSimilarArtistsData from '../hooks/ArtistPage/FetchArtistSimilarArtistsData'
import useFetchArtistSinglesData from '../hooks/ArtistPage/FetchArtistSinglesData'
import useFetchArtistTopSongsData from '../hooks/ArtistPage/FetchArtistTopSongsData'
import useFetchFeaturedAlbumsData from '../hooks/ArtistPage/FetchFeaturedAlbumsData'
import AlbumItem from '../components/Homepage/AlbumItem'
import ScrollToTop from '../components/Homepage/ScrollToTop'
import SongItem from '../components/Homepage/SongItem'
import DisplayRow from '../components/Homepage/DisplayRow'
import TrackDisplay from '../components/AlbumPage/TrackDisplay'
import { FaCirclePlay, FaRegCirclePause } from 'react-icons/fa6'

const Artist = () => {
    const {
        musicKitInstance,
        authorizeMusicKit,
        fetchAppleToken,
        appleMusicToken,
        setPlaylist,
        isPlaying,
        playlist,
        pauseSong,
        playSong,
    } = useStore(state => ({
        setPlaylist: state.setPlaylist,
        pauseSong: state.pauseSong,
        playSong: state.playSong,
        isPlaying: state.isPlaying,
        playlist: state.playlist,
        musicKitInstance: state.musicKitInstance,
        authorizeMusicKit: state.authorizeMusicKit,
        fetchAppleToken: state.fetchAppleToken,
        appleMusicToken: state.appleMusicToken,
    }))
    const { Id } = useParams<{ Id: string }>()
    const { artistData } = useFetchArtistData(Id)
    const { artistAlbumData } = useFetchArtistAlbumData(Id)
    // const { appearsOnAlbumsData } = useFetchArtistAppearsOnAlbumsData(Id)
    const { featuredPlaylistsData } = useFetchArtistFeaturedPlaylistsData(Id)
    // const { compilationAlbumsData } = useFetchArtistCompilationAlbumsData(Id)
    const { latestReleaseData } = useFetchArtistLatestReleaseData(Id)
    const { similarArtistsData } = useFetchArtistSimilarArtistsData(Id)
    // const { singlesData } = useFetchArtistSinglesData(Id)
    const { topSongsData } = useFetchArtistTopSongsData(Id)
    const { featuredAlbumsData } = useFetchFeaturedAlbumsData(Id)

    console.log('latestReleaseData', latestReleaseData)
    //console.log('artistData: ', artistData[0])
    const initialize = async () => {
        let musicKitLoaded = false
        if (musicKitLoaded === false) {
            console.log('Initializing MusicKit...')
            await authorizeMusicKit()
            musicKitLoaded = true
        }

        if (!appleMusicToken && musicKitLoaded) {
            console.log('fetching Apple token...')
            await fetchAppleToken()
        }
    }

    useEffect(() => {
        if (!musicKitInstance) {
            initialize()
        }
    }, [musicKitInstance])

    const constructImageUrl = (url: string, size: number) => {
        return url
            .replace('{w}', size.toString())
            .replace('{h}', size.toString())
    }

    const loadPlayer = async () => {
        if (topSongsData) {
            setPlaylist(topSongsData, 0, true)
        }
        // await retrieveAlbumTracks()
    }

    const styleButton = { fontSize: '3rem', color: 'royalblue ' }

    return (
        <>
            {artistData && (
                <div className="m-5 gap-4 p-5 flex-col justify-start pt-0 mt-0 items-start flex h-full w-full">
                    <ScrollToTop />
                    <div className="flex justify-between w-full ">
                        <div className=" w-1/2 flex">
                            <h1 className="text-5xl font-bold text-black">
                                {artistData.attributes.name}
                            </h1>
                        </div>
                        <div className=" translate-y-4 w-1/2 text-black text-lg font-bold flex justify-end  items-end">
                            {' '}
                            Top songs:
                        </div>
                    </div>
                    <div className="flex justify-around gap-2 items-start">
                        <div className="flex-col flex  relative  ">
                            <img
                                className="pb-5 "
                                src={constructImageUrl(
                                    artistData.attributes.artwork.url,
                                    600
                                )}
                            />
                            {topSongsData && (
                                <div
                                    className=" absolute bottom-10 right-10 hover:cursor-pointer transform    hover:scale-110 active:scale-95 transition-transform duration-100 easy-ease"
                                    onClick={async e => {
                                        e.preventDefault()
                                        e.stopPropagation() // Prevents the link's default behavior
                                        // await FetchAlbumData(albumId)
                                        // handlePlayPause()

                                        await loadPlayer()
                                    }}
                                >
                                    {isPlaying &&
                                    musicKitInstance?.nowPlayingItem &&
                                    playlist === topSongsData ? (
                                        <FaRegCirclePause style={styleButton} />
                                    ) : (
                                        <FaCirclePlay style={styleButton} />
                                    )}
                                </div>
                            )}

                            {artistData.attributes.editorialNotes && (
                                <div className="flex w-full mx-3 px-3 pb-5 text-3xl  text-slate-800">
                                    {artistData.attributes.editorialNotes
                                        .standard
                                        ? artistData.attributes.editorialNotes
                                              .standard
                                        : artistData.attributes.editorialNotes
                                              .short}
                                </div>
                            )}
                        </div>

                        <div className="flex-col w-1/2">
                            {topSongsData && (
                                <div className=" justify-start">
                                    {' '}
                                    <TrackDisplay albumTracks={topSongsData} />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* {topSongsData && (
                        <div className="w-full gap-4 mx-3 px-3 ">
                            <>
                                <DisplayRow
                                    title={'Top Songs:'}
                                    albums={topSongsData}
                                />
                            </>
                        </div>
                    )} */}

                    {/* {featuredAlbumsData && (
                        <div className="w-full gap-4 mx-3 px-3   ">
                            <>
                                <DisplayRow
                                    title={'Featured Albums:'}
                                    albums={featuredAlbumsData}
                                />
                            </>
                        </div>
                    )} */}

                    {latestReleaseData && (
                        <div className="w-full flex-col flex mx-20 justify-center">
                            <h2 className="pb-3  text-xl text-slate-800 font-bold">
                                Latest Release:
                            </h2>
                            <div className=" gap-1 justify-left  flex flex-wrap">
                                {latestReleaseData.map(album => (
                                    <>
                                        <AlbumItem albumItem={album} />
                                    </>
                                    // <p className="">{album.attributes.name}</p>
                                ))}
                            </div>
                        </div>
                    )}

                    {artistAlbumData && (
                        <h2 className="mx-3 px-3 text-xl text-slate-800 font-bold">
                            Albums:
                        </h2>
                    )}
                    {artistAlbumData && (
                        <div className="w-full gap-1 justify-center flex flex-wrap">
                            {artistAlbumData.map(album => (
                                <>
                                    <AlbumItem albumItem={album} />
                                </>
                                // <p className="">{album.attributes.name}</p>
                            ))}
                        </div>
                    )}

                    {similarArtistsData && (
                        <div className="w-full gap-1 justify-center flex    ">
                            <>
                                <DisplayRow
                                    title={'Similar Artists:'}
                                    albums={similarArtistsData}
                                />
                            </>
                        </div>
                    )}

                    <div className=" w-full gap-1 justify-center flex ">
                        {featuredPlaylistsData && (
                            <DisplayRow
                                title="Featured Playlists:"
                                albums={featuredPlaylistsData}
                            />
                        )}
                    </div>
                </div>
            )}
        </>
    )
}

export default Artist
