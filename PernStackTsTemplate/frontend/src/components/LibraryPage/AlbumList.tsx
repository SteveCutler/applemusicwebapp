import { useStore } from '../../store/store'
import AlbumItem from '../Homepage/AlbumItem'
import AlbumGrid from './AlbumGrid'
import AlbumRow from './AlbumRow'

type AlbumType = {
    attributes: {
        artistName: string
        artwork?: { height: number; width: number; url?: string }
        dateAdded: string
        genreNames: Array<string>
        name: string
        releaseDate: string
        trackCount: number
    }
    id: string
    type: string
}

interface AlbumListProps {
    albums: AlbumType[] | null
}

const AlbumList: React.FC<AlbumListProps> = ({ albums }) => {
    const { gridDisplay } = useStore(state => ({
        gridDisplay: state.gridDisplay,
    }))

    console.log('albums: ', albums)
    if (gridDisplay) {
        return (
            <div className="flex flex-wrap w-full mx-auto gap-2  justify-center  ">
                {/* <span className="">{gridDisplay ? 'true' : 'false'}</span> */}
                {albums &&
                    albums.map(album => (
                        <AlbumItem
                            albumItem={album}
                            // trackCount={album.trackCount}
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
                            albumId={album.id}
                            name={album.attributes.name}
                            artistName={album.attributes.artistName}
                            artworkUrl={album.attributes.artwork?.url}
                            trackCount={album.attributes.trackCount}
                        />
                    ))}
            </div>
        )
    }
}

export default AlbumList
