// Type definitions
export interface PricingPlan {
  id: string;
  packageName: string;
  credits: number;
  price: number;
  currency: string;
  pricePerCredit: number;
  savings: number;
  savingsPercentage: number;
  productId: string;
  icon?: ReactNode;
  popular?: boolean;
}
import { env } from "@/lib/env";
import {
  Home,
  PlusCircle,
  Coins,
  Building2,
  User2,
  Zap,
  Package,
  Star,
  Trophy,
  Rocket,
  BadgeInfo,
  MessageCircle,
} from "lucide-react";
import { ReactNode } from "react";

export const navbarItems = [
  {
    name: "Home",
    href: "/",
    icon: <Home size={20} className="dark:text-accent-foreground" />,
  },
  {
    name: "About Us",
    href: "/about",
    icon: <BadgeInfo size={20} className="dark:text-accent-foreground" />,
  },
  {
    name: "Contact",
    href: "/contact",
    icon: <MessageCircle size={20} className="dark:text-accent-foreground" />,
  },

  {
    name: "Properties",
    href: "/properties",
    icon: <Building2 size={20} className="dark:text-accent-foreground" />,
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
    title: "Manage Credits",
    url: "/my-profile/manage-credits",
    icon: Coins,
  },
];

export const pricingPlans: PricingPlan[] = [
  {
    id: "starter",
    packageName: "Starter",
    credits: 1,
    price: 5,
    currency: "EUR",
    pricePerCredit: 5.0,
    savings: 0,
    savingsPercentage: 0,
    productId: env.NEXT_PUBLIC_STRIPE_STARTER_ID,
    icon: <Zap className="h-6 w-6 text-blue-500" />,
  },
  {
    id: "small-bundle",
    packageName: "Small Bundle",
    credits: 2,
    price: 8,
    currency: "EUR",
    pricePerCredit: 4.0,
    savings: 2,
    savingsPercentage: 20,
    productId: env.NEXT_PUBLIC_STRIPE_SMALL_BUNDLE_ID,
    icon: <Package className="h-6 w-6 text-green-500" />,
  },
  {
    id: "popular-choice",
    packageName: "Popular Choice",
    credits: 5,
    price: 18,
    currency: "EUR",
    pricePerCredit: 3.6,
    savings: 7,
    savingsPercentage: 28,
    productId: env.NEXT_PUBLIC_STRIPE_POPULAR_CHOICE_ID,
    icon: <Star className="h-6 w-6 text-yellow-500" />,
    popular: true,
  },
  {
    id: "pro-bundle",
    packageName: "Pro Bundle",
    credits: 10,
    price: 34,
    currency: "EUR",
    pricePerCredit: 3.4,
    savings: 16,
    savingsPercentage: 32,
    productId: env.NEXT_PUBLIC_STRIPE_PRO_BUNDLE_ID,
    icon: <Trophy className="h-6 w-6 text-purple-500" />,
  },
  {
    id: "power-seller",
    packageName: "Power Seller",
    credits: 20,
    price: 65,
    currency: "EUR",
    pricePerCredit: 3.25,
    savings: 35,
    savingsPercentage: 35,
    productId: env.NEXT_PUBLIC_STRIPE_POWER_SELLER_ID,
    icon: <Rocket className="h-6 w-6 text-red-500" />,
  },
  {
    id: "ultimate-plan",
    packageName: "Ultimate Plan",
    credits: 50,
    price: 150,
    currency: "EUR",
    pricePerCredit: 3.0,
    savings: 100,
    savingsPercentage: 40,
    productId: env.NEXT_PUBLIC_STRIPE_ULTIMATE_PLAN_ID,
    icon: <Rocket className="h-6 w-6 text-indigo-500" />,
  },
];
