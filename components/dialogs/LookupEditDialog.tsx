'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { createSchemaDialog } from './SchemaFormDialog'
import { IdLookupSchema } from '@/app/lib/schemas/common'

type FetchFn<T> = (id: number) => Promise<T>
type DefaultsFn<T> = (resource: T) => Record<string, any>
type DialogProps = { 
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function withLookup<T>(
  title: string,          // "Edit Member", "Edit Book" …
  fetchById: FetchFn<T>,
  buildEditDialog: (resource: T, onSuccess: () => void) => React.FC<any>,  // factory that returns an existing edit dialog
  defaultsFrom: DefaultsFn<T>,
  onSuccess?: () => void
) {
  /* ---------- wrapper that switches screens ---------- */
  return function LookupEditDialog({ trigger, open, onOpenChange }: DialogProps) {
    const [step, setStep] = useState<'lookup' | 'edit'>('lookup')
    const [resource, setRes] = useState<T | null>(null)
    const [dialogOpen, setDialogOpen] = useState(false)

    // Handle controlled/uncontrolled dialog state
    const isOpen = open !== undefined ? open : dialogOpen
    const setIsOpen = onOpenChange || setDialogOpen

    /* intercept submit of the "ID" dialog */
    async function handleIdSubmit({ id }: { id: number }) {
      try {
        const data = await fetchById(id)
        setRes(data)
        setStep('edit')
        return data // Return data to show confirmation
      } catch (err) {
        toast.error('Could not find that ID')
        throw err
      }
    }

    /* ---------- screen #1: ask for the id ---------- */
    const IdDialog = createSchemaDialog({
      schema: IdLookupSchema,
      title: `${title} – Select ID`,
      fields: [
        { name: 'id', label: 'ID', type: 'number', placeholder: 'Enter ID…' },
      ],
      onSubmit: handleIdSubmit,
    })

    /* build the (already existing) edit dialog on-the-fly */
    const EditDialog = resource ? buildEditDialog(resource, () => {
      setStep('lookup')   // go back to first screen after save
      setRes(null)
      setIsOpen(false)    // close the dialog after successful save
    }) : null

    /* handle dialog close - reset to lookup step */
    function handleDialogClose(open: boolean) {
      if (!open) {
        setStep('lookup')
        setRes(null)
      }
      setIsOpen(open)
    }

    /* render one of the two screens */
    return step === 'lookup' ? (
      <IdDialog 
        trigger={trigger} 
        open={isOpen}
        onOpenChange={handleDialogClose}
        onSuccess={onSuccess}
      />
    ) : EditDialog ? (
      <EditDialog
        trigger={<div />}  // Empty trigger since dialog is already open
        defaultValues={defaultsFrom(resource!)}
        placeholders={{}}
        open={isOpen}
        onOpenChange={handleDialogClose}
        onSuccess={onSuccess}
      />
    ) : null
  }
} 