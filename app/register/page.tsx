"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AddMemberDialog } from "@/components/dialogs/memberDialogs";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleBackToLogin = () => {
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <UserPlus className="h-6 w-6 mr-2" />
            <CardTitle className="text-2xl font-bold">Register</CardTitle>
          </div>
          <CardDescription>
            Create a new account to access the library system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <AddMemberDialog
              trigger={
                <Button className="w-full">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create Account
                </Button>
              }
              open={dialogOpen}
              onOpenChange={setDialogOpen}
              onSuccess={handleSuccess}
            />
            
            <div className="text-center">
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleBackToLogin}
              >
                Back to Login
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
