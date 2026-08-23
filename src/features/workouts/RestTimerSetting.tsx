import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet } from '@/components/ui/sheet'
import {
  clampRestSeconds,
  formatDuration,
  MAX_REST_SECONDS,
  MIN_REST_SECONDS,
  REST_PRESETS,
} from '@/lib/timer'
import { useSettingsStore } from '@/stores/settingsStore'
import { t } from '@/i18n/fr'

/**
 * Two presets plus a free duration (PRD §6.3).
 *
 * The third button doubles as the current value when it is not a preset, so the
 * chosen duration is always visible without opening anything.
 */
export function RestTimerSetting() {
  const current = useSettingsStore((state) => state.settings.restTimerDefaultSeconds)
  const setRestTimerSeconds = useSettingsStore((state) => state.setRestTimerSeconds)
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')

  const isPreset = (REST_PRESETS as readonly number[]).includes(current)

  useEffect(() => {
    if (open) setValue(String(current))
  }, [open, current])

  const parsed = Number(value)
  const isValid =
    Number.isFinite(parsed) && parsed >= MIN_REST_SECONDS && parsed <= MAX_REST_SECONDS

  return (
    <>
      <div className="flex gap-2">
        {REST_PRESETS.map((seconds) => (
          <Button
            key={seconds}
            variant={current === seconds ? 'primary' : 'outline'}
            onClick={() => setRestTimerSeconds(seconds)}
            className="flex-1"
          >
            {seconds} s
          </Button>
        ))}
        <Button
          variant={isPreset ? 'outline' : 'primary'}
          onClick={() => setOpen(true)}
          className="flex-1"
        >
          {isPreset ? t.settings.restTimerCustom : formatDuration(current)}
        </Button>
      </div>

      <Sheet open={open} onClose={() => setOpen(false)} title={t.settings.restTimerCustomTitle}>
        <p className="mb-3 text-sm text-muted-foreground">
          {t.settings.restTimerRange(MIN_REST_SECONDS, MAX_REST_SECONDS)}
        </p>
        <div className="flex items-center gap-2">
          <input
            type="text"
            inputMode="numeric"
            autoFocus
            aria-label={t.settings.restTimerCustomTitle}
            value={value}
            onChange={(event) => setValue(event.target.value.replace(/\D/g, ''))}
            className="tnum min-h-[56px] flex-1 rounded-lg border border-border bg-background px-4 text-2xl font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <span className="text-lg text-muted-foreground">s</span>
        </div>
        <Button
          size="lg"
          block
          className="mt-3"
          disabled={!isValid}
          onClick={() => {
            if (!isValid) return
            setRestTimerSeconds(clampRestSeconds(parsed))
            setOpen(false)
          }}
        >
          {t.common.save}
        </Button>
      </Sheet>
    </>
  )
}
