'use client'

import { createSchemaDialog } from './SchemaFormDialog'
import { UpdateMemberSchema, type Member } from '@/app/lib/schemas/member'
import { updateMember } from '@/app/lib/api/members'
import { Button } from '@/components/ui/button'
import { Edit } from 'lucide-react'

// Method 1: Create a specialized edit dialog at the factory level
export const EditMemberDialog = createSchemaDialog({
  schema: UpdateMemberSchema,
  title: 'Edit Member',
  fields: [
    { name: 'firstName', label: 'First Name', placeholder: 'Enter first name' },
    { name: 'lastName', label: 'Last Name', placeholder: 'Enter last name' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'Enter email address' },
    { name: 'username', label: 'Username', placeholder: 'Enter username' },
    { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter password' },
  ],
  onSubmit: async (data) => {
    // You'll need to pass the memberID somehow - see Method 2 for a better approach
    console.log('Updating member:', data)
    // await updateMember(memberID, data)
  },
})

// Method 2: Create a wrapper component that handles the member ID and provides defaults
interface EditMemberDialogProps {
  member: Member
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSuccess?: () => void
  defaultValues?: Record<string, any>
  placeholders?: Record<string, string>
}

const BaseEditMemberDialog = createSchemaDialog({
  schema: UpdateMemberSchema,
  title: 'Edit Member',
  fields: [
    { name: 'firstName', label: 'First Name', placeholder: 'Enter first name' },
    { name: 'lastName', label: 'Last Name', placeholder: 'Enter last name' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'Enter email address' },
  ],
  onSubmit: async () => {}, // Will be overridden by wrapper
})

export function EditMemberDialogWrapper({ 
  member, 
  trigger, 
  open, 
  onOpenChange, 
  onSuccess,
  defaultValues,
  placeholders
}: EditMemberDialogProps) {
  const handleSubmit = async (data: any) => {
    const updatedMember = await updateMember(member.memberID, data)
    if (onSuccess) onSuccess()
    return updatedMember // Return data to show confirmation
  }

  // Create a new dialog with the member's current data as defaults
  const MemberEditDialog = createSchemaDialog({
    schema: UpdateMemberSchema,
    title: 'Edit Member',
    fields: [
      { name: 'firstName', label: 'First Name', placeholder: 'Enter first name' },
      { name: 'lastName', label: 'Last Name', placeholder: 'Enter last name' },
      { name: 'email', label: 'Email', type: 'email', placeholder: 'Enter email address' },
      { name: 'username', label: 'Username', placeholder: 'Enter username (optional)' },
      { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter new password (optional)' },
    ],
    onSubmit: handleSubmit,
    // Factory-level defaults - these will be used for all instances of this dialog
    defaultValues: {
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      ...defaultValues // Allow overriding member defaults
    }
  })

  return (
    <MemberEditDialog
      trigger={trigger || (
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
      )}
      open={open}
      onOpenChange={onOpenChange}
      placeholders={placeholders}
    />
  )
}

// Method 3: Using component-level defaultValues (most flexible)
export function FlexibleEditMemberDialog({ 
  member, 
  trigger, 
  open, 
  onOpenChange, 
  onSuccess,
  defaultValues,
  placeholders
}: EditMemberDialogProps) {
  const handleSubmit = async (data: any) => {
    const updatedMember = await updateMember(member.memberID, data)
    if (onSuccess) onSuccess()
    return updatedMember // Return data to show confirmation
  }

  const EditDialog = createSchemaDialog({
    schema: UpdateMemberSchema,
    title: 'Edit Member',
    fields: [
      { name: 'firstName', label: 'First Name', placeholder: 'Enter first name' },
      { name: 'lastName', label: 'Last Name', placeholder: 'Enter last name' },
      { name: 'email', label: 'Email', type: 'email', placeholder: 'Enter email address' },
      { name: 'username', label: 'Username', placeholder: 'Enter username (optional)' },
      { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter new password (optional)' },
    ],
    onSubmit: handleSubmit,
  })

  return (
    <EditDialog
      trigger={trigger || (
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
      )}
      // Component-level defaults - these override factory defaults
      defaultValues={{
        firstName: member.firstName,
        lastName: member.lastName,
        email: member.email,
        ...defaultValues // Allow overriding member defaults
      }}
      placeholders={placeholders}
      open={open}
      onOpenChange={onOpenChange}
    />
  )
} 