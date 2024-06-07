import { Link } from 'react-router-dom'
import { useState } from 'react'
import useLogin from '../hooks/auth/useLogin'

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
        <div className="flex flex-col items-center justify-center min-w-96 mx-auto">
            <div className="w-full p-6 rounded-lg shadow-md bg-slate-900 bg-clip-padding ">
                <h1 className="text-3xl font-semibold text-center text-white">
                    Apple
                    <span className="text-blue-500">Dashboard</span>
                </h1>

                <form onSubmit={handleSubmitForm}>
                    <div>
                        <label className="label p-2 ">
                            <span className="text-base label-text">Email</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter email"
                            className="w-full input input-bordered h-10"
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
                            <span className="text-base label-text">
                                Password
                            </span>
                        </label>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            className="w-full input input-bordered h-10"
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
                        className="text-sm  hover:underline text-white hover:text-blue-600 mt-2 inline-block"
                    >
                        {"Don't"} have an account?
                    </Link>

                    <div>
                        <button
                            className="btn btn-block btn-sm mt-2"
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
