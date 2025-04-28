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

export const ConsultantRouteGuard: React.FC = () => {
  const { data: user, isLoading } = useGetIdentity<UserIdentity>();
  const [loading, setLoading] = useState(true);
  const [isConsultant, setIsConsultant] = useState(false);

  useEffect(() => {
    // Wait for auth to load
    if (!isLoading) {
      console.log("Consultant guard checking user:", user);
      
      // Check if user exists and has Consultant role
      if (user && user.role === 'Consultant') {
        setIsConsultant(true);
      } else {
        message.error("Access denied: Consultant privileges required");
        setIsConsultant(false);
      }
      
      setLoading(false);
    }
  }, [user, isLoading]);

  if (loading || isLoading) {
    return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }} />;
  }

  // If not a consultant, redirect to home page
  if (!isConsultant) {
    return <Navigate to="/" replace />;
  }

  // If consultant, render the outlet (child routes)
  return <Outlet />;
}; 