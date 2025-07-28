'use client'

import { createSchemaDialog } from './SchemaFormDialog'
import { UpdateTransactionSchema, type Transaction } from '@/app/lib/schemas/transaction'
import { Button } from '@/components/ui/button'
import { Edit } from 'lucide-react'

// Placeholder function - would be implemented in the real API
async function updateTransaction(transactionId: number, data: any): Promise<Transaction> {
  // This would be implemented in app/lib/api/transactions.ts
  console.log('Updating transaction:', transactionId, data)
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        transactionID: transactionId,
        bookID: data.bookID || 1,
        memberID: data.memberID || 1,
        borrowDate: data.borrowDate || new Date().toISOString(),
        dueDate: data.dueDate || new Date().toISOString(),
      })
    }, 500)
  })
}

interface EditTransactionDialogProps {
  transaction: Transaction
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSuccess?: () => void
  defaultValues?: Record<string, any>
  placeholders?: Record<string, string>
}

// Flexible edit transaction dialog using component-level defaults
export function EditTransactionDialog({ 
  transaction, 
  trigger, 
  open, 
  onOpenChange, 
  onSuccess,
  defaultValues,
  placeholders
}: EditTransactionDialogProps) {
  const handleSubmit = async (data: any) => {
    await updateTransaction(transaction.transactionID, data)
    if (onSuccess) onSuccess()
  }

  const EditDialog = createSchemaDialog({
    schema: UpdateTransactionSchema,
    title: 'Edit Transaction',
    fields: [
      { 
        name: 'bookID', 
        label: 'Book', 
        type: 'select',
        options: [] // Would be populated with actual books in real usage
      },
      { 
        name: 'memberID', 
        label: 'Member', 
        type: 'select',
        options: [] // Would be populated with actual members in real usage
      },
      { name: 'borrowDate', label: 'Borrow Date', placeholder: 'ISO datetime' },
      { name: 'dueDate', label: 'Due Date', placeholder: 'ISO datetime' },
    ],
    onSubmit: handleSubmit,
  })

  return (
    <EditDialog
      trigger={trigger || (
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4 mr-2" />
          Edit Transaction
        </Button>
      )}
      // Component-level defaults - populate with current transaction data
      defaultValues={{
        bookID: transaction.bookID,
        memberID: transaction.memberID,
        borrowDate: transaction.borrowDate,
        dueDate: transaction.dueDate,
        ...defaultValues // Allow overriding transaction defaults
      }}
      placeholders={placeholders}
      open={open}
      onOpenChange={onOpenChange}
    />
  )
} 