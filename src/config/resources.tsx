import { IResourceItem } from "@refinedev/core";
import React from "react";

import {
  DashboardOutlined,
  ShopOutlined,
  SettingOutlined,
  FormOutlined,
  FundOutlined,
  ApartmentOutlined
} from "@ant-design/icons";

// Separate resources by role
const adminResources: IResourceItem[] = [
  {
    name: "admin",
    list: "/admin",
    meta: {
      label: "Admin Panel",
      icon: <SettingOutlined />,
    },
  },
  {
    name: "forms",
    list: "/admin/forms",
    show: "/forms/:formId",
    meta: {
      canDelete: true,
      icon: <FormOutlined />,
      label: "Forms & Templates",
    },
  },
];

const directorResources: IResourceItem[] = [
  {
    name: "director",
    list: "/director",
    meta: {
      label: "Director Dashboard",
      icon: <FundOutlined />,
    },
  },
];

const operationsResources: IResourceItem[] = [
  {
    name: "operations",
    list: "/operations",
    meta: {
      label: "Operations Dashboard",
      icon: <ApartmentOutlined />,
    },
  },
];

// Common resources for all roles
const commonResources: IResourceItem[] = [
  {
    name: "dashboard",
    list: "/",
    meta: {
      label: "Dashboard",
      icon: <DashboardOutlined />,
    },
  },
  {
    name: "companies",
    list: "/companies",
    show: "/companies/:id",
    create: "/companies/new",
    edit: "/companies/edit/:id",
    meta: {
      label: "Companies",
      icon: <ShopOutlined />,
    },
  },
];

// Export combined resources
// In a real implementation, you would filter these based on user role
// This will be filtered by the layout component
export const resources: IResourceItem[] = [
  ...commonResources,
  ...adminResources,
  ...directorResources,
  ...operationsResources,
];
