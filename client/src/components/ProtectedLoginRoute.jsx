// components/ProtectedLoginRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import getDashboardPath from "../utils/getDashboardPath";
import Loading from "./Loading";

const ProtectedLoginRoute = ({ children }) => {
    const { user, loading } = useUser();
    console.log("ProtectedLoginRoute user:", user);

    if (loading) return <Loading/>;

    if (user) {
        return <Navigate to={getDashboardPath(user?.role)} replace />;
    }

    return children;
};

export default ProtectedLoginRoute;
