import {
    Dispatch,
    ReactNode,
    SetStateAction,
    useState,
    createContext,
    useEffect,
    useContext,
} from 'react'

type MusicInstanceType = any

type MusickitContext = {
    musicInstance: MusicInstanceType | null
    setMusicInstance: Dispatch<SetStateAction<MusicInstanceType | null>>
    isLoading: boolean
}

const MusickitContext = createContext<MusickitContext>({
    musicInstance: null,
    setMusicInstance: () => {},
    isLoading: true,
})

export const useMusickitContext = () => {
    return useContext(MusickitContext)
}

export const MusickitContextProvdider = ({
    children,
}: {
    children: ReactNode
}) => {
    const [musicInstance, setMusicInstance] =
        useState<MusicInstanceType | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchMusickitInstance = async () => {
            try {
                setIsLoading(true)
            } catch (error) {
            } finally {
                setIsLoading(false)
            }
            fetchMusickitInstance()
        }
    }, [])
    return (
        <MusickitContext.Provider
            value={{ musicInstance, isLoading, setMusicInstance }}
        >
            {children}
        </MusickitContext.Provider>
    )
}
