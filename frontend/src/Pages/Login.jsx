import { Link } from "react-router-dom";

export default function Login() {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white shadow-xl border border-gray-200 rounded-2xl p-8">

                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    Login
                </h1>

                <form className="space-y-5">
                    {/* Email */}
                    <div>
                        <label className="block text-gray-700 mb-2 font-medium">
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-gray-700 mb-2 font-medium">
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Remember + Forgot */}
                    <div className="flex justify-between items-center text-sm">
                        <label className="flex items-center gap-2 text-gray-600">
                            <input type="checkbox" />
                            Remember me
                        </label>

                        <a href="#" className="text-blue-500 hover:underline">
                            Forgot Password?
                        </a>
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition duration-300"
                    >
                        Login
                    </button>
                </form>

                {/* Signup */}
                <p className="text-center text-gray-600 mt-6 text-sm">
                    Don't have an account?{" "}
                    <Link to="/SignUp" className="text-black font-medium hover:underline">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
}
