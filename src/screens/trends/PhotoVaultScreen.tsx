import { SubPage } from '@/components/shared/SubPage'
import { PhotoVault } from '@/features/trends/PhotoVault'
import { t } from '@/i18n/fr'

/**
 * The photo vault, on its own page.
 *
 * It is the heaviest thing Progression carried and the least often opened —
 * body photos are taken once a month, not read every time a trend is checked.
 */
export function PhotoVaultScreen() {
  return (
    <SubPage title={t.photos.title} backTo="/trends">
      <p className="text-xs text-muted-foreground">{t.photos.hint}</p>
      <PhotoVault />
    </SubPage>
  )
}
