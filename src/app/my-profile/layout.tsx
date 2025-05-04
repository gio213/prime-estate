import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="mx-auto  p-10">
        <SidebarTrigger
          className="fixed top-24 left-70 z-10 flex h-12 w-12 items-center justify-center rounded-full hover:cursor-pointer"
          title="Hide side bar"
        />
        {children}
      </main>
    </SidebarProvider>
  );
}
