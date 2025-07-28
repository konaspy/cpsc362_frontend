'use client'

import { EditMemberDialogWrapper, FlexibleEditMemberDialog } from './EditMemberDialog'
import { EditBookDialog } from './EditBookDialog'
import { EditTransactionDialog } from './EditTransactionDialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createSchemaDialog } from './SchemaFormDialog'

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { createMember } from '@/app/lib/api/members'
import { createBook } from '@/app/lib/api/books'
import { CreateMemberSchema } from '@/app/lib/schemas/member'
import { CreateBookSchema } from '@/app/lib/schemas/book'
import { password } from '@/app/lib/schemas/common'
import { z } from 'zod'
import { createTransaction } from '@/app/lib/api/transactions'
import { CreateTransactionSchema } from '@/app/lib/schemas/transaction'
import type { CreateMemberRequest } from '@/app/lib/schemas/member'
import type { CreateBookRequest } from '@/app/lib/schemas/book'
import type { CreateTransactionRequest } from '@/app/lib/schemas/transaction'

// Schema factory replacements for the old traditional dialogs
const AddMemberDialog = createSchemaDialog({
  schema: CreateMemberSchema,
  title: 'Add Member',
  fields: [
    { name: 'firstName', label: 'First Name', placeholder: 'Enter first name' },
    { name: 'lastName', label: 'Last Name', placeholder: 'Enter last name' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'Enter email address' },
    { name: 'username', label: 'Username', placeholder: 'Enter username' },
    { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter password' },
  ],
  onSubmit: createMember, // Return the created member data for confirmation
})

const AddBookDialog = createSchemaDialog({
  schema: CreateBookSchema,
  title: 'Add Book',
  fields: [
    { name: 'bookName', label: 'Book Name', placeholder: 'Enter book title' },
    { name: 'authorName', label: 'Author Name', placeholder: 'Enter author name' },
    { name: 'isbn', label: 'ISBN', placeholder: 'Enter ISBN' },
  ],
  onSubmit: createBook, // Return the created book data for confirmation
})

const AddTransactionDialog = createSchemaDialog({
  schema: CreateTransactionSchema,
  title: 'Add Transaction',
  fields: [
    { name: 'bookID', label: 'Book ID', placeholder: 'Enter book ID' },
    { name: 'memberID', label: 'Member ID', placeholder: 'Enter member ID' },
  ],
  onSubmit: createTransaction, // Return the created transaction data for confirmation
})

// Example of using SchemaFormDialog factory pattern
function SchemaFactoryExample() {
  return (
    <AddMemberDialog trigger={<Button variant="outline">Add Member (Schema Factory)</Button>} />
  )
}

// Example password schema dialog
const PasswordExampleDialog = createSchemaDialog({
  schema: z.object({
    username: z.string().min(3),
    currentPassword: password(8),
    newPassword: password(12, 'New password must be at least 12 characters'),
    confirmPassword: password()
  }).refine(
    (data) => data.newPassword === data.confirmPassword,
    {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    }
  ),
  title: 'Change Password',
  fields: [
    { name: 'username', label: 'Username', placeholder: 'Your username' },
    { name: 'currentPassword', label: 'Current Password' },
    { name: 'newPassword', label: 'New Password' },
    { name: 'confirmPassword', label: 'Confirm New Password' },
  ],
  onSubmit: async (data) => {
    console.log('Password change:', data)
  }
})

export default function Demo() {
  // Sample data for demonstrating edit functionality
  const sampleMember = {
    memberID: 1,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com'
  }

  const sampleBook = {
    bookID: 1,
    bookName: 'The Great Gatsby',
    authorName: 'F. Scott Fitzgerald',
    isbn: '978-0-7432-7356-5'
  }

  const sampleTransaction = {
    transactionID: 1,
    bookID: 1,
    memberID: 1,
    borrowDate: '2024-01-15T10:00:00Z',
    dueDate: '2024-02-15T10:00:00Z'
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Schema Dialog Factory Demo</h1>
        <p className="text-gray-600">
          Comprehensive demonstration of the createSchemaDialog factory pattern with editing capabilities.
        </p>
      </div>

      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">🎯 Key Features</h3>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>• <strong>Component-level defaults:</strong> Pre-fill forms with existing data for editing</li>
          <li>• <strong>Component-level placeholders:</strong> Customize hints without recreating dialogs</li>
          <li>• <strong>Type-safe validation:</strong> Automatic Zod schema validation with field-specific errors</li>
          <li>• <strong>Auto-detected field types:</strong> Password, email, number, and select fields inferred from schema</li>
          <li>• <strong>Smart optional validation:</strong> Empty fields aren't submitted; filled fields are validated</li>
        </ul>
      </div>

      <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
        <h3 className="font-semibold text-green-900 mb-2">💡 Optional Validation Pattern</h3>
        <div className="text-green-800 text-sm space-y-2">
          <p><strong>Create Operations:</strong> All fields are required (username min 3 chars, password min 6 chars)</p>
          <p><strong>Update Operations:</strong> Leave username/password blank = don't update them. Fill them = validate and update.</p>
          <div className="bg-green-100 p-2 rounded text-xs">
            <strong>Technical:</strong> Empty fields are naturally <code>undefined</code> in form state. 
            Only defined values are submitted to the API and validated by Zod schemas.
          </div>
        </div>
      </div>

      <div className="grid gap-8">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">1. Schema Factory Pattern</h2>
          <p className="text-gray-600">Using the createSchemaDialog factory for type-safe, reusable dialogs:</p>
          <SchemaFactoryExample />
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">2. Advanced Schema Features</h2>
          <p className="text-gray-600">Password auto-detection, custom validation, and field refinements:</p>
          <div className="space-y-2">
            <h4 className="font-medium mb-2">Custom Password Schema Demo:</h4>
            <PasswordExampleDialog trigger={<Button variant="ghost">Password Schema Demo</Button>} />
            <p className="text-xs text-gray-500 mt-2">
              All password fields auto-detected from <code>password()</code> schema. No manual type specification needed!
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">3. Add/Edit Resources</h2>
          <p className="text-gray-600">Complete CRUD dialogs for all three resources:</p>
          
          {/* Members Section */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">👥 Members</h3>
            <div className="flex gap-2 flex-wrap">
              <AddMemberDialog trigger={<Button>Add Member</Button>} />
              <EditMemberDialogWrapper 
                member={sampleMember}
                trigger={<Button variant="outline">Edit Member</Button>}
                onSuccess={() => console.log('Member updated!')}
              />
            </div>
          </div>

          {/* Books Section */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">📚 Books</h3>
            <div className="flex gap-2 flex-wrap">
              <AddBookDialog trigger={<Button>Add Book</Button>} />
              <EditBookDialog 
                book={sampleBook}
                trigger={<Button variant="outline">Edit Book</Button>}
                onSuccess={() => console.log('Book updated!')}
              />
            </div>
          </div>

          {/* Transactions Section */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">📋 Transactions</h3>
            <div className="flex gap-2 flex-wrap">
              <AddTransactionDialog trigger={<Button>Add Transaction</Button>} placeholders={{
                bookID: 'Enter book ID',
                memberID: 'Enter member ID'
              }}/>
              <EditTransactionDialog 
                transaction={sampleTransaction}
                trigger={<Button variant="outline">Edit Transaction</Button>}
                onSuccess={() => console.log('Transaction updated!')}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">4. Advanced Customization</h2>
          <p className="text-gray-600">Demonstrating component-level defaults and placeholders:</p>
          
          <div className="space-y-3">
            <div>
              <h4 className="font-medium mb-2">Pre-filled Defaults:</h4>
              <AddMemberDialog 
                trigger={<Button variant="secondary">Add Member (Pre-filled)</Button>}
                defaultValues={{
                  firstName: 'John',
                  lastName: 'Doe',
                  email: 'john@example.com'
                }}
              />
            </div>

            <div>
              <h4 className="font-medium mb-2">Custom Placeholders:</h4>
              <AddBookDialog 
                trigger={<Button variant="secondary">Add Book (Custom Hints)</Button>}
                placeholders={{
                  bookName: 'Enter an amazing book title...',
                  authorName: 'Who wrote this masterpiece?',
                  isbn: 'ISBN-13 format preferred'
                }}
              />
            </div>

            <div>
              <h4 className="font-medium mb-2">Combined Defaults + Placeholders:</h4>
              <AddMemberDialog 
                trigger={<Button variant="secondary">Combined Example</Button>}
                defaultValues={{
                  firstName: 'Jane',
                  lastName: 'Smith'
                }}
                placeholders={{
                  firstName: 'Your first name here...',
                  lastName: 'Your family name...',
                  email: 'name@company.com',
                  username: 'Choose a unique username',
                  password: 'Make it secure!'
                }}
              />
            </div>

            <div>
              <h4 className="font-medium mb-2">Edit with Custom Placeholders:</h4>
              <FlexibleEditMemberDialog 
                member={sampleMember}
                trigger={<Button variant="secondary">Edit with Custom Hints</Button>}
                defaultValues={{
                  email: 'updated.email@newcompany.com',
                }}
                placeholders={{
                  firstName: 'Enter your preferred first name',
                  lastName: 'Your legal last name',
                  email: 'Updated email address (company domain preferred)'
                }}
                onSuccess={() => console.log('Member updated successfully!')}
              />
            </div>

            <div>
              <h4 className="font-medium mb-2">Create Member (All Fields Required):</h4>
              <p className="text-sm text-gray-600 mb-2">
                When creating a member, all fields including username and password are required.
              </p>
              <AddMemberDialog 
                trigger={<Button variant="secondary">Create Member (All Required)</Button>}
                placeholders={{
                  firstName: 'Required: Enter first name',
                  lastName: 'Required: Enter last name', 
                  email: 'Required: Enter email address',
                  username: 'Required: Min 3 characters',
                  password: 'Required: Min 6 characters'
                }}
              />
            </div>

            <div>
              <h4 className="font-medium mb-2">Update Member (Optional Username/Password):</h4>
              <p className="text-sm text-gray-600 mb-2">
                When updating, leave username/password blank to keep current values, or fill them to update with validation.
              </p>
              <EditMemberDialogWrapper 
                member={sampleMember}
                trigger={<Button variant="secondary">Update Member (Optional Creds)</Button>}
                placeholders={{
                  firstName: 'Update first name (optional)',
                  lastName: 'Update last name (optional)',
                  email: 'Update email address (optional)',
                  username: 'Leave blank to keep current, or enter new (min 3 chars)',
                  password: 'Leave blank to keep current, or enter new (min 6 chars)'
                }}
                onSuccess={() => {
                  console.log('Member updated successfully!')
                  console.log('Only non-empty fields were submitted to API')
                }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">5. Benefits Summary</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li><strong>Consistent UI:</strong> All dialogs follow the same layout and behavior</li>
              <li><strong>Reusable:</strong> Schema factory can be used for any entity type</li>
              <li><strong>Type-safe:</strong> Each specialized component uses proper TypeScript types</li>
              <li><strong>Validation:</strong> Built-in support for Zod validation</li>
              <li><strong>Flexible:</strong> Component-level defaults and placeholders for any use case</li>
              <li><strong>Auto-inference:</strong> Field types automatically detected from schema</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 