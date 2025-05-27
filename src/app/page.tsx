import HeroText from "@/components/HeroText";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Browse Properties | Prime Estate",
  description:
    "Find your dream property for sale or rent. Browse through our extensive collection of apartments, houses, offices, and commercial spaces.",
  openGraph: {
    title: "Browse Properties | Prime Estate",

    description:
      "Find your dream property for sale or rent. Browse through our extensive collection of apartments, houses, offices, and commercial spaces.",
    images: [
      {
        url: "https://prime-estate-ruddy.vercel.app/assets/hero.png",
        width: 1200,
        height: 630,
        alt: "Prime Estate Properties",
      },
    ],
    url: "https://prime-estate-ruddy.vercel.app/properties",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Browse Properties | Prime Estate",
    description: "Find your dream property for sale or rent on Prime Estate.",
    images: ["https://prime-estate-ruddy.vercel.app/assets/hero.png"],
  },
};

export default function Home() {
  return (
    <div className="flex flex-col mt-10 gap-10">
      <HeroText />
      <div className="relative w-full aspect-[16/9]">
        <Image
          src="/assets/hero.png"
          alt="Hero Image"
          fill
          sizes="(max-width: 768px) 100vw,
                 (max-width: 1200px) 80vw,
                 1400px"
          className="object-cover rounded-4xl"
          priority
        />
      </div>
    </div>
  );
}
