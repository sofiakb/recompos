import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { Sheet } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { t } from '@/i18n/fr'
import type { ProteinLog, ProteinSource } from '@/types/models'

const SOURCES: ProteinSource[] = ['meal', 'zero_cook', 'takeout', 'shake']

interface ProteinLogListProps {
  logs: ProteinLog[]
  onRemove: (id: string) => void
  onSetSource: (id: string, source: ProteinSource) => void
}

function formatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

export function ProteinLogList({ logs, onRemove, onSetSource }: ProteinLogListProps) {
  const [selected, setSelected] = useState<ProteinLog | null>(null)

  if (logs.length === 0) {
    return <p className="py-2 text-sm text-muted-foreground">{t.nutrition.noLogYet}</p>
  }

  return (
    <>
      <ul className="flex flex-col">
        {logs.map((log) => (
          <li key={log.id}>
            <button
              type="button"
              onClick={() => setSelected(log)}
              className="flex min-h-touch w-full items-center justify-between gap-3 rounded-md border-b border-border/60 py-2 text-left transition-colors active:bg-accent"
            >
              <span className="flex flex-col">
                <span className="text-sm font-medium">
                  {log.note ?? t.nutrition.source[log.sourceType]}
                </span>
                <span className="tnum text-xs text-muted-foreground">
                  {/* The source already titles the row when there is no note. */}
                  {log.note
                    ? `${formatTime(log.timestamp)} · ${t.nutrition.source[log.sourceType]}`
                    : formatTime(log.timestamp)}
                </span>
              </span>
              <span className="tnum shrink-0 text-sm font-semibold">+{log.grams} g</span>
            </button>
          </li>
        ))}
      </ul>

      <Sheet
        open={selected !== null}
        onClose={() => setSelected(null)}
        title={selected ? t.nutrition.editLog(selected.grams) : undefined}
      >
        <p className="mb-2 text-sm text-muted-foreground">{t.nutrition.sourceLabel}</p>
        <div className="grid grid-cols-2 gap-2">
          {SOURCES.map((source) => (
            <Button
              key={source}
              variant={selected?.sourceType === source ? 'primary' : 'secondary'}
              onClick={() => {
                if (selected) onSetSource(selected.id, source)
                setSelected((current) => (current ? { ...current, sourceType: source } : null))
              }}
            >
              {t.nutrition.source[source]}
            </Button>
          ))}
        </div>

        <Button
          variant="ghost"
          block
          className="mt-4 text-destructive"
          onClick={() => {
            if (selected) onRemove(selected.id)
            setSelected(null)
          }}
        >
          <Trash2 size={18} aria-hidden />
          {t.nutrition.removeLog}
        </Button>
      </Sheet>
    </>
  )
}
