import { useRef, useState } from 'react'
import { Camera, PencilLine } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MealEditorSheet } from '@/features/meals/MealEditorSheet'
import { MealRow } from '@/features/meals/MealRow'
import { useUiStore } from '@/stores/uiStore'
import { t } from '@/i18n/fr'
import type { MealsState } from '@/features/nutrition/useMeals'
import type { MealEntry } from '@/types/models'

/** A blank row so « saisir à la main » reuses the same sheet as a correction. */
const BLANK: MealEntry | null = null

interface MealsCardProps {
  /**
   * Handed down rather than read here.
   *
   * `useMeals` owns the analysis queue, and mounting it twice on one screen
   * would run two drains over the same pending rows.
   */
  meals: MealsState
}

export function MealsCard({ meals }: MealsCardProps) {
  const showToast = useUiStore((state) => state.showToast)
  const fileInput = useRef<HTMLInputElement>(null)
  const [editing, setEditing] = useState<MealEntry | null>(BLANK)
  const [manualOpen, setManualOpen] = useState(false)
  const [capturing, setCapturing] = useState(false)

  const onFile = async (file: File | undefined) => {
    if (!file) return
    setCapturing(true)
    try {
      await meals.capture(file)
    } catch {
      showToast(t.photos.failed)
    } finally {
      setCapturing(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.meals.title}</CardTitle>
        <CardDescription>{t.meals.hint}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {meals.meals.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t.meals.empty}</p>
        ) : (
          <ul className="flex flex-col">
            {meals.meals.map((meal) => (
              <MealRow
                key={meal.id}
                meal={meal}
                analysing={meals.analysing.includes(meal.id)}
                photoUrlFor={meals.photoUrlFor}
                onOpen={setEditing}
                onRetry={(id) => void meals.retry(id)}
              />
            ))}
          </ul>
        )}

        {!meals.canAnalyse ? (
          <p className="text-sm text-muted-foreground">{t.meals.noProvider}</p>
        ) : null}

        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          // `capture` opens the camera straight away on a phone, while still
          // allowing the library on a desktop that has no camera.
          capture="environment"
          className="sr-only"
          onChange={(event) => {
            void onFile(event.target.files?.[0])
            event.target.value = ''
          }}
        />

        <Button
          size="lg"
          block
          disabled={!meals.canAnalyse || capturing}
          onClick={() => fileInput.current?.click()}
        >
          <Camera size={20} aria-hidden />
          {capturing ? t.meals.capturing : t.meals.capture}
        </Button>

        <Button variant="secondary" block onClick={() => setManualOpen(true)}>
          <PencilLine size={18} aria-hidden />
          {t.meals.addManual}
        </Button>
      </CardContent>

      <MealEditorSheet
        open={editing !== null}
        meal={editing}
        onClose={() => setEditing(null)}
        onSave={async (label, slot, items) => {
          if (!editing) return
          await meals.correct(editing.id, { label, slot, items })
          setEditing(null)
          showToast(t.meals.saved(items.reduce((total, item) => total + item.kcal, 0)))
        }}
        onDelete={async (id) => {
          await meals.remove(id)
          setEditing(null)
          showToast(t.meals.deleted)
        }}
        onRetry={(id, hint) => {
          // The sheet closes: the row shows « Analyse en cours… » and the result
          // arrives in place, rather than under a sheet frozen on stale numbers.
          setEditing(null)
          void meals.retry(id, hint)
        }}
      />

      <MealEditorSheet
        open={manualOpen}
        meal={null}
        onClose={() => setManualOpen(false)}
        onSave={async (label, slot, items) => {
          await meals.addManual(label, items, slot)
          setManualOpen(false)
          showToast(t.meals.saved(items.reduce((total, item) => total + item.kcal, 0)))
        }}
        onDelete={() => setManualOpen(false)}
        onRetry={() => setManualOpen(false)}
      />
    </Card>
  )
}
