"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import StaffSidebar from "@/components/staff/StaffSidebar";
import { AddMemberDialog } from "@/components/dialogs/memberDialogs";

export default function AddMember() {
  const router = useRouter();
  const [open, setOpen] = useState(true); // Open dialog immediately

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      // Navigate back to members list when dialog closes
      router.push("/staff/members");
    }
  };

  const handleSuccess = () => {
    // Navigate back to members list on successful addition
    router.push("/staff/members");
  };

  return (
    <SidebarProvider>
      <StaffSidebar />
      
      <SidebarInset>
        {/* Keep page structure consistent but focus on the dialog */}
        <div className="flex items-center justify-center min-h-screen">
          <AddMemberDialog
            open={open}
            onOpenChange={handleOpenChange}
            onSuccess={handleSuccess}
            trigger={<div />} // Hidden trigger since we auto-open
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
} 