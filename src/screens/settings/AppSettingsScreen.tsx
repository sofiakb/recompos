import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ToggleRow } from '@/components/ui/toggle-row'
import { SettingsPage } from '@/screens/settings/SettingsPage'
import { useSettingsStore } from '@/stores/settingsStore'
import { formatCalendarDate, toLogicalDate } from '@/lib/date'
import { SCHEMA_VERSION } from '@/types/models'
import { t } from '@/i18n/fr'

export function AppSettingsScreen() {
  const settings = useSettingsStore((state) => state.settings)
  const toggleHaptics = useSettingsStore((state) => state.toggleHaptics)
  const toggleSound = useSettingsStore((state) => state.toggleSound)
  const replayOnboarding = useSettingsStore((state) => state.replayOnboarding)

  return (
    <SettingsPage title={t.settings.sections.app.title} backTo="/settings">
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
        <CardContent className="flex flex-col gap-2 pt-4">
          <Button variant="outline" block onClick={replayOnboarding}>
            {t.settings.replayOnboarding}
          </Button>
          <p className="text-xs text-muted-foreground">{t.settings.replayOnboardingHint}</p>
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
            {formatCalendarDate(toLogicalDate(new Date(settings.installedAt)))}
          </p>
          <p className="mt-2 text-xs">{t.settings.dataNotice}</p>
        </CardContent>
      </Card>
    </SettingsPage>
  )
}
