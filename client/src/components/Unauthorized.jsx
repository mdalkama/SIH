// pages/Unauthorized.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";

const Unauthorized = () => {
    const navigate = useNavigate();

    return (
        <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="bg-gray-100 shadow-lg rounded-2xl p-10 max-w-md">
                <div className="flex justify-center mb-6">
                    <Lock className="h-16 w-16 text-red-500" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    Unauthorized Access
                </h1>
                <p className="text-gray-600 mb-6">
                    You don’t have permission to view this page.
                    Please contact admin if you think this is a mistake.
                </p>

                <div className="flex gap-4 justify-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-5 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
                    >
                        Go Back
                    </button>
                    <button
                        onClick={() => navigate("/login")}
                        className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;
