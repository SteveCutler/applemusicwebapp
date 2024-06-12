import { useEffect, useState } from 'react'
import { useMusickitContext } from '../../context/MusickitContext'
import { useStore } from '../../store/store'

const useMusicKit = () => {
    console.log('***#### loading music kit')
    // const { setMusicInstance } = useMusickitContext()
    const [musicKitLoaded, setMusicKitLoaded] = useState(false)
    const setMusicKitInstance = useStore(state => state.setMusicKitInstance)

    useEffect(() => {
        const script = document.createElement('script')
        script.src = 'https://js-cdn.music.apple.com/musickit/v3/musickit.js'
        script.onload = () => {
            document.addEventListener('musickitloaded', async () => {
                try {
                    const music = await (window as any).MusicKit.configure({
                        developerToken: import.meta.env
                            .VITE_MUSICKIT_DEVELOPER_TOKEN,
                        app: {
                            name: 'AppleMusicDashboard',
                            build: '1.0.0',
                        },
                    })

                    if (music) {
                        console.log('music instance created')
                        // Attach event listeners here
                        const updateState = () => {
                            console.log('******** updating state')
                            const { playbackState, nowPlayingItem } =
                                music.player
                            const isPlaying =
                                playbackState === music.PlaybackState.playing
                            const currentSongId = nowPlayingItem?.id || null
                            const currentSongDuration =
                                nowPlayingItem?.attributes.durationInMillis ||
                                null
                            useStore.setState({
                                isPlaying,
                                currentSongId,
                                currentSongDuration,
                            })
                        }

                        music.player.addEventListener(
                            'playbackStateDidChange',
                            updateState
                        )
                        music.player.addEventListener(
                            'nowPlayingItemDidChange',
                            updateState
                        )
                        music.player.addEventListener(
                            'playbackTimeDidChange',
                            () => {
                                console.log('updating time')
                                const currentElapsedTime =
                                    music.player.currentPlaybackTime
                                useStore.setState({ currentElapsedTime })
                            }
                        )

                        setMusicKitLoaded(true)
                        setMusicKitInstance(music)
                    }
                } catch (error) {
                    console.error(error)
                }
            })
        }
        document.body.appendChild(script)
    }, [setMusicKitInstance])

    return musicKitLoaded
}

export default useMusicKit
