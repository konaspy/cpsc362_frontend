import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Receipt, LogIn, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">QuickShelf</h1>
          </div>
          <Link href="/login">
            <Button variant="outline" className="flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              Login
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Section */}
          <div className="mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Library Management
              <span className="block text-blue-600">Made Simple</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Streamline your library operations with our comprehensive management system. 
              Track books, manage members, and handle transactions all in one place.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <Button size="lg" className="flex items-center gap-2 text-lg px-8 py-6">
                  <LogIn className="h-5 w-5" />
                  Get Started
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-xl">Book Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Easily catalog, search, and manage your entire book collection with detailed tracking and availability status.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle className="text-xl">Member Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Register and manage library members with comprehensive profiles and borrowing history tracking.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <Receipt className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle className="text-xl">Transaction Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Monitor all borrowing and return transactions with automated due date tracking and overdue notifications.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Call to Action */}
          <Card className="bg-blue-600 text-white border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl mb-2">Ready to Get Started?</CardTitle>
              <CardDescription className="text-blue-100 text-lg">
                Login to access your library management dashboard and start organizing your library today.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <Link href="/login">
                <Button size="lg" variant="secondary" className="flex items-center gap-2 text-lg px-8 py-6">
                  <LogIn className="h-5 w-5" />
                  Login to Dashboard
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <div className="mt-6 text-sm text-blue-100">
                <p className="mb-2">Demo credentials:</p>
                <p>Staff: username = "admin", password = "admin"</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-16 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2025 QuickShelf. Built with Next.js and Tailwind CSS.</p>
        </div>
      </footer>
    </div>
  );
}
