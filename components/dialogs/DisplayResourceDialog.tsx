"use client";

import React, { useState } from 'react'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Info } from 'lucide-react'

interface DisplayResourceDialogProps {
  resource: Record<string, any>
  title?: string
  triggerLabel?: string
  triggerVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
}

function formatValue(value: any): string | React.ReactNode {
  if (value === null) {
    return <Badge variant="secondary" className="text-xs">null</Badge>
  }
  
  if (value === undefined) {
    return <Badge variant="secondary" className="text-xs">undefined</Badge>
  }
  
  if (typeof value === 'boolean') {
    return <Badge variant={value ? "default" : "destructive"} className="text-xs">{value.toString()}</Badge>
  }
  
  if (typeof value === 'number') {
    return value.toString()
  }
  
  if (typeof value === 'string') {
    return value
  }
  
  if (Array.isArray(value)) {
    return value.join(', ')
  }
  
  if (typeof value === 'object') {
    return JSON.stringify(value)
  }
  
  return String(value)
}

function formatKey(key: string): string {
  // Convert camelCase or snake_case to readable format
  return key
    // Insert space before capital letter that follows a lowercase letter (camelCase)
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    // Replace underscores with spaces
    .replace(/_/g, ' ')
    // Capitalize first letter
    .replace(/^./, str => str.toUpperCase())
    .trim()
}

export function DisplayResourceDialog({ 
  resource, 
  title = "Resource Details",
  triggerLabel,
  triggerVariant = "outline"
}: DisplayResourceDialogProps) {
  const [open, setOpen] = useState(false)
  
  if (!resource) {
    return null
  }

  const entries = Object.entries(resource)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={triggerVariant} size="sm">
          <Info className="h-4 w-4" />
          {triggerLabel && <span className="ml-1">{triggerLabel}</span>}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <div className="max-h-[60vh] w-full overflow-y-auto">
          <div className="space-y-3 pr-4">
            {entries.length > 0 ? (
              entries.map(([key, value]) => (
                <div key={key} className="flex flex-col space-y-1">
                  <span className="text-sm font-medium text-gray-700">
                    {formatKey(key)}
                  </span>
                  <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded border">
                    {formatValue(value)}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-4">
                No data to display
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}