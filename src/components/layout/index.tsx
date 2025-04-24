import React from "react";
import { ThemedLayoutV2, ThemedTitleV2 } from "@refinedev/antd";
import { Header } from "./header";
import { CustomSider } from "./sider";

export const Layout = ({ children }: React.PropsWithChildren) => {
  return (
    <>
      <ThemedLayoutV2
        Header={Header}
        Sider={CustomSider}
        Title={(titleProps) => {
          return <ThemedTitleV2 {...titleProps} text='Incubation Platform' />;
        }}
      >
        {children}
      </ThemedLayoutV2>
    </>
  );
};
