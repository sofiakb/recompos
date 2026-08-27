import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Segmented } from '@/components/ui/segmented'
import { ACTIVITY_FACTORS, type ActivityLevel, type BiologicalSex } from '@/lib/nutrition'
import { t } from '@/i18n/fr'
import type { CalorieTargetState } from '@/features/nutrition/useCalorieTarget'

interface BodyProfileFieldsProps {
  target: CalorieTargetState
}

const ACTIVITY_OPTIONS = (Object.keys(ACTIVITY_FACTORS) as ActivityLevel[]).map((level) => ({
  value: level,
  label: t.meals.activity[level],
}))

/** `''` is a real state here: nothing chosen yet. */
const SEX_OPTIONS: Array<{ value: BiologicalSex | ''; label: string }> = [
  { value: 'male', label: t.meals.sex.male },
  { value: 'female', label: t.meals.sex.female },
]

/**
 * The three facts a resting-rate formula needs and a weight cannot supply.
 *
 * Optional by design: leaving them blank keeps the app working on a cruder
 * weight-only estimate, which the screen labels as such. They are worth asking
 * for once because the gap between guessing and knowing was about 300 kcal a day
 * — the size of the deficit itself.
 */
/** Naming what is missing is what makes an incomplete profile fixable. */
function missingFields(target: CalorieTargetState): string[] {
  const missing: string[] = []
  if (!target.heightCm) missing.push(t.meals.missing.height)
  if (!target.ageYears) missing.push(t.meals.missing.birthYear)
  if (!target.biologicalSex) missing.push(t.meals.missing.sex)
  return missing
}

export function BodyProfileFields({ target }: BodyProfileFieldsProps) {
  const currentYear = new Date().getFullYear()

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-muted-foreground">{t.meals.profileHint}</p>

      <Field label={t.meals.heightLabel}>
        {(id) => (
          <Input
            id={id}
            className="tnum"
            inputMode="numeric"
            placeholder="178"
            value={target.heightCm ? String(target.heightCm) : ''}
            onChange={(event) => {
              const parsed = Number(event.target.value.replace(',', '.'))
              target.setProfile({
                heightCm: Number.isFinite(parsed) && parsed ? parsed : undefined,
              })
            }}
          />
        )}
      </Field>

      <Field label={t.meals.birthYearLabel}>
        {(id) => (
          <Input
            id={id}
            className="tnum"
            inputMode="numeric"
            placeholder={String(currentYear - 35)}
            value={target.ageYears ? String(currentYear - target.ageYears) : ''}
            onChange={(event) => {
              const parsed = Number(event.target.value)
              target.setProfile({
                birthYear: Number.isFinite(parsed) && parsed > 1900 ? parsed : undefined,
              })
            }}
          />
        )}
      </Field>

      <div className="flex flex-col gap-1.5">
        {/* No pre-selection. A control that displays « Homme » without having
            stored it leaves the profile silently incomplete while looking
            filled in — which is exactly what happened. */}
        <Segmented
          label={t.meals.sexLabel}
          value={target.biologicalSex ?? ''}
          options={SEX_OPTIONS}
          onChange={(value) => target.setProfile({ biologicalSex: value as BiologicalSex })}
        />
        <p className="text-xs text-muted-foreground">{t.meals.sexHint}</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <Segmented
          label={t.meals.activityLabel}
          value={target.activityLevel}
          options={ACTIVITY_OPTIONS}
          onChange={(value) => target.setProfile({ activityLevel: value })}
        />
        <p className="text-xs text-muted-foreground">{t.meals.activityHint}</p>
      </div>

      <p className="text-xs text-muted-foreground">
        {target.maintenanceFromProfile
          ? t.meals.profileComplete
          : t.meals.profileMissing(missingFields(target))}
      </p>
    </div>
  )
}
