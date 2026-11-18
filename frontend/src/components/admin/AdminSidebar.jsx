import { NavLink, Link } from "react-router-dom";

const navigationItems = [
  {
    label: "Overview",
    path: "/admin",
    icon: "▦",
    end: true,
  },
  {
    label: "Approval queue",
    path: "/admin/verifications",
    icon: "✓",
  },
  {
    label: "Platform stats",
    path: "/admin/stats",
    icon: "▥",
  },
  {
    label: "Reports",
    path: "/admin/reports",
    icon: "▤",
  },
];
