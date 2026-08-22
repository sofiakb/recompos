import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Check, Plus, X } from 'lucide-react'
import { db } from '@/db/dexie'
import { cuisinesOf } from '@/db/repositories/catalogRepository'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { t } from '@/i18n/fr'
import type { TakeoutOption } from '@/types/models'

interface TakeoutCheatSheetProps {
  onLog: (option: TakeoutOption) => void
}

/**
 * A decision sheet for the moment you are already hungry and ordering.
 *
 * Estimated grams are explicitly rough — logging one is better than logging
 * nothing, and the day's total is a guide, not an accounting ledger.
 */
export function TakeoutCheatSheet({ onLog }: TakeoutCheatSheetProps) {
  const options = useLiveQuery(() => db.takeoutOptions.toArray(), [], []) ?? []
  const [cuisine, setCuisine] = useState<string | null>(null)

  const cuisines = cuisinesOf(options)
  const shown = cuisine ? options.filter((option) => option.cuisine === cuisine) : options

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.nutrition.takeoutTitle}</CardTitle>
        <CardDescription>{t.nutrition.takeoutHint}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          <button
            type="button"
            onClick={() => setCuisine(null)}
            className={cn(
              'min-h-[36px] shrink-0 rounded-full border px-3 text-sm transition-colors',
              cuisine === null
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border text-muted-foreground',
            )}
          >
            {t.nutrition.allCuisines}
          </button>
          {cuisines.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => setCuisine(name)}
              className={cn(
                'min-h-[36px] shrink-0 rounded-full border px-3 text-sm transition-colors',
                cuisine === name
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border text-muted-foreground',
              )}
            >
              {name}
            </button>
          ))}
        </div>

        <ul className="flex flex-col gap-3">
          {shown.map((option) => (
            <li key={option.id} className="rounded-lg border border-border/60 p-3">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-semibold">{option.cuisine}</p>
                {option.estimatedProteinGrams ? (
                  <button
                    type="button"
                    onClick={() => onLog(option)}
                    aria-label={t.nutrition.logItem(option.cuisine, option.estimatedProteinGrams)}
                    className="tnum flex min-h-touch shrink-0 items-center gap-1 rounded-full bg-secondary px-3 text-sm font-semibold text-primary transition-colors active:bg-accent"
                  >
                    <Plus size={14} aria-hidden />~{option.estimatedProteinGrams} g
                  </button>
                ) : null}
              </div>
              <p className="mt-2 flex gap-2 text-sm">
                <Check size={16} className="mt-0.5 shrink-0 text-primary" aria-hidden />
                {option.pick}
              </p>
              <p className="mt-1 flex gap-2 text-sm text-muted-foreground">
                <X size={16} className="mt-0.5 shrink-0" aria-hidden />
                {option.avoid}
              </p>
            </li>
          ))}
        </ul>

        {shown.length === 0 ? (
          <p className="py-2 text-sm text-muted-foreground">{t.nutrition.noTakeout}</p>
        ) : null}
      </CardContent>
    </Card>
  )
}
