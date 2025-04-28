import React from "react";
import { ThemedSiderV2 } from "@refinedev/antd";
import type { RefineThemedLayoutV2SiderProps } from "@refinedev/antd";

export const CustomSider: React.FC<RefineThemedLayoutV2SiderProps> = (props) => {
  return (
    <ThemedSiderV2
      {...props}
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
    />
  );
}; 