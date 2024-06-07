import { useEffect, useState } from 'react'
import { useMusickitContext } from '../../context/MusickitContext'

const useMusicKit = () => {
    const { setMusicInstance } = useMusickitContext()
    const [musicKitLoaded, setMusicKitLoaded] = useState(false)

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
                        setMusicInstance(music)
                        setMusicKitLoaded(true)
                    }
                } catch (error) {
                    console.error(error)
                }
            })
        }
        document.body.appendChild(script)
    }, [])

    return musicKitLoaded
}

export default useMusicKit
