'use client'

import { createSchemaDialog } from './SchemaFormDialog'
import { UpdateBookSchema, CreateBookSchema, type Book } from '@/app/lib/schemas/book'
import { updateBook, createBook, deleteBook } from '@/app/lib/api/books'
import { Button } from '@/components/ui/button'
import { Edit, BookPlus, Trash, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'

// Types for the dialog props
interface EditBookDialogProps {
  book: Book
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSuccess?: () => void
  defaultValues?: Record<string, any>
  placeholders?: Record<string, string>
}

// Add Book Dialog using schema factory
export const AddBookDialog = createSchemaDialog({
  schema: CreateBookSchema,
  title: 'Add Book',
  fields: [
    { name: 'bookName', label: 'Book Name', placeholder: 'Enter book title' },
    { name: 'authorName', label: 'Author Name', placeholder: 'Enter author name' },
    { name: 'isbn', label: 'ISBN', placeholder: 'Enter ISBN' },
  ],
  onSubmit: createBook,
})

// Edit Book Dialog Wrapper
export function EditBookDialogWrapper({
  book,
  trigger,
  onSuccess: refreshTable,   // rename for clarity
  ...rest
}: EditBookDialogProps) {
  /* keep track of dialog open state */
  const [open, setOpen] = useState(false);

  const handleSubmit = async (data: any) => {
    /* return truthy value so SchemaDialog enters confirmation mode */
    return await updateBook(book.bookID, data);
  };

  const BookEditDialog = useMemo(
    () =>
      createSchemaDialog({
        schema: UpdateBookSchema,
        title: 'Edit Book',
        fields: [
          { name: 'bookName', label: 'Book Name', placeholder: 'Enter book title' },
          { name: 'authorName', label: 'Author Name', placeholder: 'Enter author name' },
          { name: 'isbn', label: 'ISBN', placeholder: 'Enter ISBN' },
        ],
        onSubmit: handleSubmit,
        defaultValues: {
          bookName: book.bookName,
          authorName: book.authorName,
          isbn: book.isbn,
        },
      }),
    [book.bookID],
  );

  /* refresh the table only after the user closes the dialog */
  function handleOpenChange(o: boolean) {
    if (!o && refreshTable) refreshTable();
    setOpen(o);
  }

  return (
    <BookEditDialog
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

// Flexible Edit Book Dialog (using component-level defaultValues)
export function FlexibleEditBookDialog({ 
  book, 
  trigger, 
  open, 
  onOpenChange, 
  onSuccess,
  defaultValues,
  placeholders
}: EditBookDialogProps) {
  const handleSubmit = async (data: any) => {
    const updatedBook = await updateBook(book.bookID, data)
    if (onSuccess) onSuccess()
    return updatedBook // Return data to show confirmation
  }

  const EditDialog = createSchemaDialog({
    schema: UpdateBookSchema,
    title: 'Edit Book',
    fields: [
      { name: 'bookName', label: 'Book Name', placeholder: 'Enter book title' },
      { name: 'authorName', label: 'Author Name', placeholder: 'Enter author name' },
      { name: 'isbn', label: 'ISBN', placeholder: 'Enter ISBN' },
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
        bookName: book.bookName,
        authorName: book.authorName,
        isbn: book.isbn,
        ...defaultValues // Allow overriding book defaults
      }}
      placeholders={placeholders}
      open={open}
      onOpenChange={onOpenChange}
      onSuccess={onSuccess}
    />
  )
} 

/* ------------------------------------------------------------
 * Delete Book Dialog (two-step confirmation)
 * ---------------------------------------------------------- */
interface DeleteBookDialogProps {
  book: Book
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSuccess?: () => void
}

export function DeleteBookDialog({
  book,
  trigger,
  open,
  onOpenChange,
  onSuccess,
}: DeleteBookDialogProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [step, setStep] = useState<'confirm' | 'success'>('confirm')
  const [processing, setProcessing] = useState(false)

  async function handleDelete() {
    try {
      setProcessing(true)
      await deleteBook(book.bookID)
      toast.success(`Book "${book.bookName}" deleted successfully`)
      if (onSuccess) onSuccess()
      setStep('success')
    } catch (err) {
      console.error('Error deleting book:', err)
      
      // Extract meaningful error message from server response
      let errorMessage = 'Failed to delete book'
      if (err && typeof err === 'object') {
        const serverError = err as any
        if (serverError.detail) {
          errorMessage = serverError.detail
        } else if (serverError.title) {
          errorMessage = serverError.title
        } else if (serverError.message) {
          errorMessage = serverError.message
        } else if (typeof serverError === 'string') {
          errorMessage = serverError
        }
      }
      
      toast.error(errorMessage)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <Dialog
      open={open !== undefined ? open : dialogOpen}
      onOpenChange={(o) => {
        if (!o) setStep('confirm')
        if (onOpenChange) onOpenChange(o)
        setDialogOpen(o)
      }}
    >
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="ghost" size="sm">
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[420px]">
        {step === 'confirm' ? (
          <>
            <DialogHeader>
              <DialogTitle>Delete Book – Confirm</DialogTitle>
            </DialogHeader>

            <div className="space-y-1 text-sm">
              <div>
                <span className="font-medium">Book&nbsp;ID:</span> {book.bookID}
              </div>
              <div>
                <span className="font-medium">Title:</span> {book.bookName}
              </div>
              <div>
                <span className="font-medium">Author:</span> {book.authorName}
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </DialogClose>
              <Button
                onClick={handleDelete}
                disabled={processing}
                variant="destructive"
              >
                {processing ? 'Deleting…' : 'Delete'}
              </Button>
            </DialogFooter>
          </>
        ) : (
          /* -------------- success step -------------- */
          <>
            <DialogHeader>
              <DialogTitle>Book Deleted</DialogTitle>
            </DialogHeader>

            <div className="space-y-1 text-sm">
              Book <span className="font-medium">{book.bookName}</span> was
              removed successfully.
            </div>

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