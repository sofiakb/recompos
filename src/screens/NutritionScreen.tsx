import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScreenHeader } from '@/components/shared/ScreenHeader'
import { CustomAmountSheet } from '@/features/nutrition/CustomAmountSheet'
import { ProteinLogList } from '@/features/nutrition/ProteinLogList'
import { ProteinRing } from '@/features/nutrition/ProteinRing'
import { QuickAddRow } from '@/features/nutrition/QuickAddRow'
import { TakeoutCheatSheet } from '@/features/nutrition/TakeoutCheatSheet'
import { ZeroCookCatalog } from '@/features/nutrition/ZeroCookCatalog'
import { useProtein } from '@/features/nutrition/useProtein'
import { useProteinTarget } from '@/features/nutrition/useProteinTarget'
import { useUiStore } from '@/stores/uiStore'
import { t } from '@/i18n/fr'
import type { ProteinLog, ProteinSource } from '@/types/models'

export function NutritionScreen() {
  const protein = useProtein()
  const target = useProteinTarget()
  const showToast = useUiStore((state) => state.showToast)
  const [customOpen, setCustomOpen] = useState(false)

  /** Every add is undoable for a few seconds — a mistyped 300 g is one tap away. */
  const addWithUndo = async (grams: number, source: ProteinSource, note?: string) => {
    const log: ProteinLog = await protein.add(grams, source, note)
    showToast(t.nutrition.addedGrams(grams), {
      label: t.nutrition.undo,
      run: () => protein.remove(log.id),
    })
  }

  return (
    <>
      <ScreenHeader title={t.nav.nutrition} />

      <div className="flex flex-col gap-3 px-4">
        <Card>
          <CardContent className="flex flex-col gap-4 pt-4">
            <ProteinRing
              totalGrams={protein.totalGrams}
              targetGrams={protein.targetGrams}
              remainingGrams={protein.remainingGrams}
            />

            <p className="text-center text-xs text-muted-foreground">
              {target.mode === 'auto' && target.smoothedWeightKg !== null
                ? t.nutrition.targetFromWeight(target.smoothedWeightKg, target.gramsPerKg)
                : null}
              {target.mode === 'manual' ? t.nutrition.targetManual : null}
              {target.isFallback ? t.nutrition.targetNoWeight : null}
            </p>

            <QuickAddRow
              onAdd={(grams) => void addWithUndo(grams, 'meal')}
              onCustom={() => setCustomOpen(true)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t.nutrition.todayTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <ProteinLogList
              logs={protein.logs}
              onRemove={(id) => void protein.remove(id)}
              onSetSource={(id, source) => void protein.setSource(id, source)}
            />
          </CardContent>
        </Card>

        <ZeroCookCatalog
          onLog={(item) => void addWithUndo(item.proteinPerServingGrams, 'zero_cook', item.name)}
        />

        <TakeoutCheatSheet
          onLog={(option) =>
            void addWithUndo(option.estimatedProteinGrams ?? 0, 'takeout', option.cuisine)
          }
        />
      </div>

      <CustomAmountSheet
        open={customOpen}
        onClose={() => setCustomOpen(false)}
        onSubmit={(grams) => {
          setCustomOpen(false)
          void addWithUndo(grams, 'meal')
        }}
      />
    </>
  )
}
