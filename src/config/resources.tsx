import { IResourceItem } from "@refinedev/core";
import React from "react";

import {
  DashboardOutlined,
  ShopOutlined,
  SettingOutlined,
  FormOutlined,
  FundOutlined,
  ApartmentOutlined,
  TeamOutlined,
  AppstoreOutlined,
  UserOutlined,
  SafetyCertificateOutlined,
  BarChartOutlined,
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
  {
    name: "operations-forms",
    list: "/operations/forms",
    meta: {
      label: "Forms Management",
      icon: <FormOutlined />,
    },
  },
  {
    name: "operations-resources",
    list: "/operations/resources",
    meta: {
      label: "Resource Management",
      icon: <AppstoreOutlined />,
    },
  },
  {
    name: "operations-participants",
    list: "/operations/participants",
    meta: {
      label: "Participant Management",
      icon: <UserOutlined />,
    },
  },
  {
    name: "mentorship-assignments",
    list: "/operations/mentorship-assignments",
    meta: {
      label: "Mentorship Assignments",
      icon: <TeamOutlined />,
    },
  },
  {
    name: "operations-compliance",
    list: "/operations/compliance",
    meta: {
      label: "Compliance Management",
      icon: <SafetyCertificateOutlined />,
    },
  },
  {
    name: "operations-reports",
    list: "/operations/reports",
    meta: {
      label: "Reports & Analytics",
      icon: <BarChartOutlined />,
    },
  },
];

const consultantResources: IResourceItem[] = [
  {
    name: "consultant",
    list: "/consultant",
    meta: {
      label: "Consultant Dashboard",
      icon: <TeamOutlined />,
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

// Helper function to filter resources based on role
const filterResourcesByRole = (role: string) => {
  // For operations users, don't include the common resources
  if (role === 'operations') {
    return [...operationsResources];
  }
  
  // For admins
  if (role === 'admin') {
    return [...commonResources, ...adminResources];
  }
  
  // For directors
  if (role === 'director') {
    return [...commonResources, ...directorResources];
  }
  
  // For consultants
  if (role === 'consultant') {
    return [...commonResources, ...consultantResources];
  }
  
  // Default: all resources
  return [
    ...commonResources,
    ...adminResources,
    ...directorResources,
    ...operationsResources,
    ...consultantResources,
  ];
};

// Export combined resources
// In a real implementation, you would filter these based on user role
// This will be filtered by the layout component
export const resources: IResourceItem[] = [
  ...commonResources,
  ...adminResources,
  ...directorResources,
  ...operationsResources,
  ...consultantResources,
];

// Export the filtered resources function for use in the layout component
export const getFilteredResources = filterResourcesByRole;
