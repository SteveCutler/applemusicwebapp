import { useEffect } from 'react'
import { useStore } from '../store/store'
import { useParams } from 'react-router-dom'
import useFetchArtistData from '../components/Apple/FetchArtistData'
import AlbumItem from '../components/Homepage/AlbumItem'

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
    const { Id } = useParams<{ Id: string }>()
    const { artistData, artistAlbumData, loading, error } =
        useFetchArtistData(Id)

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
                <div className="m-5 gap-4 p-5 flex-col w-full">
                    <h1 className="text-6xl font-semibold m-3 p-3 text-slate-400">
                        {artistData.attributes.name}
                    </h1>
                    <img
                        className="m-3 p-3"
                        src={constructImageUrl(
                            artistData.attributes.artwork.url,
                            600
                        )}
                    />
                    {artistAlbumData && (
                        <div className="w-full gap-4 flex flex-wrap">
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
