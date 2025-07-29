'use client'

import { createSchemaDialog } from './SchemaFormDialog'
import { CreateTransactionSchema, type Transaction } from '@/app/lib/schemas/transaction'
import { createTransaction, deleteTransaction } from '@/app/lib/api/transactions'
import { getBook } from '@/app/lib/api/books'
import { getMember } from '@/app/lib/api/members'
import type { Book } from '@/app/lib/schemas/book'
import type { Member } from '@/app/lib/schemas/member'
import { Button } from '@/components/ui/button'
import { Plus, BookCheck, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog'

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
  const [dialogOpen, setDialogOpen] = useState(false)
  const [step, setStep] = useState<'confirm' | 'success'>('confirm')
  const [book, setBook] = useState<Book | null>(null)
  const [member, setMember] = useState<Member | null>(null)
  const [loadingInfo, setLoadingInfo] = useState(true)
  const [processing, setProcessing] = useState(false)

  /* ------------------------------------------------------------
   * Fetch book & member details the first time the dialog opens
   * ---------------------------------------------------------- */
  useEffect(() => {
    if (!dialogOpen) return
    let ignore = false
    ;(async () => {
      try {
        setLoadingInfo(true)
        const [b, m] = await Promise.all([
          getBook(transaction.bookID),
          getMember(transaction.memberID),
        ])
        if (!ignore) {
          setBook(b)
          setMember(m)
        }
      } finally {
        if (!ignore) setLoadingInfo(false)
      }
    })()
    return () => {
      // prevent setting state after unmount
      ignore = true
    }
  }, [dialogOpen, transaction.bookID, transaction.memberID])

  /* ------------------------------------------------------------
   * Delete the transaction (i.e. return the book)
   * ---------------------------------------------------------- */
  async function handleReturn() {
    try {
      setProcessing(true)
      await deleteTransaction(transaction.transactionID)
      if (onSuccess) onSuccess()
      setStep('success')
    } catch (err) {
      console.error('Error returning book:', err)
    } finally {
      setProcessing(false)
    }
  }

  /* ------------------------------------------------------------ */
  const details = (
    <div className="space-y-1 text-sm">
      <div>
        <span className="font-medium">Transaction&nbsp;ID:</span>{' '}
        {transaction.transactionID}
      </div>
      {book && (
        <>
          <div>
            <span className="font-medium">Book&nbsp;ID:</span> {book.bookID}
          </div>
          <div>
            <span className="font-medium">Title:</span> {book.bookName}
          </div>
          <div>
            <span className="font-medium">Author:</span> {book.authorName}
          </div>
        </>
      )}
      {member && (
        <>
          <div>
            <span className="font-medium">Member&nbsp;ID:</span>{' '}
            {member.memberID}
          </div>
          <div>
            <span className="font-medium">Member&nbsp;Name:</span>{' '}
            {member.firstName} {member.lastName}
          </div>
        </>
      )}
    </div>
  )

  return (
    <Dialog
      open={open !== undefined ? open : dialogOpen}
      onOpenChange={(o) => {
        if (!o) {
          // Reset back to initial state for the next time
          setStep('confirm')
        }
        if (onOpenChange) onOpenChange(o)
        setDialogOpen(o)
      }}
    >
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <BookCheck className="h-4 w-4 mr-2" />
            Return
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[420px]">
        {step === 'confirm' ? (
          <>
            <DialogHeader>
              <DialogTitle>Return Book – Confirm Details</DialogTitle>
            </DialogHeader>

            {loadingInfo ? (
              <p className="text-muted-foreground text-sm">Loading details…</p>
            ) : (
              details
            )}

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </DialogClose>
              <Button
                onClick={handleReturn}
                disabled={processing || loadingInfo}
                variant="destructive"
              >
                {processing ? 'Returning…' : 'Return Book'}
              </Button>
            </DialogFooter>
          </>
        ) : (
          /* ---------------- Success step ---------------- */
          <>
            <DialogHeader>
              <DialogTitle>Book Returned Successfully</DialogTitle>
            </DialogHeader>

            {details}

            <DialogFooter>
              <DialogClose asChild>
                <Button>Done</Button>
              </DialogClose>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
} 