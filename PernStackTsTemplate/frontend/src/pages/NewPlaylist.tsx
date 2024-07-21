import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useStore } from '../store/store'
import defaultPlaylistArtwork from '../assets/images/defaultPlaylistArtwork.png'
import { useNavigate } from 'react-router-dom'

interface SearchResultsObject {
    albums?: Album[]
    songs?: Song[]
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

interface Song {
    id: string
    type: string
    attributes: {
        artwork?: {
            url: string
            bgColor: string
        }
        id?: string
        name: string
        trackNumber: number
        artistName: string
        albumName: string
        durationInMillis: number
        playParams: {
            catalogId: string
        }
    }
}

const NewPlaylist = () => {
    const {
        appleMusicToken,
        fetchAppleToken,
        setLibraryPlaylists,
        musicKitInstance,
        authorizeMusicKit,
        libraryPlaylists,
        darkMode,
    } = useStore(state => ({
        appleMusicToken: state.appleMusicToken,

        fetchAppleToken: state.fetchAppleToken,
        darkMode: state.darkMode,
        musicKitInstance: state.musicKitInstance,
        authorizeMusicKit: state.authorizeMusicKit,
        setLibraryPlaylists: state.setLibraryPlaylists,
        libraryPlaylists: state.libraryPlaylists,
    }))

    const [loading, setLoading] = useState(false)
    const [searchResults, setSearchResults] =
        useState<SearchResultsObject | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [playlistTracks, setPlaylistTracks] = useState<Array<Song>>([])
    const [displayMode, setDisplayMode] = useState('songs')
    const [albumsAdded, setAlbumsAdded] = useState<Array<string>>([])

    const onChange = (e: any) => {
        setSearchTerm(e.target.value)
    }

    const initialize = async () => {
        let musicKitLoaded = false
        if (!musicKitInstance) {
            console.log('Initializing MusicKit...')
            await authorizeMusicKit()
            musicKitLoaded = true
        }
    }

    const constructImageUrl = (url: String, size: Number) => {
        return url
            .replace('{w}', size.toString())
            .replace('{h}', size.toString())
    }

    useEffect(() => {
        if (!musicKitInstance) {
            initialize()
        }
        if (!appleMusicToken) {
            fetchAppleToken()
        }

        const delayDebounceFn = setTimeout(async () => {
            if (searchTerm && musicKitInstance) {
                setLoading(true)

                try {
                    // const term = searchTerm
                    const queryParameters = {
                        term: searchTerm,
                        types: ['albums', 'songs'],
                        limit: 25,
                        l: 'en-us',
                    }

                    const response = await musicKitInstance.api.music(
                        `/v1/catalog/${musicKitInstance.storefrontId}/search`,
                        queryParameters
                    )
                    // console.log(response)

                    // const queryParameters = { l: 'en-us' }

                    const data = await response.data.results
                    console.log('searchResults: ', data)
                    setSearchResults({
                        albums: data.albums.data ?? [],
                        songs: data.songs.data ?? [],
                    })
                } catch (error: any) {
                    console.error(error)
                } finally {
                    setLoading(false)
                }
            }
        }, 250) // 500ms debounce
        if (searchTerm === '') {
            setSearchResults(null)
        }

        return () => clearTimeout(delayDebounceFn)
    }, [searchTerm, musicKitInstance])

    const [playlistName, setPlaylistName] = useState('')
    const [playlistDescription, setPlaylistDescription] = useState('')

    const navigate = useNavigate()
    const createPlaylist = async (e: any) => {
        e.preventDefault()

        try {
            const response = await fetch(
                'https://api.music.apple.com/v1/me/library/playlists',
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${
                            import.meta.env.VITE_MUSICKIT_DEVELOPER_TOKEN
                        }`,
                        'Music-User-Token': appleMusicToken ?? '', // Add Music User Token here
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        attributes: {
                            name: playlistName,
                            description: playlistDescription ?? '',
                        },
                        relationships: {
                            tracks: {
                                data: playlistTracks,
                            },
                        },
                    }),
                    // credentials: 'include',
                }
            )

            console.log('response: ', response)
            const data = await response.json()
            console.log('data: ', data)
            if (response.status === 201) {
                //check for success
                toast.success('Playlist created!')
                //update sidebar playlists before refresh
                const newPlaylist = {
                    attributes: {
                        description: playlistDescription ?? '',

                        canEdit: data.data[0].attributes.canEdit,

                        dataAdded: data.data[0].attributes.dateAdded,
                        isPublic: data.data[0].attributes.isPublic,
                        lastModifiedDate:
                            data.data[0].attributes.lastModifiedDate,
                        name: playlistName,
                    },
                    href: data.data[0].href,
                    id: data.data[0].id,
                    type: 'library-playlists',
                }
                if (libraryPlaylists) {
                    setLibraryPlaylists([newPlaylist, ...libraryPlaylists])
                } else {
                    setLibraryPlaylists([newPlaylist])
                }
                navigate('/')
            }
        } catch (error: any) {
            console.error(error)
            toast.error('An error occurred..')
        } finally {
            setPlaylistName('')
            setPlaylistDescription('')
        }
    }

    const retrieveAlbumSongs = async (albumId: string) => {
        setAlbumsAdded([...albumsAdded, albumId])

        if (!musicKitInstance) {
            await authorizeMusicKit()
            return
        }
        if (!musicKitInstance || !albumId) {
            return
        }

        try {
            console.log('music kit instance and album id')
            console.log('music kit instance: ', musicKitInstance)
            console.log('albumId: ', albumId)

            if (albumId.startsWith('l')) {
                try {
                    const catRes = await musicKitInstance?.api.music(
                        `v1/me/library/albums/${albumId}/catalog`
                    )

                    const catalogId = await catRes.data.data[0].id

                    const res = await musicKitInstance.api.music(
                        `/v1/catalog//${musicKitInstance.storefrontId}/albums/${catalogId}/tracks`
                    )

                    const data = await res.data.data

                    setPlaylistTracks([...playlistTracks, ...data])
                } catch (error: any) {
                    console.error(error)
                }
            } else {
                try {
                    const queryParameters = { l: 'en-us' }
                    const res = await musicKitInstance.api.music(
                        `/v1/catalog//${musicKitInstance.storefrontId}/albums/${albumId}/tracks`,

                        queryParameters
                    )

                    console.log(res)

                    const data = await res.data.data

                    setPlaylistTracks([...playlistTracks, ...data])
                } catch (error: any) {
                    console.error(error)
                }
            }
        } catch (error: any) {
            console.error(error)
        }
    }

    return (
        <div
            className={` inset-0 flex ${darkMode ? 'text-slate-200 ' : ' text-slate-800 '} flex-col w-full items-center justify-center `}
        >
            <h2 className="text-5xl font-bold mb-10">Create New Playlist</h2>
            <form className="w-1/2 pb-10">
                <div className="mb-4 gap-4 ">
                    <label
                        className="block text-lg font-bold mb-2"
                        htmlFor="playlistName"
                    >
                        Playlist name:
                    </label>
                    <input
                        type="text"
                        id="playlistName"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-900 bg-white leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Enter playlist name..."
                        onChange={e => setPlaylistName(e.target.value)}
                        value={playlistName}
                    />
                    <label
                        className="block text-lg pt-4 font-bold mb-2"
                        htmlFor="playlistDescription"
                    >
                        Description:
                    </label>
                    <input
                        type="text"
                        id="playlistDescription"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-900 bg-white leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Enter optional playlist description..."
                        onChange={e => setPlaylistDescription(e.target.value)}
                        value={playlistDescription}
                    />
                </div>
            </form>

            <div
                className="flex flex-col w-3/4 mb-10 pb-5 border-slate-600 border-b-2 "
                style={{ minHeight: '60px' }}
            >
                <p className="flex justify-left  border-b-2 border-slate-600 text-xl font-semibold my-3 w-full">
                    Playlist tracks:
                </p>
                {/* Display playlist tracks */}
                {playlistTracks.length >= 1 ? (
                    playlistTracks.map((song, index) => (
                        <div className="flex select-none p-2 justify-between bg-slate-300 text-slate-800 my-2 rounded-lg  w-full">
                            <div className="flex gap-2 ">
                                <div className="flex items-center font-bold">
                                    #{index + 1}
                                </div>
                                {song.attributes.artwork?.url ? (
                                    <img
                                        src={constructImageUrl(
                                            song.attributes.artwork?.url,
                                            50
                                        )}
                                    />
                                ) : (
                                    <img src={defaultPlaylistArtwork} />
                                )}

                                <div className="flex flex-col">
                                    <p className="font-semibold">
                                        {song.attributes.name}
                                    </p>
                                    <p className="">
                                        {song.attributes.artistName}
                                    </p>
                                </div>
                            </div>
                            <div className="flex justify-center items-center">
                                <p className="font-bold">
                                    {song.attributes.albumName}
                                </p>{' '}
                            </div>
                            <button
                                className={`btn btn-primary bg-blue-500 hover:bg-blue-600`}
                                onClick={() =>
                                    setPlaylistTracks(
                                        playlistTracks.filter(
                                            track => track !== song
                                        )
                                    )
                                }
                            >
                                Remove
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="flex  p-2 justify-center text-lg font-semibold my-2 rounded-lg  w-full">
                        <p className="">Playlist empty, add songs below...</p>
                    </div>
                )}
            </div>
            <div
                className="flex flex-col w-3/4  items-center mx-auto rounded-lg border-2 bg-slate-300 border-slate-400"
                style={{ minHeight: '100px', maxHeight: '500px' }}
            >
                <form className="m-3 mb-1  pb-1 p-3 w-3/4 mx-auto " action="">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={e => onChange(e)}
                        placeholder="Search for songs & albums..."
                        className="border rounded-full px-3 py-2 w-full  text-slate-600 bg-white"
                    />
                </form>

                <div className="flex w-3/4 mb-2 text-xl font-bold  gap-2 justify-center">
                    <button
                        className={`btn select-none  text-black border-none  ${displayMode === 'songs' ? ' bg-blue-300' : ' cursor-pointer bg-blue-500'} p-3 m-1 rounded-full`}
                        // disabled={displayMode === 'songs'}
                        onClick={e => {
                            e.preventDefault()
                            setDisplayMode('songs')
                        }}
                    >
                        Songs
                    </button>
                    <button
                        className={`btn select-none text-black  border-none  ${displayMode === 'albums' ? ' bg-blue-300' : ' cursor-pointer bg-blue-500'} p-3 m-1 rounded-full`}
                        // disabled={displayMode === 'albums'}
                        onClick={e => {
                            e.preventDefault()
                            setDisplayMode('albums')
                        }}
                    >
                        Albums
                    </button>
                </div>
                <div className="flex flex-col w-4/5 mb-10 overflow-auto">
                    {searchResults && (
                        <div className="flex flex-col select-none mb-5 w-full">
                            {displayMode === 'songs'
                                ? searchResults.songs &&
                                  searchResults.songs.map(song => (
                                      <div className="flex my-2 p-2 justify-between bg-slate-200 text-slate-800 w-full">
                                          <div className="flex gap-2">
                                              {song.attributes.artwork?.url ? (
                                                  <img
                                                      src={constructImageUrl(
                                                          song.attributes
                                                              .artwork?.url,
                                                          50
                                                      )}
                                                  />
                                              ) : (
                                                  <img
                                                      src={
                                                          defaultPlaylistArtwork
                                                      }
                                                  />
                                              )}

                                              <div className="flex flex-col">
                                                  <p className="font-semibold">
                                                      {song.attributes.name}
                                                  </p>
                                                  <p className="">
                                                      {
                                                          song.attributes
                                                              .artistName
                                                      }
                                                  </p>
                                              </div>
                                          </div>
                                          <div className="flex justify-center items-center">
                                              <p className="font-bold">
                                                  {song.attributes.albumName}
                                              </p>{' '}
                                          </div>
                                          <button
                                              className={`btn btn-primary bg-blue-500 hover:bg-blue-600 `}
                                              disabled={playlistTracks.includes(
                                                  song
                                              )}
                                              onClick={() =>
                                                  setPlaylistTracks([
                                                      ...playlistTracks,
                                                      song,
                                                  ])
                                              }
                                          >
                                              Add
                                          </button>
                                      </div>
                                  ))
                                : searchResults.albums &&
                                  searchResults.albums?.map(album => (
                                      <div className="flex my-2 p-2 select-none justify-between bg-slate-200 text-slate-800 w-full">
                                          <div className="flex gap-2">
                                              {album.attributes.artwork?.url ? (
                                                  <img
                                                      src={constructImageUrl(
                                                          album.attributes
                                                              .artwork?.url,
                                                          50
                                                      )}
                                                  />
                                              ) : (
                                                  <img
                                                      src={
                                                          defaultPlaylistArtwork
                                                      }
                                                  />
                                              )}

                                              <div className="flex flex-col">
                                                  <p className="font-semibold">
                                                      {album.attributes.name}
                                                  </p>
                                                  <p className="">
                                                      {
                                                          album.attributes
                                                              .artistName
                                                      }
                                                  </p>
                                              </div>
                                          </div>
                                          <div className="flex justify-center items-center">
                                              <p className="font-bold">
                                                  {album.attributes.albumName}
                                              </p>{' '}
                                          </div>
                                          <button
                                              className={`btn btn-primary bg-blue-500 hover:bg-blue-600`}
                                              disabled={albumsAdded.includes(
                                                  album.id
                                              )}
                                              onClick={() =>
                                                  retrieveAlbumSongs(album.id)
                                              }
                                          >
                                              Add
                                          </button>
                                      </div>
                                  ))}
                        </div>
                    )}
                </div>
            </div>
            <div className="flex justify-center py-10">
                <button
                    type="button"
                    className="bg-gray-500 text-white hover:cursor-pointer px-4 py-2 hover:bg-gray-600 rounded mr-2"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 hover:cursor-pointer hover:bg-blue-600 rounded"
                    onClick={e => createPlaylist(e)}
                >
                    Create
                </button>
            </div>
        </div>
    )
}

export default NewPlaylist
