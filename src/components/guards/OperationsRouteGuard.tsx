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

export const OperationsRouteGuard: React.FC = () => {
  const { data: user, isLoading } = useGetIdentity<UserIdentity>();
  const [loading, setLoading] = useState(true);
  const [isOperations, setIsOperations] = useState(false);

  useEffect(() => {
    // Wait for auth to load
    if (!isLoading) {
      console.log("Operations guard checking user:", user);
      
      // Check if user exists and has Operations role
      if (user && user.role === 'Operations') {
        setIsOperations(true);
      } else {
        message.error("Access denied: Operations privileges required");
        setIsOperations(false);
      }
      
      setLoading(false);
    }
  }, [user, isLoading]);

  if (loading || isLoading) {
    return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }} />;
  }

  // If not operations, redirect to home page
  if (!isOperations) {
    return <Navigate to="/" replace />;
  }

  // If operations, render the outlet (child routes)
  return <Outlet />;
}; 