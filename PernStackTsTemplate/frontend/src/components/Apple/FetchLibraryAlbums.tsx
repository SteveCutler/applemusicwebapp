import { useState, useEffect } from 'react'
import { useStore } from '../../store/store'
const FetchLibraryAlbums = () => {
    const { musicKitInstance } = useStore(state => ({
        appleMusicToken: state.appleMusicToken,
        musicKitInstance: state.musicKitInstance,
    }))
    const [libraryAlbums, setLibraryAlbums] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchLibraryAlbums = async () => {
            if (musicKitInstance) {
                try {
                    const res = await musicKitInstance.api.music(
                        '/v1/me/library/albums'
                    )

                    console.log('library albums: ', res)

                    const data = await res.data.data
                    setLibraryAlbums(data)
                } catch (error: any) {
                    console.error(error)
                    setError(error)
                } finally {
                    setLoading(false)
                }
            }
        }

        if (musicKitInstance) {
            fetchLibraryAlbums()
        }
    }, [musicKitInstance])

    return { libraryAlbums, loading, error }
}

export default FetchLibraryAlbums
