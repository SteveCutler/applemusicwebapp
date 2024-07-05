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

    const width = queueToggle ? 'w-1/4 p-1 ' : 'w-1/6 p-1'

    if (gridDisplay) {
        return (
            <div className="flex flex-wrap   w-full gap-y-10 gap-x-1 pb-2 justify-center  ">
                {/* <span className="">{gridDisplay ? 'true' : 'false'}</span> */}
                {albums &&
                    albums.map(album => (
                        <AlbumItem
                            albumItem={album}
                            width={` ${queueToggle ? 'w-full md:w-5/12 lg:w-3/12 2xl:w-2/12' : 'w-full md:w-5/12 lg:w-3/12 xl:w-2/12 2xl:w-1/12 '} `}
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
            <div className="flex flex-wrap  w-11/12 mx-auto overflow-hidden   pb-2 justify-around  ">
                {/* <span className="">{gridDisplay ? 'true' : 'false'}</span> */}
                {albums &&
                    albums.map((album, index) => (
                        <AlbumRow
                            key={index}
                            first={index === 0}
                            last={index === albums.length}
                            albumItem={album}
                        />
                    ))}
            </div>
        )
    }
}

export default AlbumList
