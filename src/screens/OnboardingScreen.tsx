import { useState } from 'react'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProteinTargetEditor } from '@/features/nutrition/ProteinTargetEditor'
import { useProteinTarget } from '@/features/nutrition/useProteinTarget'
import { useWeight } from '@/features/weight/useWeight'
import { MAX_WEIGHT_KG, MIN_WEIGHT_KG } from '@/lib/nutrition'
import { selectHabits, useSettingsStore } from '@/stores/settingsStore'
import { cn } from '@/lib/utils'
import { t } from '@/i18n/fr'

const TOTAL_STEPS = 3

/**
 * Three screens, roughly thirty seconds, shown once (PRD §6, décision n°8).
 * Everything here is pre-filled: skipping straight through leaves a usable app.
 */
export function OnboardingScreen() {
  const [step, setStep] = useState(0)
  const [weightInput, setWeightInput] = useState('')
  const target = useProteinTarget()
  const weight = useWeight()
  const habits = useSettingsStore((state) => state.habits)
  const updateHabit = useSettingsStore((state) => state.updateHabit)
  const archiveHabit = useSettingsStore((state) => state.archiveHabit)
  const completeOnboarding = useSettingsStore((state) => state.completeOnboarding)

  const floorHabits = selectHabits(habits, 'floor')

  const finish = () => completeOnboarding()
  const next = () => (step === TOTAL_STEPS - 1 ? finish() : setStep((s) => s + 1))

  return (
    <div className="flex min-h-full flex-col px-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-[calc(2rem+env(safe-area-inset-top))]">
      <div className="flex items-center justify-between">
        <span className="tnum text-xs text-muted-foreground">
          {t.onboarding.step(step + 1, TOTAL_STEPS)}
        </span>
        <Button variant="ghost" onClick={finish} className="text-muted-foreground">
          {t.onboarding.skip}
        </Button>
      </div>

      <div className="mt-2 flex gap-1.5" aria-hidden>
        {Array.from({ length: TOTAL_STEPS }, (_, i) => (
          <span
            key={i}
            className={cn(
              'h-1 flex-1 rounded-full transition-colors',
              i <= step ? 'bg-primary' : 'bg-muted',
            )}
          />
        ))}
      </div>

      <div className="flex flex-1 flex-col justify-center py-8">
        {step === 0 ? (
          <section>
            <p className="text-sm font-medium text-primary">{t.app.tagline}</p>
            <h1 className="mt-2 text-3xl font-semibold leading-tight tracking-tight">
              {t.onboarding.welcome.title}
            </h1>
            <p className="mt-4 text-muted-foreground">{t.onboarding.welcome.body}</p>
          </section>
        ) : null}

        {step === 1 ? (
          <section>
            <h1 className="text-3xl font-semibold leading-tight tracking-tight">
              {t.onboarding.weight.title}
            </h1>
            <p className="mt-3 text-muted-foreground">{t.onboarding.weight.body}</p>

            <div className="mt-6 flex items-center gap-2">
              <input
                type="text"
                inputMode="decimal"
                aria-label={t.onboarding.weight.title}
                value={weightInput}
                onChange={(event) => setWeightInput(event.target.value)}
                onBlur={() => {
                  const kg = Number(weightInput.replace(',', '.'))
                  if (Number.isFinite(kg) && kg >= MIN_WEIGHT_KG && kg <= MAX_WEIGHT_KG) {
                    void weight.log(kg)
                  }
                }}
                placeholder="80,5"
                className="tnum min-h-[56px] flex-1 rounded-lg border border-border bg-card px-4 text-2xl font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <span className="text-lg text-muted-foreground">kg</span>
            </div>

            <div className="mt-8">
              <p className="mb-2 text-center text-sm font-medium">{t.onboarding.protein.title}</p>
              <ProteinTargetEditor target={target} />
            </div>
          </section>
        ) : null}

        {step === 2 ? (
          <section>
            <h1 className="text-3xl font-semibold leading-tight tracking-tight">
              {t.onboarding.floor.title}
            </h1>
            <p className="mt-3 text-muted-foreground">{t.onboarding.floor.body}</p>
            <ul className="mt-6 flex flex-col gap-2">
              {floorHabits.map((habit) => (
                <li key={habit.id} className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check size={16} strokeWidth={3} aria-hidden />
                  </span>
                  <input
                    aria-label={habit.title}
                    value={habit.title}
                    onChange={(event) =>
                      updateHabit(habit.id, {
                        title: event.target.value,
                        targetRepsOrAction: event.target.value,
                      })
                    }
                    className="min-h-touch flex-1 rounded-md border border-border bg-card px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  {floorHabits.length > 1 ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Retirer ${habit.title}`}
                      onClick={() => archiveHabit(habit.id)}
                      className="text-muted-foreground"
                    >
                      ×
                    </Button>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>

      <div className="flex gap-2">
        {step > 0 ? (
          <Button variant="outline" size="lg" onClick={() => setStep((s) => s - 1)}>
            {t.onboarding.back}
          </Button>
        ) : null}
        <Button size="lg" block onClick={next}>
          {step === TOTAL_STEPS - 1 ? t.onboarding.start : t.onboarding.next}
        </Button>
      </div>
    </div>
  )
}
