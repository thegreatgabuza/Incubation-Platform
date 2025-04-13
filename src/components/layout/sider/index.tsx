import React, { useMemo } from "react";
import { useGetIdentity, useResource } from "@refinedev/core";
import { ThemedSiderV2 } from "@refinedev/antd";
import { IResourceItem } from "@refinedev/core";

interface UserIdentity {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  avatar?: string;
}

// Define the props interface by extending React.ComponentProps
type ThemedSiderV2Props = React.ComponentProps<typeof ThemedSiderV2>;

export const CustomSider: React.FC = () => {
  const { data: user } = useGetIdentity<UserIdentity>();
  const { resources } = useResource();

  // Filter resources based on user role
  const filteredResources = useMemo(() => {
    const isAdmin = user?.role === 'Admin';
    const isDirector = user?.role === 'Director';

    // Filter resources based on role
    return resources.filter((resource) => {
      // Common resources are accessible to all users
      if (resource.name === 'dashboard' || resource.name === 'companies') {
        return true;
      }

      // Admin-specific resources
      if ((resource.name === 'admin' || resource.name === 'forms') && !isAdmin) {
        return false;
      }

      // Director-specific resources
      if (resource.name === 'director' && !isDirector) {
        return false;
      }

      return true;
    });
  }, [resources, user?.role]);

  return (
    <ThemedSiderV2
      Title={({ collapsed }) => (
        <div style={{ 
          padding: collapsed ? "0 16px" : "0 16px", 
          fontSize: collapsed ? "16px" : "22px", 
          fontWeight: 700,
          textAlign: collapsed ? "center" : "left",
          overflow: "hidden"
        }}>
          {collapsed ? "IP" : "Incubation Platform"}
        </div>
      )}
      resources={filteredResources}
    />
  );
}; 