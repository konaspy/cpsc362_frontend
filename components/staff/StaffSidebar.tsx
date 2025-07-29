"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { BookOpen, UserPlus, Home, Users, BookOpenIcon, Receipt, BookOpenCheck, BookDown } from "lucide-react";
import Link from "next/link";

const quickActions = [
  {
    label: "Check Out Book",
    icon: BookOpenCheck,
    href: "/staff/transactions/check-out",
  },
  {
    label: "Return Book",
    icon: BookDown,
    href: "/staff/transactions/return",
  },
  {
    label: "Add New Member",
    icon: UserPlus,
    href: "/staff/members/add",
  }
];

const navigation = [
  {
    label: "Dashboard",
    icon: Home,
    href: "/staff/",
  },
  {
    label: "Books",
    icon: BookOpenIcon,
    href: "/staff/books",
  },
  {
    label: "Members",
    icon: Users,
    href: "/staff/members",
  },
  {
    label: "Transactions",
    icon: Receipt,
    href: "/staff/transactions",
  }
];

const sidebarData = {
  quickActions: quickActions,
  navigation: navigation,
}

export default function StaffSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="flex">
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
              {quickActions.map((action) => (
                <SidebarMenuItem key={action.label}>
                  <SidebarMenuButton asChild tooltip={action.label}>
                    <Link href={action.href}>
                      <action.icon className="h-4 w-4" />
                      <span>{action.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild tooltip={item.label}>
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
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