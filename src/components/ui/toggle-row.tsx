import { cn } from '@/lib/utils'

interface ToggleRowProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  description?: string
  className?: string
}

export function ToggleRow({ label, checked, onChange, description, className }: ToggleRowProps) {
  return (
    <label
      className={cn(
        'flex min-h-touch cursor-pointer items-center justify-between gap-4 py-2',
        className,
      )}
    >
      <span className="flex flex-col">
        <span className="text-sm font-medium">{label}</span>
        {description ? <span className="text-xs text-muted-foreground">{description}</span> : null}
      </span>
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span
        aria-hidden
        className="relative h-6 w-11 shrink-0 rounded-full bg-muted transition-colors peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background peer-checked:[&>span]:translate-x-5"
      >
        <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-foreground transition-transform" />
      </span>
    </label>
  )
}
