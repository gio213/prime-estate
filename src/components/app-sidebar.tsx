import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { sideBarItems } from "@/constants/constats";
import Link from "next/link";

export function AppSidebar({ propertyCount = 0 }: { propertyCount?: number }) {
  return (
    <Sidebar variant="floating" className="fixed left-0 top-24  w-64">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Prime Estate-My Profile</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sideBarItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                      {item.title === "My Properties" && (
                        <span className="text-accent-foreground">
                          {propertyCount}
                        </span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
