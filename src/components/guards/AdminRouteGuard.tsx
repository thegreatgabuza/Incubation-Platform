import React, { useEffect, useState } from "react";
import { useGetIdentity } from "@refinedev/core";
import { Navigate, Outlet } from "react-router-dom";
import { Spin, Alert, message } from "antd";

interface UserIdentity {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  avatar?: string;
  [key: string]: any;
}

export const AdminRouteGuard: React.FC = () => {
  const { data: user, isLoading } = useGetIdentity<UserIdentity>();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Wait for auth to load
    if (!isLoading) {
      console.log("Admin guard checking user:", user);
      
      // Check if user exists and has Admin role
      if (user && user.role === 'Admin') {
        setIsAdmin(true);
      } else {
        message.error("Access denied: Admin privileges required");
        setIsAdmin(false);
      }
      
      setLoading(false);
    }
  }, [user, isLoading]);

  if (loading || isLoading) {
    return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }} />;
  }

  // If not an admin, redirect to home page
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // If admin, render the outlet (child routes)
  return <Outlet />;
}; 