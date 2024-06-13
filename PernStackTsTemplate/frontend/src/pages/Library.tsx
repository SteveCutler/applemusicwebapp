import React from 'react'
import { useStore } from '../store/store'
import FetchLibraryAlbums from '../components/Apple/FetchLibraryAlbums'

const Library = () => {
    const { musicKitInstance } = useStore(state => ({
        musicKitInstance: state.musicKitInstance,
    }))

    const fetchLibrary = () => {}

    // const { libraryAlbums } = FetchLibraryAlbums()

    // console.log(libraryAlbums)

    return <div>Library</div>
}

export default Library
