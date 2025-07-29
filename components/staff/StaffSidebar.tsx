"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { BookOpen, UserPlus, Plus, Home, Users, BookOpenIcon, Receipt, BookOpenCheck, BookDown, Search, Pencil, Trash, ChevronRight } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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
    items: [
      {
        label: "Add",
        icon: Plus,
        href: "/staff/books/add",
      },
      {
        label: "Search",
        icon: Search,
        href: "/staff/books/search",
      },
      {
        label: "Edit",
        icon: Pencil,
        href: "/staff/books/edit",
      },
      {
        label: "Delete",
        icon: Trash,
        href: "/staff/books/delete",
      }
    ],
  },
  {
    label: "Members",
    icon: Users,
    href: "/staff/members",
    items: [
      {
        label: "Add",
        icon: Plus,
        href: "/staff/members/add",
      },
      {
        label: "Search",
        icon: Search,
        href: "/staff/members/search",
      },
      {
        label: "Edit",
        icon: Pencil,
        href: "/staff/members/edit",
      },
      {
        label: "Delete",
        icon: Trash,
        href: "/staff/members/delete",
      }
    ],
  },
  {
    label: "Transactions",
    icon: Receipt,
    href: "/staff/transactions",
    items: [
      {
        label: "Add",
        icon: Plus,
        href: "/staff/transactions/add",
      },
      {
        label: "Search",
        icon: Search,
        href: "/staff/transactions/search",
      },
      {
        label: "Edit",
        icon: Pencil,
        href: "/staff/transactions/edit",
      },
      {
        label: "Delete",
        icon: Trash,
        href: "/staff/transactions/delete",
      }
    ],
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
                  <SidebarMenuButton tooltip={action.label}>
                    <action.icon className="h-4 w-4" />
                    <span>{action.label}</span>
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
                <Collapsible key={item.label} asChild defaultOpen={false}>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip={item.label}>
                      <a href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </a>
                    </SidebarMenuButton>
                    {item.items?.length ? (
                      <>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuAction className="data-[state=open]:rotate-90">
                            <ChevronRight />
                            <span className="sr-only">Toggle</span>
                          </SidebarMenuAction>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items?.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.label}>
                                <SidebarMenuSubButton asChild>
                                  <a href={subItem.href}>
                                    <subItem.icon className="h-4 w-4" />
                                    <span>{subItem.label}</span>
                                  </a>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </>
                    ) : null}
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
} 