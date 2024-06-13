import { useStore } from '../../store/store'
import AlbumRow from './AlbumRow'

const AlbumList = () => {
    const { albums } = useStore(state => ({
        albums: state.albums,
    }))

    console.log('albums: ', albums)
    return (
        <div>
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

export default AlbumList
