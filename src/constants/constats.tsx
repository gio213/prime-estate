import { Home, PlusCircle } from "lucide-react";

export const navbarItems = [
  {
    name: "Home",
    href: "/",
    icon: <Home size={20} />,
  },
  {
    name: "About",
    href: "/about",
  },
  {
    name: "Contact",
    href: "/contact",
  },
  {
    name: "Blog",
    href: "/blog",
  },
  {
    name: "Properties",
    href: "/properties",
  },
];

export const sideBarItems = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "#",
    icon: PlusCircle,
  },
  {
    title: "My Properties",
    url: "#",
    icon: PlusCircle,
  },
];
