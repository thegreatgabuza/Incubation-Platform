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

export const GovernmentRouteGuard: React.FC = () => {
  const { data: user, isLoading } = useGetIdentity<UserIdentity>();
  const [loading, setLoading] = useState(true);
  const [isGovernment, setIsGovernment] = useState(false);

  useEffect(() => {
    // Wait for auth to load
    if (!isLoading) {
      console.log("Government guard checking user:", user);
      
      // Check if user exists and has Government role
      if (user && user.role === 'Government') {
        setIsGovernment(true);
      } else {
        message.error("Access denied: Government entity privileges required");
        setIsGovernment(false);
      }
      
      setLoading(false);
    }
  }, [user, isLoading]);

  if (loading || isLoading) {
    return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }} />;
  }

  // If not a government user, redirect to home page
  if (!isGovernment) {
    return <Navigate to="/" replace />;
  }

  // If government user, render the outlet (child routes)
  return <Outlet />;
}; 