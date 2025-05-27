import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { get_current_user } from "@/actions/user.action";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await get_current_user();
  return (
    <SidebarProvider>
      <AppSidebar propertyCount={user?.properties?.length} />
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
