import { useEffect, useState } from 'react'
import { ArrowLeft, Download, Upload } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ToggleRow } from '@/components/ui/toggle-row'
import { ProteinTargetStepper } from '@/features/nutrition/ProteinTargetStepper'
import { selectHabits, useSettingsStore } from '@/stores/settingsStore'
import { formatLongDate, toLogicalDate } from '@/lib/date'
import { SCHEMA_VERSION } from '@/types/models'
import { t } from '@/i18n/fr'

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`
  const units = ['Ko', 'Mo', 'Go']
  let value = bytes / 1024
  let unit = 0
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024
    unit++
  }
  return `${value.toFixed(value < 10 ? 1 : 0)} ${units[unit]}`
}

interface StorageInfo {
  usage: number
  quota: number
  persisted: boolean
}

function useStorageInfo(): StorageInfo | null {
  const [info, setInfo] = useState<StorageInfo | null>(null)
  useEffect(() => {
    let cancelled = false
    async function read() {
      if (!navigator.storage?.estimate) return
      const estimate = await navigator.storage.estimate()
      const persisted = (await navigator.storage.persisted?.()) ?? false
      if (cancelled) return
      setInfo({ usage: estimate.usage ?? 0, quota: estimate.quota ?? 0, persisted })
    }
    void read()
    return () => {
      cancelled = true
    }
  }, [])
  return info
}

export function SettingsScreen() {
  const settings = useSettingsStore((state) => state.settings)
  const habits = useSettingsStore((state) => state.habits)
  const setProteinTarget = useSettingsStore((state) => state.setProteinTarget)
  const setRestTimerSeconds = useSettingsStore((state) => state.setRestTimerSeconds)
  const toggleHaptics = useSettingsStore((state) => state.toggleHaptics)
  const toggleSound = useSettingsStore((state) => state.toggleSound)
  const storage = useStorageInfo()

  const floorCount = selectHabits(habits, 'floor').length
  const stackCount = selectHabits(habits, 'stack').length

  return (
    <>
      <header className="flex items-center gap-2 px-2 pb-2 pt-[calc(1rem+env(safe-area-inset-top))]">
        <Link
          to="/"
          aria-label={t.onboarding.back}
          className="h-touch w-touch flex items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <ArrowLeft size={22} aria-hidden />
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">{t.settings.title}</h1>
      </header>

      <div className="flex flex-col gap-3 px-4">
        <Card>
          <CardHeader>
            <CardTitle>{t.settings.proteinTarget}</CardTitle>
          </CardHeader>
          <CardContent>
            <ProteinTargetStepper value={settings.proteinTargetGrams} onChange={setProteinTarget} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t.settings.habits}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {t.settings.habitsCount(floorCount, stackCount)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{t.today.comingInLot}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t.settings.restTimer}</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2">
            {([60, 90] as const).map((seconds) => (
              <Button
                key={seconds}
                variant={settings.restTimerDefaultSeconds === seconds ? 'primary' : 'outline'}
                onClick={() => setRestTimerSeconds(seconds)}
                className="flex-1"
              >
                {seconds} s
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <ToggleRow
              label={t.settings.haptics}
              checked={settings.hapticsEnabled}
              onChange={toggleHaptics}
            />
            <ToggleRow
              label={t.settings.sound}
              checked={settings.soundEnabled}
              onChange={toggleSound}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t.settings.storage}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <p className="tnum text-sm text-muted-foreground">
              {storage && storage.quota > 0
                ? t.settings.storageUsage(formatBytes(storage.usage), formatBytes(storage.quota))
                : t.settings.storageUnknown}
            </p>
            <p className="text-xs text-muted-foreground">
              {storage?.persisted ? t.settings.storagePersisted : t.settings.storageBestEffort}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" disabled>
                <Download size={18} aria-hidden />
                {t.settings.export}
              </Button>
              <Button variant="outline" className="flex-1" disabled>
                <Upload size={18} aria-hidden />
                {t.settings.import}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">{t.today.comingInLot}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t.settings.about}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1 text-sm text-muted-foreground">
            <p>
              {t.settings.version} {SCHEMA_VERSION}.0
            </p>
            <p>
              {t.settings.installedOn}{' '}
              {formatLongDate(toLogicalDate(new Date(settings.installedAt)))}
            </p>
            <p className="mt-2 text-xs">{t.settings.dataNotice}</p>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
