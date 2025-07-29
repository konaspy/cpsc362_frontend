'use client'

import { withLookup } from './LookupEditDialog'
import { getBook, updateBook } from '@/app/lib/api/books'
import { UpdateBookSchema } from '@/app/lib/schemas/book'
import { createSchemaDialog } from './SchemaFormDialog'

/* existing "plain" edit dialog factory */
const buildBookEditDialog = (book: any, onSuccess: () => void) =>
  createSchemaDialog({
    schema: UpdateBookSchema,
    title: 'Edit Book',
    fields: [
      { name: 'bookName', label: 'Book Name', placeholder: 'Enter book title' },
      { name: 'authorName', label: 'Author Name', placeholder: 'Enter author name' },
      { name: 'isbn', label: 'ISBN', placeholder: 'Enter ISBN' },
    ],
    onSubmit: async (data) => {
      const updatedBook = await updateBook(book.bookID, data)
      onSuccess()
      return updatedBook // Return data to show confirmation
    },
  })

export const EditBookByIdDialog = withLookup(
  'Edit Book',
  getBook,
  buildBookEditDialog,
  (book) => ({                     // defaultsFrom()
    bookName: book.bookName,
    authorName: book.authorName,
    isbn: book.isbn,
  }),
) 