import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface MealPhotoProps {
  mealId: string
  alt: string
  load: (id: string) => Promise<string | null>
  className?: string
}

/**
 * A meal thumbnail, read from IndexedDB on demand.
 *
 * The object URL is revoked on unmount and whenever the meal changes: a journal
 * scrolled for a month would otherwise pin every photo it ever rendered.
 */
export function MealPhoto({ mealId, alt, load, className }: MealPhotoProps) {
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    let revoked = false
    let current: string | null = null
    void load(mealId).then((next) => {
      if (revoked) {
        if (next) URL.revokeObjectURL(next)
        return
      }
      current = next
      setUrl(next)
    })
    return () => {
      revoked = true
      if (current) URL.revokeObjectURL(current)
      setUrl(null)
    }
  }, [mealId, load])

  if (!url) return <div className={cn('rounded-lg bg-muted', className)} aria-hidden />
  return <img src={url} alt={alt} className={cn('rounded-lg object-cover', className)} />
}
