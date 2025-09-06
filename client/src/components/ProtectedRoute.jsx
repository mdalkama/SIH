// components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import getDashboardPath from "../utils/getDashboardPath";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useUser();

  if (loading) return <p>Loading...</p>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // case-insensitive check
  const normalizedAllowed = allowedRoles?.map(r => r.toLowerCase());
  const normalizedUserRole = user.role?.toLowerCase();

  if (normalizedAllowed && !normalizedAllowed.includes(normalizedUserRole)) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  return children;
};

export default ProtectedRoute;
