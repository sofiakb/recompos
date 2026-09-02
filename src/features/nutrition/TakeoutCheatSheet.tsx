import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Check, Pencil, Plus, Trash2, X } from 'lucide-react'
import { db } from '@/db/dexie'
import {
  addTakeoutOption,
  cuisinesOf,
  deleteTakeoutOption,
  updateTakeoutOption,
} from '@/db/repositories/catalogRepository'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TakeoutEditorSheet, type TakeoutDraft } from '@/features/nutrition/TakeoutEditorSheet'
import { useUiStore } from '@/stores/uiStore'
import { cn } from '@/lib/utils'
import { t } from '@/i18n/fr'
import type { TakeoutOption } from '@/types/models'
import { TapTarget } from '@/components/ui/tap-target'

interface TakeoutCheatSheetProps {
  onLog: (option: TakeoutOption) => void
}

/**
 * A decision sheet for the moment you are already hungry and ordering.
 *
 * Estimated grams are explicitly rough — logging one is better than logging
 * nothing, and the day's total is a guide, not an accounting ledger.
 *
 * Every entry is editable, seeded ones included: the defaults are a starting
 * point for someone else's neighbourhood, not a fixed truth about yours.
 */
export function TakeoutCheatSheet({ onLog }: TakeoutCheatSheetProps) {
  const options = useLiveQuery(() => db.takeoutOptions.toArray(), [], []) ?? []
  const showToast = useUiStore((state) => state.showToast)
  const [cuisine, setCuisine] = useState<string | null>(null)
  const [editing, setEditing] = useState<TakeoutOption | null>(null)
  const [editorOpen, setEditorOpen] = useState(false)

  const cuisines = cuisinesOf(options)
  const shown = cuisine ? options.filter((option) => option.cuisine === cuisine) : options

  const onSubmit = async (draft: TakeoutDraft) => {
    if (editing) await updateTakeoutOption(editing.id, draft)
    else await addTakeoutOption(draft)
    showToast(t.nutrition.itemSaved)
    setEditorOpen(false)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{t.nutrition.takeoutTitle}</CardTitle>
          <CardDescription>{t.nutrition.takeoutHint}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {/* A lone « Tout » chip over an empty sheet filters nothing. */}
          {options.length > 0 ? (
            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
              <TapTarget
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
              </TapTarget>
              {cuisines.map((name) => (
                <TapTarget
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
                </TapTarget>
              ))}
            </div>
          ) : null}

          <ul className="flex flex-col gap-3">
            {shown.map((option) => (
              <li key={option.id} className="rounded-lg border border-border/60 p-3">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold">{option.cuisine}</p>
                  {option.estimatedProteinGrams ? (
                    <TapTarget
                      type="button"
                      onClick={() => onLog(option)}
                      aria-label={t.nutrition.logItem(option.cuisine, option.estimatedProteinGrams)}
                      className="tnum flex min-h-touch shrink-0 items-center gap-1 rounded-full bg-secondary px-3 text-sm font-semibold text-primary transition-colors active:bg-accent"
                    >
                      <Plus size={14} aria-hidden />~{option.estimatedProteinGrams} g
                    </TapTarget>
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
                <div className="mt-2 flex justify-end gap-1">
                  <TapTarget
                    type="button"
                    aria-label={t.nutrition.editItem(option.cuisine)}
                    onClick={() => {
                      setEditing(option)
                      setEditorOpen(true)
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Pencil size={15} aria-hidden />
                  </TapTarget>
                  <TapTarget
                    type="button"
                    aria-label={t.nutrition.deleteItem(option.cuisine)}
                    onClick={async () => {
                      await deleteTakeoutOption(option.id)
                      showToast(t.nutrition.itemDeleted(option.cuisine))
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Trash2 size={15} aria-hidden />
                  </TapTarget>
                </div>
              </li>
            ))}
          </ul>

          {shown.length === 0 ? (
            <p className="py-2 text-sm text-muted-foreground">{t.nutrition.noTakeout}</p>
          ) : null}

          <Button
            variant="outline"
            block
            onClick={() => {
              setEditing(null)
              setEditorOpen(true)
            }}
          >
            <Plus size={18} aria-hidden />
            {t.nutrition.takeoutAdd}
          </Button>
        </CardContent>
      </Card>

      <TakeoutEditorSheet
        open={editorOpen}
        option={editing}
        onClose={() => setEditorOpen(false)}
        onSubmit={onSubmit}
      />
    </>
  )
}
