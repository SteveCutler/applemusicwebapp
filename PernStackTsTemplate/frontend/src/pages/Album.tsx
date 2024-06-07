import { useParams } from 'react-router-dom'
import FetchAlbumData from '../components/Apple/FetchAlbumData'
import TrackDisplay from '../components/AlbumPage/TrackDisplay'
import { MdArrowBackIosNew } from 'react-icons/md'
import { Link } from 'react-router-dom'

const Album = () => {
    //IMPORT musicUserToken from State
    const { albumId } = useParams()
    //console.log(typeof albumId)
    const { albumData } = FetchAlbumData(albumId)

    const constructImageUrl = (url: String, size: Number) => {
        return url
            .replace('{w}', size.toString())
            .replace('{h}', size.toString())
    }
    const style = { fontSize: '1.5em' }

    if (albumData) {
        return (
            <div className="flex-col w-4/5 justify-between ">
                <Link to="/">
                    <div className="sticky mb-10 mt-5 top-1 left-1">
                        {' '}
                        <MdArrowBackIosNew style={style} />
                    </div>
                </Link>
                <div className="h-3/4  flex-col ">
                    <h1 className="text-3xl font-bold">
                        {albumData.attributes.name}
                    </h1>
                    <h1 className="text-2xl font-bold">
                        {albumData.attributes.artistName}
                    </h1>
                </div>
                <div className="flex w-full justify-between gap-4 py-3  ">
                    <div className="">
                        <img
                            src={constructImageUrl(
                                albumData.attributes.artwork.url,
                                500
                            )}
                            alt=""
                        />
                    </div>
                    <TrackDisplay
                        albumTracks={albumData.relationships.tracks.data}
                    />
                    {/* MAKE TRACK GETTER, ETC. DESIGN PAGE LAYOUT */}
                </div>
            </div>
        )
    }
}

export default Album
