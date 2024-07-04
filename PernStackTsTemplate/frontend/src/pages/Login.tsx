import { Link } from 'react-router-dom'
import { useState } from 'react'
import useLogin from '../hooks/auth/useLogin'
import spiralFavicon from '/spiralFavicon.svg'

const Login = () => {
    const [inputs, setInputs] = useState({
        email: '',
        password: '',
    })

    const { loading, login } = useLogin()
    const { email, password } = inputs

    const handleSubmitForm = async (e: React.FormEvent) => {
        e.preventDefault()
        login(email, password)
    }

    return (
        <div className="flex flex-col h-full -translate-y-10 items-center justify-center min-w-96 mx-auto">
            <div className="w-full p-6 rounded-lg text-black shadow-xl bg-slate-300 bg-clip-padding ">
                <h1 className="text-3xl font-bold flex justify-center items-center text-center text-black">
                    Muse
                    <span className="text-blue-500">Login</span>
                    <img src={spiralFavicon} style={{ width: '40px' }} />
                </h1>

                <form className="font-bold" onSubmit={handleSubmitForm}>
                    <div>
                        <label className="label p-2 ">
                            <span className="text-base font-bold label-text">
                                Email
                            </span>
                        </label>
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
                        <label className="label">
                            <span className="text-base font-bold label-text">
                                Password
                            </span>
                        </label>
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
                    <Link
                        to="/signup"
                        className="text-sm   text-black font-bold hover:text-blue-600 mt-2 py-3 inline-block"
                    >
                        {"Don't"} have an account?
                    </Link>

                    <div>
                        <button
                            className="btn btn-block bg-blue-500 hover:bg-blue-600  border-none btn-sm text-lg text-white mt-2"
                            disabled={loading}
                        >
                            {loading ? 'Loading...' : 'Login'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default Login
