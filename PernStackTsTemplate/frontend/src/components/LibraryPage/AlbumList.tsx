import { useStore } from '../../store/store'
import AlbumItem from '../Homepage/AlbumItem'
import AlbumGrid from './AlbumGrid'
import AlbumRow from './AlbumRow'

const AlbumList = () => {
    const { albums, gridDisplay } = useStore(state => ({
        albums: state.albums,
        gridDisplay: state.gridDisplay,
    }))

    console.log('albums: ', albums)
    if (gridDisplay) {
        return (
            <div className="flex flex-wrap w-full gap-2  justify-center  ">
                {/* <span className="">{gridDisplay ? 'true' : 'false'}</span> */}
                {albums &&
                    albums.map(album => (
                        <AlbumItem
                            albumId={album.albumId}
                            title={album.name}
                            artistName={album.artistName}
                            albumArtUrl={album.artworkUrl}
                            // trackCount={album.trackCount}
                            type="library-albums"
                        />
                        // <AlbumGrid
                        //     albumId={album.albumId}
                        //     name={album.name}
                        //     artistName={album.artistName}
                        //     artworkUrl={album.artworkUrl}
                        //     trackCount={album.trackCount}
                        // />
                    ))}
            </div>
        )
    }
    if (!gridDisplay) {
        return (
            <div>
                {/* <span className="">{gridDisplay ? 'true' : 'false'}</span> */}
                {albums &&
                    albums.map(album => (
                        <AlbumRow
                            albumId={album.albumId}
                            name={album.name}
                            artistName={album.artistName}
                            artworkUrl={album.artworkUrl}
                            trackCount={album.trackCount}
                        />
                    ))}
            </div>
        )
    }
}

export default AlbumList
