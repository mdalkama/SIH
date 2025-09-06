// src/components/NotFound.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
            <h1 className="text-5xl font-bold text-red-600">404</h1>
            <p className="text-lg text-gray-700 mt-2">Page Not Found</p>
            <button
                onClick={() => navigate("/login")}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
            >
                Go to Login
            </button>
        </div>
    );
};

export default NotFound;
