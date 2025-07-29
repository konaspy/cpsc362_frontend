'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { EditMemberByIdDialog } from '@/components/dialogs/MemberLookupEdit'
import { EditBookByIdDialog } from '@/components/dialogs/BookLookupEdit'
import { Edit, User, Book } from 'lucide-react'

export default function WildcardEditTestPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Wildcard Edit Dialogs</h1>
          <p className="text-muted-foreground">
            Test the wildcard edit functionality that allows editing resources by ID lookup.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Edit Member by ID
              </CardTitle>
              <CardDescription>
                Enter a member ID to look up and edit their information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EditMemberByIdDialog
                trigger={
                  <Button variant="outline" className="w-full">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Any Member
                  </Button>
                }
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="h-5 w-5" />
                Edit Book by ID
              </CardTitle>
              <CardDescription>
                Enter a book ID to look up and edit book details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EditBookByIdDialog
                trigger={
                  <Button variant="outline" className="w-full">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Any Book
                  </Button>
                }
              />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>How it works</CardTitle>
            <CardDescription>
              The wildcard edit dialogs provide a two-step process for editing resources
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Step 1: ID Lookup</h4>
              <p className="text-sm text-muted-foreground">
                Enter the ID of the resource you want to edit. The dialog will fetch the current data.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Step 2: Edit Form</h4>
              <p className="text-sm text-muted-foreground">
                Once the resource is found, you'll see the edit form pre-filled with current values.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Step 3: Confirmation</h4>
              <p className="text-sm text-muted-foreground">
                After successful save, you'll see a confirmation screen showing the updated resource details.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Error Handling</h4>
              <p className="text-sm text-muted-foreground">
                If the ID doesn't exist, you'll see an error message and can try a different ID.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 