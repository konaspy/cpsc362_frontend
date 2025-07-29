'use client'

import { createSchemaDialog } from './SchemaFormDialog'
import { UpdateMemberSchema, CreateMemberSchema, type Member } from '@/app/lib/schemas/member'
import { updateMember, createMember } from '@/app/lib/api/members'
import { Button } from '@/components/ui/button'
import { Edit, UserPlus } from 'lucide-react'
import { useMemo, useState } from 'react'

// Types for the dialog props
interface EditMemberDialogProps {
  member: Member
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSuccess?: () => void
  defaultValues?: Record<string, any>
  placeholders?: Record<string, string>
}

// Add Member Dialog using schema factory
export const AddMemberDialog = createSchemaDialog({
  schema: CreateMemberSchema,
  title: 'Add Member',
  fields: [
    { name: 'firstName', label: 'First Name', placeholder: 'Enter first name' },
    { name: 'lastName', label: 'Last Name', placeholder: 'Enter last name' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'Enter email address' },
    { name: 'username', label: 'Username', placeholder: 'Enter username' },
    { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter password' },
  ],
  onSubmit: createMember,
})

// Edit Member Dialog Wrapper
export function EditMemberDialogWrapper({
  member,
  trigger,
  onSuccess: refreshTable,   // rename for clarity
  ...rest
}: EditMemberDialogProps) {
  /* keep track of dialog open state */
  const [open, setOpen] = useState(false);

  const handleSubmit = async (data: any) => {
    /* return truthy value so SchemaDialog enters confirmation mode */
    return await updateMember(member.memberID, data);
  };

  const MemberEditDialog = useMemo(
    () =>
      createSchemaDialog({
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
        defaultValues: {
          firstName: member.firstName,
          lastName:  member.lastName,
          email:     member.email,
        },
      }),
    [member.memberID],
  );

  /* refresh the table only after the user closes the dialog */
  function handleOpenChange(o: boolean) {
    if (!o && refreshTable) refreshTable();
    setOpen(o);
  }

  return (
    <MemberEditDialog
      trigger={
        trigger ?? (
          <Button variant="ghost" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
        )
      }
      open={open}
      onOpenChange={handleOpenChange}
      /* ─ do NOT pass onSuccess ─ */
      {...rest}
    />
  );
}

// Flexible Edit Member Dialog (using component-level defaultValues)
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
      onSuccess={onSuccess}
    />
  )
} 