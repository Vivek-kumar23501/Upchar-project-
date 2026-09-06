import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
    const location = useLocation();

    // Get authentication data
    const token = localStorage.getItem("token");
    const session = localStorage.getItem("user");

    console.log("========== PROTECTED ROUTE ==========");
    console.log("Current Path:", location.pathname);
    console.log("Token:", token);
    console.log("User Session:", session);
    console.log("Allowed Roles:", allowedRoles);

    // --------------------------------------------------
    // 1. Check user session
    // --------------------------------------------------
    if (!session) {
        console.log("❌ No user session found");
        console.log("➡️ Redirecting to /");

        return <Navigate to="/" replace />;
    }

    let user;

    // --------------------------------------------------
    // 2. Parse user data
    // --------------------------------------------------
    try {
        user = JSON.parse(session);
    } catch (error) {
        console.error("❌ Invalid user JSON:", error);

        localStorage.removeItem("user");
        localStorage.removeItem("token");

        return <Navigate to="/" replace />;
    }

    console.log("✅ Parsed User:", user);
    console.log("User ID:", user?.id);
    console.log("User Email:", user?.email);
    console.log("User Role:", user?.role);

    // --------------------------------------------------
    // 3. Check token
    // --------------------------------------------------
    if (!token) {
        console.log("❌ Token not found");
        console.log("➡️ Redirecting to /");

        localStorage.removeItem("user");

        return <Navigate to="/" replace />;
    }

    // --------------------------------------------------
    // 4. Check role
    // --------------------------------------------------
    if (allowedRoles && allowedRoles.length > 0) {

        // Normalize role
        const userRole = user?.role?.trim().toLowerCase();

        const roles = allowedRoles.map((role) =>
            role.trim().toLowerCase()
        );

        console.log("Normalized User Role:", userRole);
        console.log("Normalized Allowed Roles:", roles);

        if (!userRole) {
            console.log("❌ User role is missing");
            console.log("➡️ Redirecting to /");

            return <Navigate to="/" replace />;
        }

        if (!roles.includes(userRole)) {
            console.log("❌ Role not allowed");
            console.log("User Role:", userRole);
            console.log("Allowed:", roles);
            console.log("➡️ Redirecting to /");

            return <Navigate to="/" replace />;
        }
    }

    // --------------------------------------------------
    // 5. Authorized
    // --------------------------------------------------
    console.log("✅ AUTHORIZED");
    console.log("➡️ Rendering protected page");
    console.log("====================================");

    return children;
}