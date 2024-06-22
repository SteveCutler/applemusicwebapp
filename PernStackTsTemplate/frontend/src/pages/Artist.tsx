import { useEffect } from 'react'
import { useStore } from '../store/store'
import { useParams } from 'react-router-dom'
import useFetchArtistData from '../components/Apple/FetchArtistData'
import AlbumItem from '../components/Homepage/AlbumItem'
import ScrollToTop from '../components/Homepage/ScrollToTop'
import SongItem from '../components/Homepage/SongItem'
import DisplayRow from '../components/Homepage/DisplayRow'

const Artist = () => {
    const {
        musicKitInstance,
        authorizeMusicKit,
        fetchAppleToken,
        appleMusicToken,
    } = useStore(state => ({
        musicKitInstance: state.musicKitInstance,
        authorizeMusicKit: state.authorizeMusicKit,
        fetchAppleToken: state.fetchAppleToken,
        appleMusicToken: state.appleMusicToken,
    }))
    console.log('test')
    const { Id } = useParams<{ Id: string }>()
    const {
        artistData,
        artistAlbumData,
        topSongsData,
        singlesData,
        similarArtistsData,
        featuredPlaylistsData,
        featuredAlbumsData,
        appearsOnAlbumsData,
        compilationAlbumsData,
        fullAlbumsData,
        latestReleaseData,
        loading,
        error,
    } = useFetchArtistData(Id)

    console.log('artist ] data: ', artistData)
    console.log('artist album data: ', artistAlbumData)

    // data flow is taking albumID right now, specify with type?

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

    return (
        <>
            {artistData && (
                <div className="m-5 gap-4 p-5 flex-col justify-start pt-0 mt-0 items-start flex h-full w-full">
                    <ScrollToTop />
                    <h1 className="text-6xl font-semibold m-3 p-3 text-slate-900">
                        {artistData.attributes.name}
                    </h1>
                    <div className="flex justify-center items-center">
                        <img
                            className="mx-3 px-3 pb-5"
                            src={constructImageUrl(
                                artistData.attributes.artwork.url,
                                600
                            )}
                        />
                        {topSongsData && (
                            <div className="w-1/2 gap-4 mx-3 px-3  ">
                                <DisplayRow
                                    title="Top Songs"
                                    albums={topSongsData.splice(6)}
                                />
                            </div>
                        )}
                    </div>
                    {artistAlbumData && (
                        <div className="w-full gap-4 mx-3 px-3 flex flex-wrap">
                            {artistAlbumData.map(album => (
                                <AlbumItem
                                    title={album.attributes.name}
                                    artistName={album.attributes.artistName}
                                    albumArtUrl={album.attributes.url}
                                    albumId={album.id}
                                    type={album.type}
                                />
                                // <p className="">{album.attributes.name}</p>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </>
    )
}

export default Artist
