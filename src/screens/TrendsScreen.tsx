import { TrendingUp } from 'lucide-react'
import { ScreenHeader } from '@/components/shared/ScreenHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { ConsistencyStrip } from '@/features/floor/ConsistencyStrip'
import { useFloor } from '@/features/floor/useFloor'
import { t } from '@/i18n/fr'

export function TrendsScreen() {
  const { score7, score30 } = useFloor()
  return (
    <>
      <ScreenHeader title={t.nav.trends} />
      <div className="px-4">
        <ConsistencyStrip score7={score7} score30={score30} />
      </div>
      <EmptyState Icon={TrendingUp} title={t.empty.trends} hint={t.empty.trendsHint} />
    </>
  )
}
