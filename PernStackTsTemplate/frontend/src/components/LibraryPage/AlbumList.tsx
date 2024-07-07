import React, { useEffect, useRef, useCallback } from 'react'
import { useStore } from '../../store/store'
import AlbumItem from '../Homepage/AlbumItem'
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
    loadMoreAlbums: () => void
}

const AlbumList: React.FC<AlbumListProps> = ({ albums, loadMoreAlbums }) => {
    const { gridDisplay, queueToggle } = useStore(state => ({
        gridDisplay: state.gridDisplay,
        queueToggle: state.queueToggle,
    }))

    const observer = useRef<IntersectionObserver | null>(null)
    const lastAlbumElementRef = useCallback(
        node => {
            if (observer.current) observer.current.disconnect()
            observer.current = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting) {
                    loadMoreAlbums()
                }
            })
            if (node) observer.current.observe(node)
        },
        [loadMoreAlbums]
    )

    // const width = queueToggle ? 'w-1/4 p-1 ' : 'w-1/6 p-1'

    if (gridDisplay) {
        return (
            <div className="flex flex-wrap w-full gap-y-10 gap-x-1 pb-2 justify-center">
                {albums &&
                    albums.map((album, index) => {
                        if (albums.length === index + 1) {
                            return (
                                <div
                                    className="last-album"
                                    ref={lastAlbumElementRef}
                                    key={album.id}
                                >
                                    <AlbumItem
                                        albumItem={album}
                                        lib={true}
                                        width={` ${queueToggle ? 'w-full md:w-5/12 lg:w-3/12 2xl:w-2/12' : 'w-full md:w-5/12 lg:w-3/12 xl:w-2/12 2xl:w-1/12 '} `}
                                    />
                                </div>
                            )
                        } else {
                            return (
                                <AlbumItem
                                    key={album.id}
                                    albumItem={album}
                                    lib={true}
                                    width={` ${queueToggle ? 'w-full md:w-5/12 lg:w-3/12 2xl:w-2/12' : 'w-full md:w-5/12 lg:w-3/12 xl:w-2/12 2xl:w-1/12 '} `}
                                />
                            )
                        }
                    })}
            </div>
        )
    }

    return (
        <div className="flex flex-wrap w-11/12 mx-auto overflow-hidden pb-2 justify-around">
            {albums &&
                albums.map((album, index) => {
                    if (albums.length === index + 1) {
                        return (
                            <div
                                className="last-album"
                                ref={lastAlbumElementRef}
                                key={album.id}
                            >
                                <AlbumRow
                                    key={index}
                                    first={index === 0}
                                    last={index === albums.length}
                                    albumItem={album}
                                />
                            </div>
                        )
                    } else {
                        return (
                            <AlbumRow
                                key={index}
                                first={index === 0}
                                last={index === albums.length}
                                albumItem={album}
                            />
                        )
                    }
                })}
        </div>
    )
}

export default AlbumList
