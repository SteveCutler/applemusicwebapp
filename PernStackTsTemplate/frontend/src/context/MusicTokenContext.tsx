import {
    Dispatch,
    ReactNode,
    SetStateAction,
    useState,
    createContext,
    useContext,
} from 'react'

type MusickitContext = {
    musicUserToken: String | null
    setMusicUserToken: Dispatch<SetStateAction<String | null>>
}

const MusicUserTokenContext = createContext<MusickitContext>({
    musicUserToken: null,
    setMusicUserToken: () => {},
})

export const useMusicTokenContext = () => {
    return useContext(MusicUserTokenContext)
}

export const MusicUserTokenContextProvdider = ({
    children,
}: {
    children: ReactNode
}) => {
    const [musicUserToken, setMusicUserToken] = useState<String | null>(null)

    return (
        <MusicUserTokenContext.Provider
            value={{ musicUserToken, setMusicUserToken }}
        >
            {children}
        </MusicUserTokenContext.Provider>
    )
}
