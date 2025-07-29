'use client'

import { createSchemaDialog } from './SchemaFormDialog'
import { UpdateBookSchema, CreateBookSchema, type Book } from '@/app/lib/schemas/book'
import { updateBook, createBook } from '@/app/lib/api/books'
import { Button } from '@/components/ui/button'
import { Edit, BookPlus } from 'lucide-react'
import { useMemo, useState } from 'react'

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