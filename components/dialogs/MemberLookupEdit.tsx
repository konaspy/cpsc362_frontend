'use client'

import { withLookup } from './LookupEditDialog'
import { getMember, updateMember } from '@/app/lib/api/members'
import { UpdateMemberSchema } from '@/app/lib/schemas/member'
import { createSchemaDialog } from './SchemaFormDialog'

/* existing "plain" edit dialog factory */
const buildMemberEditDialog = (member: any, onSuccess: () => void) =>
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
    onSubmit: async (data) => {
      const updated = await updateMember(member.memberID, data);
      return updated;                  // ← return truthy value
    },
  })

export const EditMemberByIdDialog = withLookup(
  'Edit Member',
  getMember,
  buildMemberEditDialog,
  (member) => ({                     // defaultsFrom()
    firstName: member.firstName,
    lastName: member.lastName,
    email: member.email,
  }),
) 