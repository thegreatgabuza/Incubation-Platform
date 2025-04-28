import React from "react";
import { useGetIdentity } from "@refinedev/core";
import { DirectorDashboard } from "@/components/dashboards";

interface UserIdentity {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  avatar?: string;
  [key: string]: any;
}

export const DirectorDashboardPage: React.FC = () => {
  const { data: user } = useGetIdentity<UserIdentity>();

  // Simply render the dashboard component
  return <DirectorDashboard />;
}; 