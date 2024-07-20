import { Link } from 'react-router-dom'
import spiralFavicon from '/spiralFavicon.svg'
import MusLogo from '../../public/MusLogo.png'
import { useState } from 'react'
import useSignup from '../hooks/auth/useSignup'
import { useStore } from '../store/store'
import AuthorizeButton from '../components/Homepage/RequestAuthorization'
import { FaRegArrowAltCircleDown } from 'react-icons/fa'
import ImportPodcasts from '../components/Homepage/ImportPodcasts'

const SignUp = () => {
    const [inputs, setInputs] = useState({
        password: '',
        confirmPassword: '',
        email: '',
    })
    const { musicKitInstance, appleMusicToken, podSubs } = useStore(state => ({
        musicKitInstance: state.musicKitInstance,
        appleMusicToken: state.appleMusicToken,
        podSubs: state.podSubs,
    }))

    const style = { fontSize: '2rem', color: 'lightgreen' }
    const { loading, signup } = useSignup()

    // const handleSubmitForm = (e: React.FormEvent) => {
    //     e.preventDefault()
    //     signup(inputs)
    // }
    return (
        <div className="flex flex-col rounded-lg  text-white items-center  -translate-y-20 justify-center h-full text-lg   font-bold   min-w-96  mx-auto">
            <div className="text-5xl select-none text-white italic mb-10">
                WELCOME TO MÜS
            </div>
            <div className="text-md text-white pb-2 font-semibold select-none ">
                Log in to Apple Music to continue:
            </div>
            <div className="flex gap-1 text-center mx-auto text-md flex-col">
                <div>{!appleMusicToken ? <AuthorizeButton /> : 'done!'}</div>
            </div>
            {/* <div className="mt-10 ">
                <div>Optional:</div>
                Import your podcast subscriptions from apple podcasts
                <div className="border-2 max-w-96 bg-blue-500 text-white border-white rounded-lg  p-5">
                    You can use this tool to export your podcast subscriptions
                    from Apple Podcasts and upload it below
                    <a
                        href="https://www.icloud.com/shortcuts/44009520675540d7945263e088f6e915"
                        target="_blank" // Optional: Opens the link in a new tab
                        rel="noopener noreferrer" // Optional: Adds security for external links
                        className="block bg-white text-center hover:text-blue-600  active:scale-95 text-blue-400 p-1 mt-3 text-md rounded-full" // Replace with your button styles
                    >
                        Podcast Export Tool
                    </a>
                </div>
                <div className="max-w-96 flex mt-3 items-center justify-center">
                    <FaRegArrowAltCircleDown style={style} />
                </div>
                <div className="flex justify-start w-fit">
                    <ImportPodcasts />
                </div>
            </div> */}
        </div>
    )
}
export default SignUp
