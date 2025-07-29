"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import StaffSidebar from "@/components/staff/StaffSidebar";
import { AddTransactionDialog } from "@/components/dialogs/transactionDialogs";

export default function CheckOutBook() {
  const router = useRouter();
  const [open, setOpen] = useState(true); // Open dialog immediately

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      // Navigate back to transactions list when dialog closes
      router.push("/staff/transactions");
    }
  };

  const handleSuccess = () => {
    // Navigate back to transactions list on successful checkout
    router.push("/staff/transactions");
  };

  return (
    <SidebarProvider>
      <StaffSidebar />
      
      <SidebarInset>
        {/* Keep page structure consistent but focus on the dialog */}
        <div className="flex items-center justify-center min-h-screen">
          <AddTransactionDialog
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