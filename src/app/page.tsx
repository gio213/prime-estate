import FadeContent from "@/components/FadeContent";

export default function Home() {
  return (
    <FadeContent
      className="flex items-center justify-center h-screen"
      blur={true}
      duration={1000}
      easing="ease-out"
      initialOpacity={0}
    >
      <h1>home page </h1>
    </FadeContent>
  );
}
