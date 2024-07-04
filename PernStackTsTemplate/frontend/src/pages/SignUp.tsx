import { Link } from 'react-router-dom'
import spiralFavicon from '/spiralFavicon.svg'

import { useState } from 'react'
import useSignup from '../hooks/auth/useSignup'

const SignUp = () => {
    const [inputs, setInputs] = useState({
        fullName: '',
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
    })

    const { loading, signup } = useSignup()

    const handleSubmitForm = (e: React.FormEvent) => {
        e.preventDefault()
        signup(inputs)
    }
    return (
        <div className="flex flex-col rounded-lg  items-center justify-center  min-w-96 mt-5 mx-auto">
            <div className="w-full rounded-lg   p-6 shadow-md bg-slate-300  ">
                <h1 className="text-3xl font-bold flex  justify-center  items-center text-center text-black ">
                    <span className="text-blue-500"> Sign Up</span>{' '}
                    <img src={spiralFavicon} style={{ width: '40px' }} />
                </h1>

                <form className="font-bold" onSubmit={handleSubmitForm}>
                    <div>
                        <label className="label p-2">
                            <span className="text-base label-text ">
                                Full Name
                            </span>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter full name"
                            className="w-full input bg-white text-black input-bordered  h-10"
                            value={inputs.fullName}
                            onChange={e =>
                                setInputs({
                                    ...inputs,
                                    fullName: e.target.value,
                                })
                            }
                        />
                    </div>

                    <div>
                        <label className="label p-2 ">
                            <span className="text-base label-text text-white">
                                Username
                            </span>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter username"
                            className="w-full input bg-white text-black input-bordered h-10"
                            value={inputs.username}
                            onChange={e =>
                                setInputs({
                                    ...inputs,
                                    username: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div>
                        <label className="label p-2 ">
                            <span className="text-base label-text text-white">
                                Email
                            </span>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter email"
                            className="w-full input bg-white text-black input-bordered h-10"
                            value={inputs.email}
                            onChange={e =>
                                setInputs({
                                    ...inputs,
                                    email: e.target.value,
                                })
                            }
                        />
                    </div>

                    <div>
                        <label className="label">
                            <span className="text-base label-text">
                                Password
                            </span>
                        </label>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            className="w-full input bg-white text-black input-bordered h-10"
                            value={inputs.password}
                            onChange={e =>
                                setInputs({
                                    ...inputs,
                                    password: e.target.value,
                                })
                            }
                        />
                    </div>

                    <div>
                        <label className="label">
                            <span className="text-base label-text">
                                Confirm Password
                            </span>
                        </label>
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            className="w-full input bg-white text-black input-bordered h-10"
                            value={inputs.confirmPassword}
                            onChange={e =>
                                setInputs({
                                    ...inputs,
                                    confirmPassword: e.target.value,
                                })
                            }
                        />
                    </div>

                    <Link
                        to={'/login'}
                        className="text-md font-bold  hover:text-blue-600 mt-2 inline-block text-black"
                    >
                        Already have an account?
                    </Link>

                    <div className="mt-5">
                        <button
                            className="btn btn-block border-none select-none text-lg  text-white py-2 items-center justify-center  flex   bg-blue-500 hover:bg-blue-600"
                            disabled={loading}
                        >
                            {loading ? 'Loading...' : 'Sign Up'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default SignUp
