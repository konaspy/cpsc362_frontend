'use client'

import { createSchemaDialog } from './SchemaFormDialog'
import { CreateTransactionSchema, type Transaction } from '@/app/lib/schemas/transaction'
import { createTransaction, deleteTransaction } from '@/app/lib/api/transactions'
import { Button } from '@/components/ui/button'
import { Plus, BookCheck } from 'lucide-react'
import { useState } from 'react'

// Types for the dialog props
interface DeleteTransactionDialogProps {
  transaction: Transaction
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSuccess?: () => void
}

// Add Transaction Dialog using schema factory
export const AddTransactionDialog = createSchemaDialog({
  schema: CreateTransactionSchema,
  title: 'Add Transaction',
  fields: [
    { name: 'bookID', label: 'Book ID', placeholder: 'Enter book ID', type: 'number' },
    { name: 'memberID', label: 'Member ID', placeholder: 'Enter member ID', type: 'number' },
  ],
  onSubmit: createTransaction,
})

// Delete Transaction Dialog (Return Book)
export function DeleteTransactionDialog({
  transaction,
  trigger,
  open,
  onOpenChange,
  onSuccess
}: DeleteTransactionDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await deleteTransaction(transaction.transactionID)
      if (onSuccess) onSuccess()
      setDialogOpen(false)
      if (onOpenChange) onOpenChange(false)
    } catch (error) {
      console.error('Error returning book:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    setDialogOpen(open)
    if (onOpenChange) onOpenChange(open)
  }

  const ConfirmDialog = createSchemaDialog({
    schema: CreateTransactionSchema.pick({}), // Empty schema for confirmation
    title: 'Return Book',
    fields: [], // No form fields needed for confirmation
    onSubmit: async () => {
      await handleDelete()
      return true // Show confirmation
    },
  })

  return (
    <ConfirmDialog
      trigger={trigger || (
        <Button variant="outline" size="sm">
          <BookCheck className="h-4 w-4 mr-2" />
          Return
        </Button>
      )}
      open={open !== undefined ? open : dialogOpen}
      onOpenChange={handleOpenChange}
    />
  )
} 