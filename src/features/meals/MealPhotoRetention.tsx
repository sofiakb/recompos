import { Segmented } from '@/components/ui/segmented'
import { useSettingsStore } from '@/stores/settingsStore'
import { t } from '@/i18n/fr'

const CHOICES = [0, 7, 30, 90] as const

/**
 * How long a meal photo is worth keeping.
 *
 * The numbers survive either way — only the bytes go. Three meals a day at
 * roughly 50 kB is about 55 MB a year, which IndexedDB holds without complaint,
 * but a plate photographed in March is not worth the space in December.
 */
export function MealPhotoRetention() {
  const days = useSettingsStore((state) => state.settings.mealPhotoRetentionDays)
  const setDays = useSettingsStore((state) => state.setMealPhotoRetentionDays)

  return (
    <div className="flex flex-col gap-2">
      <Segmented
        label={t.meals.retention}
        value={String(days)}
        options={CHOICES.map((choice) => ({
          value: String(choice),
          label: t.meals.retentionValue(choice),
        }))}
        onChange={(value) => setDays(Number(value))}
      />
      <p className="text-xs text-muted-foreground">{t.meals.retentionHint}</p>
    </div>
  )
}
