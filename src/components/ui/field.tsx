import { useId } from 'react'
import { cn } from '@/lib/utils'

interface FieldProps {
  label: string
  hint?: string
  className?: string
  /** Receives the id to hang on the control, so the label stays associated. */
  children: (id: string) => React.ReactNode
}

export function Field({ label, hint, className, children }: FieldProps) {
  const id = useId()
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {children(id)}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  )
}
