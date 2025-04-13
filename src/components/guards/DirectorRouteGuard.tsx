import React, { useEffect, useState } from "react";
import { useGetIdentity } from "@refinedev/core";
import { Navigate, Outlet } from "react-router-dom";
import { Spin, message } from "antd";

interface UserIdentity {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  avatar?: string;
  [key: string]: any;
}

export const DirectorRouteGuard: React.FC = () => {
  const { data: user, isLoading } = useGetIdentity<UserIdentity>();
  const [loading, setLoading] = useState(true);
  const [isDirector, setIsDirector] = useState(false);

  useEffect(() => {
    // Wait for auth to load
    if (!isLoading) {
      console.log("Director guard checking user:", user);
      
      // Check if user exists and has Director role
      if (user && user.role === 'Director') {
        setIsDirector(true);
      } else {
        message.error("Access denied: Director privileges required");
        setIsDirector(false);
      }
      
      setLoading(false);
    }
  }, [user, isLoading]);

  if (loading || isLoading) {
    return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }} />;
  }

  // If not a director, redirect to home page
  if (!isDirector) {
    return <Navigate to="/" replace />;
  }

  // If director, render the outlet (child routes)
  return <Outlet />;
}; 