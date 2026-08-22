import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  Icon: LucideIcon
  title: string
  hint?: string
}

/** Never an empty screen alone: always a sentence saying what will fill it. */
export function EmptyState({ Icon, title, hint }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 px-8 py-16 text-center">
      <Icon size={32} className="text-muted-foreground" aria-hidden />
      <p className="text-sm font-medium">{title}</p>
      {hint ? <p className="max-w-xs text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  )
}
