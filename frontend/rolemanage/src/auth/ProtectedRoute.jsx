import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { profile } = useSelector((state) => state.user);

  const userRole = profile.role?.toLowerCase();

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to={`/${userRole}`} replace />;
  }

  return children;
};

export default ProtectedRoute;

