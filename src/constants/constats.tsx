import { Home, PlusCircle, Building2, CreditCard, User2 } from "lucide-react";

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
    title: "Home Page",
    url: "/",
    icon: Home,
  },
  {
    title: "My Profile",
    url: "/my-profile",
    icon: User2,
  },
  {
    title: "Add Property",
    url: "/my-profile/add-property",
    icon: PlusCircle,
  },

  {
    title: "My Properties",
    url: "/my-profile/my-listings",
    icon: Building2,
  },
  {
    title: "Balance",
    url: "/my-profile/balance",
    icon: CreditCard,
  },
];
