import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCalendarDate } from '@/lib/date'
import { useSettingsStore } from '@/stores/settingsStore'
import { t } from '@/i18n/fr'

/**
 * Where the coach's access is withdrawn (spec coach §6.3).
 *
 * Granting happens on the coach screen, at the moment it matters; withdrawing
 * lives here, next to the key it depends on.
 */
export function CoachConsentCard() {
  const consentAt = useSettingsStore((state) => state.settings.coachConsentAt)
  const setCoachConsent = useSettingsStore((state) => state.setCoachConsent)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.coach.settingsTitle}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="text-sm text-muted-foreground">
          {consentAt
            ? t.coach.consentGiven(formatCalendarDate(consentAt.slice(0, 10)))
            : t.coach.consentNone}
        </p>
        {consentAt ? (
          <Button variant="secondary" size="lg" onClick={() => setCoachConsent(false)}>
            {t.coach.consentWithdraw}
          </Button>
        ) : null}
      </CardContent>
    </Card>
  )
}
