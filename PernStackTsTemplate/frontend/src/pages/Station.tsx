import { useParams } from 'react-router-dom'
import FetchStationData from '../components/Apple/FetchStationData'
import TrackDisplay from '../components/AlbumPage/TrackDisplay'
import { MdArrowBackIosNew } from 'react-icons/md'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useStore } from '../store/store'
import { FaCirclePlay, FaRegCirclePause } from 'react-icons/fa6'
import ScrollToTop from '../components/Homepage/ScrollToTop'

type AlbumType = {
    attributes: AttributeObject
    relationships: RelationshipObject
    id: string
}

type AttributeObject = {
    artistName: string
    artwork: ArtworkObject
    dateAdded: string
    genreNames: Array<string>
    name: string
    releasedDate: string
    trackCount: Number
}
type RelationshipObject = {
    tracks: TracksObject
}

type TracksObject = {
    data: Array<Track>
}
type Track = {
    attributes: TrackAttributeObject
}

type TrackAttributeObject = {
    artistName: string
    artwork: ArtworkObject
    dateAdded: string
    genreNames: Array<string>
    durationInMillis: Number
    name: string
    releasedDate: string
    trackCount: Number
    playParams: PlayParameterObject
}

type PlayParameterObject = {
    catalogId: string
    id: string
    isLibrary: Boolean
    kind: string
}

type ArtworkObject = {
    height: Number
    width: Number
    url: string
}

const Station = () => {
    const { stationId, type } = useParams<{ stationId: string; type: string }>()
    console.log(type)
    const { stationData, loading, error } = FetchStationData(stationId)
    const {
        setSearchTerm,
        musicKitInstance,
        isPlaying,
        playlist,
        setPlaylist,
    } = useStore(state => ({
        setSearchTerm: state.setSearchTerm,
        musicKitInstance: state.musicKitInstance,
        isPlaying: state.isPlaying,
        playlist: state.playlist,
        setPlaylist: state.setPlaylist,
    }))

    // console.log('album data: ', albumData)
    const constructImageUrl = (url: string, size: number) => {
        return url
            .replace('{w}', size.toString())
            .replace('{h}', size.toString())
    }

    const setTerm = () => {
        setSearchTerm(stationData.attributes.artistName)
    }

    const playRadioStation = async () => {
        try {
            await musicKitInstance?.setQueue({ station: stationId })
        } catch (error) {
            console.error('Error playing radio station:', error)
        }
    }

    const playData = async () => {
        await playRadioStation()
        musicKitInstance?.play()
    }

    const styleButton = { fontSize: '3rem', color: 'royalblue ' }

    const style = { fontSize: '1.5em' }
    if (loading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>Error: {error}</div>
    }

    if (!stationData) {
        return <div>No album data available</div>
    }

    if (stationData) {
        return (
            <div className="flex-col w-4/5 text-slate-800 mx-auto h-full">
                <ScrollToTop />
                <Link to="/">
                    <div className="sticky mb-10 mt-5 top-1 left-1">
                        {' '}
                        <MdArrowBackIosNew style={style} />
                    </div>
                </Link>
                <div className="flex-col ">
                    <h1 className="text-5xl font-bold">
                        {stationData.attributes.name}
                    </h1>
                </div>
                <div className="flex w-full justify-between gap-4 py-3  ">
                    <div className="relative">
                        <img
                            src={constructImageUrl(
                                stationData.attributes.artwork.url,
                                500
                            )}
                            alt=""
                        />
                        <div
                            className=" absolute bottom-10 right-10 hover:cursor-pointer transform   flex justify-right hover:scale-110 active:scale-95 transition-transform duration-100 easy-ease"
                            onClick={async e => {
                                e.preventDefault()
                                e.stopPropagation() // Prevents the link's default behavior
                                // await FetchstationData(albumId)
                                // handlePlayPause()

                                await playData()
                            }}
                        >
                            {isPlaying &&
                            musicKitInstance?.nowPlayingItem.attributes.name ===
                                stationData.attributes.name ? (
                                <FaRegCirclePause style={styleButton} />
                            ) : (
                                <FaCirclePlay style={styleButton} />
                            )}
                        </div>
                    </div>
                    {/* <TrackDisplay
                        albumTracks={stationData.relationships.tracks.data}
                    /> */}
                    {/* MAKE TRACK GETTER, ETC. DESIGN PAGE LAYOUT */}
                </div>
            </div>
        )
    }
}

export default Station
