import { useEffect, useState } from 'react'
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

/** Naming what is missing is what makes an incomplete profile fixable. */
function missingFields(target: CalorieTargetState): string[] {
  const missing: string[] = []
  if (!target.heightCm) missing.push(t.meals.missing.height)
  if (!target.ageYears) missing.push(t.meals.missing.birthYear)
  if (!target.biologicalSex) missing.push(t.meals.missing.sex)
  return missing
}

/**
 * A number field that keeps what is being typed, and commits on blur.
 *
 * Committing on every keystroke means clamping every keystroke: typing « 178 »
 * starts at « 1 », which a 120 cm floor rewrites to 120, and the field can never
 * be finished. Half-typed numbers are not values, so nothing is stored until
 * focus leaves — and the stored value is echoed back so a rejected entry does
 * not silently linger on screen.
 */
function DraftNumberField({
  label,
  placeholder,
  value,
  onCommit,
}: {
  label: string
  placeholder: string
  value: number | null
  onCommit: (value: number | undefined) => void
}) {
  const [draft, setDraft] = useState(value ? String(value) : '')

  useEffect(() => {
    setDraft(value ? String(value) : '')
  }, [value])

  return (
    <Field label={label}>
      {(id) => (
        <Input
          id={id}
          className="tnum"
          inputMode="numeric"
          placeholder={placeholder}
          value={draft}
          onChange={(event) => setDraft(event.target.value.replace(/[^\d]/g, ''))}
          onBlur={() => {
            const parsed = Number(draft)
            onCommit(draft && Number.isFinite(parsed) && parsed > 0 ? parsed : undefined)
          }}
        />
      )}
    </Field>
  )
}

/**
 * The three facts a resting-rate formula needs and a weight cannot supply.
 *
 * Optional by design: leaving them blank keeps the app working on a cruder
 * estimate, which the screen labels as such and which still tracks the activity
 * level. They are worth asking for once because the gap between guessing and
 * knowing was about 300 kcal a day — the size of the deficit itself.
 */
export function BodyProfileFields({ target }: BodyProfileFieldsProps) {
  const currentYear = new Date().getFullYear()

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-muted-foreground">{t.meals.profileHint}</p>

      <DraftNumberField
        label={t.meals.heightLabel}
        placeholder={t.meals.heightPlaceholder}
        value={target.heightCm}
        onCommit={(heightCm) => target.setProfile({ heightCm })}
      />

      <DraftNumberField
        label={t.meals.birthYearLabel}
        placeholder={t.meals.birthYearPlaceholder}
        value={target.ageYears ? currentYear - target.ageYears : null}
        onCommit={(birthYear) => target.setProfile({ birthYear })}
      />

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
