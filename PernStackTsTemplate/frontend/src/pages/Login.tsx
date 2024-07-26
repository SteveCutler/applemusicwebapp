import { Link } from 'react-router-dom'
import { useState } from 'react'
import useLogin from '../hooks/auth/useLogin'
import MusLogo from '../../public/MusLogo.png'
import useSignup from '../hooks/auth/useSignup'
import spiralFavicon from '/spiralFavicon.svg'
import { useStore } from '../store/store'

const Login = () => {
    const [inputs, setInputs] = useState({
        email: '',
        password: '',
    })

    const [signUpInputs, setsignUpInputs] = useState({
        signupPassword: '',
        signupconfirmPassword: '',
        signupEmail: '',
    })

    const { signup } = useSignup()

    const handleSignUpSubmitForm = (e: React.FormEvent) => {
        e.preventDefault()
        signup(signUpInputs)
    }

    const [signUp, setSignUp] = useState(false)

    const { backendToken } = useStore(state => ({
        backendToken: state.backendToken,
    }))

    const { login } = useLogin()
    const { email, password } = inputs

    // const handleSubmitForm = async (e: React.FormEvent) => {
    //     e.preventDefault()
    //     login(email, password)

    // }

    if (signUp) {
        return (
            <div className="flex flex-col absolute top-40  h-fit  min-w-96 mx-auto">
                {/* <img
                src={MusLogo}
                width="200"
                className="flex select-none  mx-auto justify-center"
            /> */}
                <img
                    src={MusLogo}
                    width="150"
                    className="flex image-select-none  mx-auto justify-center"
                    draggable="false"
                />
                <div className="w-full rounded-lg  h-fit px-6  ">
                    <div className="text-white text-lg select-none font-semibold italic flex justify-center w-full">
                        APPLE MUSIC + PODCASTS
                    </div>
                    {/* <h1 className="text-3xl font-bold flex  justify-center  items-center text-center text-black ">
                    <span className="text-blue-500"> Sign Up</span>{' '}
                    <img src={spiralFavicon} style={{ width: '40px' }} />
                </h1> */}

                    <form
                        className="font-bold"
                        // onSubmit={handleSignUpSubmitForm}
                    >
                        <div className="py-8">
                            {/* <label className="label p-2 ">
                            <span className="text-base label-text text-white">
                                Email
                            </span>
                        </label> */}

                            <input
                                type="text"
                                placeholder="Enter email"
                                className="w-full input bg-white text-black input-bordered h-10"
                                value={signUpInputs.signupEmail}
                                onChange={e =>
                                    setsignUpInputs({
                                        ...signUpInputs,
                                        signupEmail: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div className="pb-8">
                            {/* <label className="label">
                            <span className="text-base label-text">
                                Password
                            </span>
                        </label> */}
                            <input
                                type="text"
                                placeholder="Enter Password"
                                className="w-full input bg-white text-black input-bordered h-10"
                                value={signUpInputs.signupPassword}
                                onChange={e =>
                                    setsignUpInputs({
                                        ...signUpInputs,
                                        signupPassword: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div className="pb-3">
                            {/* <label className="label">
                            <span className="text-base label-text">
                                Confirm Password
                            </span>
                        </label> */}
                            <input
                                type="text"
                                placeholder="Confirm Password"
                                className="w-full input bg-white text-black input-bordered h-10"
                                value={signUpInputs.signupconfirmPassword}
                                onChange={e =>
                                    setsignUpInputs({
                                        ...signUpInputs,
                                        signupconfirmPassword: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div
                            onClick={() => {
                                setSignUp(false)
                            }}
                            className="text-sm font-bold select-none hover:text-blue-600 mt-2  inline-block text-slate-300"
                        >
                            Already have an account?
                        </div>

                        <div className="mt-5">
                            <button
                                onClick={e => {
                                    e.preventDefault()
                                    signup(signUpInputs)
                                }}
                                className="btn btn-block bg-blue-500 hover:bg-blue-600  border-none btn-sm text-lg text-white mt-2"
                            >
                                Sign Up
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    } else {
        return (
            <div className="flex flex-col absolute top-40  h-fit   min-w-96 mx-auto">
                <img
                    src={MusLogo}
                    width="150"
                    className="flex image-select-none  mx-auto justify-center"
                    draggable="false"
                />
                <div className="w-full px-6 rounded-lg text-black  bg-clip-padding ">
                    <div className="text-white text-lg select-none font-semibold italic flex justify-center w-full">
                        APPLE MUSIC + PODCASTS
                    </div>
                    {/* <h1 className="text-3xl font-bold flex justify-center items-center text-center text-black">
                    <span className="text-blue-500 select-none">Login</span>
                    <img src={spiralFavicon} style={{ width: '40px' }} />
                </h1> */}

                    <form
                        className="font-bold"
                        // onSubmit={handleSubmitForm}
                    >
                        <div className="py-8">
                            {/* <label className="label p-2 ">
                            <span className="text-white font-bold">Email</span>
                        </label> */}
                            <input
                                type="text"
                                placeholder="Enter email"
                                className="w-full input bg-white input-bordered h-10"
                                value={email}
                                onChange={e =>
                                    setInputs({
                                        ...inputs,
                                        email: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div>
                            {/* <label className="label">
                            <span className="text-white font-bold ">
                                Password
                            </span>
                        </label> */}
                            <input
                                type="password"
                                placeholder="Enter Password"
                                className="w-full input bg-white input-bordered h-10"
                                value={password}
                                onChange={e =>
                                    setInputs({
                                        ...inputs,
                                        password: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div
                            onClick={() => {
                                setSignUp(true)
                            }}
                            className="text-sm  select-none  text-slate-300 font-bold hover:text-blue-600 py-5  inline-block"
                        >
                            {"Don't"} have an account?
                        </div>

                        <div>
                            <button
                                onClick={e => {
                                    e.preventDefault()
                                    login(email, password)
                                }}
                                className="btn btn-block bg-blue-500 hover:bg-blue-600  border-none btn-sm text-lg text-white mt-2"
                            >
                                Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}
export default Login
