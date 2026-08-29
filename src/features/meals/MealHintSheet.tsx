import { useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/input'
import { Sheet } from '@/components/ui/sheet'
import { MealPhoto } from '@/features/meals/MealPhoto'
import { t } from '@/i18n/fr'
import type { MealEntry } from '@/types/models'

interface MealHintSheetProps {
  open: boolean
  meal: MealEntry
  onClose: () => void
  onSubmit: (hint: string) => void
  /** Absent where there is no photo store to ask — the tests, mostly. */
  photoUrlFor?: (id: string) => Promise<string | null>
}

/**
 * Saying what the plate really was, so the estimate can be made again.
 *
 * Its own sheet rather than a box in the middle of the meal: correcting a whole
 * reading is a different act from adjusting one line, and this is the one place
 * where looking at the photo helps — you are typing what the model failed to
 * see in it.
 */
export function MealHintSheet({
  open,
  meal,
  onClose,
  onSubmit,
  photoUrlFor,
}: Readonly<MealHintSheetProps>) {
  const [hint, setHint] = useState(meal.hint ?? '')

  useEffect(() => {
    if (open) setHint(meal.hint ?? '')
  }, [open, meal])

  const hasSource = Boolean(meal.photoId) || meal.source === 'ai_text'

  return (
    <Sheet open={open} onClose={onClose} title={t.meals.hintTitle}>
      <div className="flex flex-col gap-3">
        <p className="text-[13px] text-muted-foreground">{t.meals.hintHint}</p>

        {meal.photoId && photoUrlFor ? (
          <MealPhoto
            mealId={meal.id}
            alt={meal.label || t.meals.title}
            load={photoUrlFor}
            className="h-40 w-full"
          />
        ) : null}

        {meal.status === 'done' && (meal.source === 'ai' || meal.source === 'ai_text') ? (
          <p className="text-xs text-muted-foreground">{t.meals.confidence[meal.confidence]}</p>
        ) : null}

        {hasSource ? (
          <>
            <Textarea
              aria-label={t.meals.hintTitle}
              value={hint}
              placeholder={t.meals.hintPlaceholder}
              onChange={(event) => setHint(event.target.value)}
            />
            <Button block disabled={!hint.trim()} onClick={() => onSubmit(hint.trim())}>
              <RefreshCw size={16} aria-hidden />
              {t.meals.hintSubmit}
            </Button>
          </>
        ) : (
          <p className="text-xs text-muted-foreground">{t.meals.hintNoPhoto}</p>
        )}
      </div>
    </Sheet>
  )
}
