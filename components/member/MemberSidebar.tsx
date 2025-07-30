import { Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { BookOpen, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EditMemberDialogWrapper } from "../dialogs/memberDialogs";
import { Member } from "@/app/lib/schemas/member";
import { Button } from "../ui/button";

const navigation = [
  {
    label: "Dashboard",
    href: "/member",
    icon: BookOpen,
  },
];

export default function MemberSidebar({ memberInfo }: { memberInfo: Member }) {
  const router = useRouter();
  return <Sidebar>
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" className="flex items-center" onClick={() => {
            router.push('/member/');
          }}>
            <BookOpen className="size-6!"/>
            <span className="font-semibold text-lg">QuickShelf</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
    <SidebarContent>
        {/* Quick Actions */}
        <SidebarGroup>
          <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Edit Profile */}
                <SidebarMenuItem>
                  <EditMemberDialogWrapper member={memberInfo} trigger={<SidebarMenuButton>
                    <User className="h-4 w-4" />
                    <span className="justify-start">Edit Profile</span>
                  </SidebarMenuButton>}/>
                </SidebarMenuItem>
              {/* Book Search */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/member/books">
                    <BookOpen className="h-4 w-4" />
                    <span className="justify-start">Book Search</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
  </Sidebar>;
}