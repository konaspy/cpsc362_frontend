'use client'

import { createSchemaDialog } from './SchemaFormDialog'
import { UpdateBookSchema, type Book } from '@/app/lib/schemas/book'
import { updateBook } from '@/app/lib/api/books'
import { Button } from '@/components/ui/button'
import { Edit } from 'lucide-react'

interface EditBookDialogProps {
  book: Book
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSuccess?: () => void
  defaultValues?: Record<string, any>
  placeholders?: Record<string, string>
}

// Flexible edit book dialog using component-level defaults
export function EditBookDialog({ 
  book, 
  trigger, 
  open, 
  onOpenChange, 
  onSuccess,
  defaultValues,
  placeholders
}: EditBookDialogProps) {
  const handleSubmit = async (data: any) => {
    await updateBook(book.bookID, data)
    if (onSuccess) onSuccess()
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
          Edit Book
        </Button>
      )}
      // Component-level defaults - populate with current book data
      defaultValues={{
        bookName: book.bookName,
        authorName: book.authorName,
        isbn: book.isbn,
        ...defaultValues // Allow overriding book defaults
      }}
      placeholders={placeholders}
      open={open}
      onOpenChange={onOpenChange}
    />
  )
} 