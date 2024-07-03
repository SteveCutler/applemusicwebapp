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

interface Album {
    attributes: {
        artistName?: string
        artwork?: { height: number; width: number; url?: string }
        dateAdded?: string
        genreNames?: Array<string>
        name?: string
        releaseDate?: string
        trackCount?: number
    }
    id: string
    type: string
}

interface AlbumListProps {
    albums: Album[] | null
}

const AlbumList: React.FC<AlbumListProps> = ({ albums }) => {
    const { gridDisplay, queueToggle } = useStore(state => ({
        gridDisplay: state.gridDisplay,
        queueToggle: state.queueToggle,
    }))

    const width = queueToggle ? 'w-1/5 ' : 'w-1/6'

    if (gridDisplay) {
        return (
            <div className="flex flex-wrap w-full gap-y-10 gap-x-1 pb-2 justify-around  ">
                {/* <span className="">{gridDisplay ? 'true' : 'false'}</span> */}
                {albums &&
                    albums.map(album => (
                        <AlbumItem
                            albumItem={album}
                            width={width}
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
                    albums.map((album, index) => (
                        <AlbumRow
                            key={index}
                            first={index === 0}
                            last={index === albums.length}
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
