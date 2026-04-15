'use client'

import { Button } from '@/components/ui/button'
import { Loader } from 'lucide-react'
import { useFormContext } from 'react-hook-form'

export function SaveSettingsButton() {
  const { formState: { isSubmitting } } = useFormContext()

  return (
    <Button type="submit" disabled={isSubmitting}>
      {isSubmitting ? <Loader className="animate-spin mr-2 h-4 w-4" /> : null}
      {isSubmitting ? 'Saving...' : 'Save Changes'}
    </Button>
  )
}
