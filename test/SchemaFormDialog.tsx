'use client'

import { ReactNode, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import React from 'react' // Added missing import for React.useEffect
import { cn } from '@/lib/utils'

// Field configuration type - type is now auto-inferred from schema
interface FieldConfig {
  name: string
  label: string
  placeholder?: string
  // Optional override for special cases (e.g., password field)
  type?: 'text' | 'email' | 'password' | 'number' | 'select'
  options?: Array<{ value: string | number; label: string }>
}

// Utility function to infer input type from Zod schema
function getFieldTypeFromSchema(schema: z.ZodSchema<any>, fieldName: string): string {
  try {
    // Get the field definition from the schema
    const shape = (schema as any)._def?.shape || (schema as any).shape
    if (!shape || !shape[fieldName]) {
      return 'text' // fallback
    }
    
    const field = shape[fieldName]
    const typeName = field._def?.typeName || field.constructor?.name
    
    // Unwrap optional/nullable types
    let actualField = field
    if (typeName === 'ZodOptional' || typeName === 'ZodNullable') {
      actualField = field._def.innerType
    }
    
    const actualTypeName = actualField._def?.typeName || actualField.constructor?.name
    
    // Map Zod types to HTML input types
    switch (actualTypeName) {
      case 'ZodNumber':
        return 'number'
      case 'ZodString':
        // Check for email validation
        const checks = actualField._def?.checks || []
        if (checks.some((check: any) => check.kind === 'email')) {
          return 'email'
        }
        return 'text'
      case 'ZodBranded':
        // Check for custom branded types (like password)
        const brand = actualField._def?.type?._def?.brand
        if (brand === 'password') {
          return 'password'
        }
        // Recursively check the underlying type
        return getFieldTypeFromSchema({ shape: { [fieldName]: actualField._def.type } } as any, fieldName)
      case 'ZodBoolean':
        return 'checkbox'
      case 'ZodEnum':
        return 'select'
      default:
        return 'text'
    }
  } catch (error) {
    console.warn(`Could not infer type for field ${fieldName}:`, error)
    return 'text'
  }
}

// Factory function that creates a specialized dialog component
export function createSchemaDialog(config: {
  schema: z.ZodSchema<any>
  fields: FieldConfig[]
  title: string
  onSubmit: (data: any) => Promise<any> | any
  defaultValues?: Record<string, any> // Factory-level defaults for specialized dialogs
}) {
  return function SchemaDialog({
    trigger,
    defaultValues = {},
    placeholders = {},
    open,
    onOpenChange,
  }: {
    trigger?: ReactNode
    defaultValues?: Record<string, any>
    placeholders?: Record<string, string>
    open?: boolean
    onOpenChange?: (open: boolean) => void
  }) {
    const [internalOpen, setInternalOpen] = useState(false)
    const [serverError, setServerError] = useState<string | null>(null)
    const [confirmationData, setConfirmationData] = useState<any>(null)
    const [isConfirmationMode, setIsConfirmationMode] = useState(false)
    // We will rely on the Radix exit animation to know when the dialog has
    // actually unmounted instead of tracking our own `isClosing` flag.
    
    const dialogOpen = open !== undefined ? open : internalOpen
    const setDialogOpen = onOpenChange || setInternalOpen

    // Create default values from field configs
    const fieldDefaults = config.fields.reduce((acc, field) => {
      // Use undefined for optional fields instead of empty strings
      // This way empty fields are naturally undefined
      acc[field.name] = undefined
      return acc
    }, {} as Record<string, any>)

    // Merge all default values: field defaults < factory defaults < component defaults
    const mergedDefaults = {
      ...fieldDefaults,
      ...(config.defaultValues || {}),
      ...defaultValues
    }

    const form = useForm({
      defaultValues: mergedDefaults,
    })

    // Update form when defaultValues change (important for editing)
    React.useEffect(() => {
      form.reset(mergedDefaults)
    }, [JSON.stringify(defaultValues), JSON.stringify(config.defaultValues)])

    // Reset confirmation mode when dialog opens/closes – but delay clearing
    // the `isClosing` flag until after the exit animation so the form does
    // not flash briefly during the fade-out.
    React.useEffect(() => {
      if (dialogOpen) {
        // Clear any lingering server error when (re)opening.
        setServerError(null)
      }
    }, [dialogOpen])

    async function handleSubmit(values: any) {
      setServerError(null) // Reset server error before each submit
      
      try {
        // Validate with Zod schema and set field errors
        const result = config.schema.safeParse(values)
        if (!result.success) {
          // Clear previous errors
          form.clearErrors()
          
          // Set field-specific errors from Zod validation
          result.error.issues.forEach((issue: any) => {
            const fieldName = issue.path[0]
            if (fieldName) {
              form.setError(fieldName as string, {
                type: 'manual',
                message: issue.message
              })
            }
          })
          
          toast.error('Please fix the validation errors')
          return
        }
        
        // Filter out undefined values (for optional fields that were left empty)
        const filteredData = Object.fromEntries(
          Object.entries(result.data).filter(([_, value]) => value !== undefined)
        )
        
        const responseData = await config.onSubmit(filteredData)
        
        // If we got response data, show confirmation instead of closing immediately
        if (responseData) {
          setConfirmationData(responseData)
          setIsConfirmationMode(true)
          toast.success('Saved successfully')
        } else {
          // No response data, close normally
          toast.success('Saved successfully')
          form.reset(mergedDefaults)
          setDialogOpen(false)
        }
      } catch (error) {
        console.error('Problem Details:', error) // Log full object for debugging
        
        // Pick the most useful text the server gave us
        const message = 
          (typeof error === 'object' && error !== null && ('detail' in error || 'title' in error))
            ? (() => {
                const title = (error as any).title ?? ''
                const detail = (error as any).detail ?? ''
                if (title && detail) {
                  return `${title}: ${detail}`
                } else {
                  return (title || detail).trim()
                }
              })()
            : String(error)

        setServerError(message) // Show in dialog
        toast.error(message) // Also show in toast
      }
    }

    function handleConfirmationClose() {
      // Simply close the dialog. The cleanup will happen after the exit
      // animation ends (`handleDialogAnimationEnd`).
      setDialogOpen(false)
    }

    function handleDialogAnimationEnd(e: React.AnimationEvent<HTMLDivElement>) {
      // When the close animation finishes, Radix keeps the element mounted with
      // data-state="closed" for a moment. Reset internal state *after* that so
      // nothing flashes during the exit.
      if ((e.currentTarget as HTMLElement).dataset.state === 'closed') {
        setIsConfirmationMode(false)
        setConfirmationData(null)
        setServerError(null)
        form.reset(mergedDefaults)
      }
    }

    return (
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          {trigger || <Button>{config.title}</Button>}
        </DialogTrigger>

        <DialogContent
          className="sm:max-w-[400px]"
          onAnimationEnd={handleDialogAnimationEnd}
        >
          <DialogHeader>
            <DialogTitle>
              {isConfirmationMode ? `${config.title} - Confirmation` : config.title}
            </DialogTitle>
          </DialogHeader>

          {serverError && (
            <div className="rounded bg-red-50 border border-red-300 p-2 text-sm text-red-700">
              {serverError}
            </div>
          )}

          {isConfirmationMode ? (
            // Confirmation view showing the created/updated resource
            <div className="space-y-4">
              <div className="rounded bg-green-50 border border-green-300 p-3">
                <h4 className="font-medium text-green-800 mb-2">Successfully saved!</h4>
                <div className="text-sm text-green-700 space-y-1">
                  {confirmationData && typeof confirmationData === 'object' ? (
                    Object.entries(confirmationData).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="font-medium">
                          {String(key)
                            .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between lowercase and uppercase
                            .split(' ') // Split into words  
                            .map(word => {
                              // Keep common abbreviations uppercase
                              const upperWord = word.toUpperCase()
                              if (['ID', 'URL', 'API', 'UI', 'DB'].includes(upperWord)) {
                                return upperWord
                              }
                              // Normal title case for other words
                              return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                            })
                            .join(' ') // Join back together
                          }:
                        </span>
                        <span>{String(value)}</span>
                      </div>
                    ))
                  ) : (
                    <div>Operation completed successfully</div>
                  )}
                </div>
              </div>
              
              <DialogFooter>
                <Button onClick={handleConfirmationClose}>
                  Done
                </Button>
              </DialogFooter>
            </div>
          ) : (
            // Normal form view
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                {config.fields.map((fieldConfig) => {
                  // Auto-infer type from schema, or use manual override
                  const inferredType = fieldConfig.type || getFieldTypeFromSchema(config.schema, fieldConfig.name)
                  
                  // Get placeholder: component-level override > factory field config > default
                  const placeholder = placeholders[fieldConfig.name] || fieldConfig.placeholder
                  
                  return (
                    <FormField
                      key={fieldConfig.name}
                      control={form.control}
                      name={fieldConfig.name as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{fieldConfig.label}</FormLabel>
                          <FormControl>
                            {inferredType === 'select' ? (
                            <select
                              {...field}
                              onChange={(e) => {
                                const value = e.target.value
                                if (value === '') {
                                  field.onChange(undefined)
                                } else {
                                  const optionValue = fieldConfig.options?.find(opt => opt.value.toString() === value)?.value
                                  field.onChange(typeof optionValue === 'number' ? Number(value) : value)
                                }
                              }}
                              value={field.value ?? ''}
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                              <option value="">Select {fieldConfig.label}...</option>
                              {fieldConfig.options?.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <Input
                              type={inferredType}
                              placeholder={placeholder}
                              {...field}
                              value={field.value || ''}
                              onChange={(e) => {
                                const value = e.target.value
                                if (inferredType === 'number') {
                                  field.onChange(value === '' ? undefined : Number(value))
                                } else {
                                  field.onChange(value === '' ? undefined : value)
                                }
                              }}
                            />
                          )}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  )
                })}

                <DialogFooter>
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? 'Saving...' : 'Save'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
    )
  }
}
