import React from 'react'
import { useMusickitContext } from '../../context/MusickitContext'
import { usePlayerContext } from '../../context/PlayerContext'
import { play } from '../../reducers/Actions'
import { Song } from '../../reducers/PlayerReducers'

const PlaySong = () => {
    const { musicInstance: music } = useMusickitContext()
    // const { state, dispatch } = usePlayerContext()

    const playSong = async (songId: string) => {
        console.log(songId)
        await music.setQueue({ song: songId })
        music.play()
    }

    return { playSong }
}

export default PlaySong
