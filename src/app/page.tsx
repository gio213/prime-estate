import HeroText from "@/components/HeroText";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col gap-10">
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
