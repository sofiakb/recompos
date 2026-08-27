import { useState } from 'react'
import { Segmented } from '@/components/ui/segmented'
import { SubPage } from '@/components/shared/SubPage'
import { TakeoutCheatSheet } from '@/features/nutrition/TakeoutCheatSheet'
import { ZeroCookCatalog } from '@/features/nutrition/ZeroCookCatalog'
import { useProtein } from '@/features/nutrition/useProtein'
import { useUiStore } from '@/stores/uiStore'
import { t } from '@/i18n/fr'
import type { ProteinLog, ProteinSource } from '@/types/models'

type Tab = 'fridge' | 'delivery'

const TABS = [
  { value: 'fridge' as const, label: t.nutrition.inFridge },
  { value: 'delivery' as const, label: t.nutrition.delivery },
]

/**
 * The two catalogues, behind one question: what can I eat right now.
 *
 * They used to sit at the bottom of the Nutrition scroll, below the day's own
 * numbers — read every day, useful only when deciding.
 */
export function CataloguesScreen() {
  const protein = useProtein()
  const showToast = useUiStore((state) => state.showToast)
  const [tab, setTab] = useState<Tab>('fridge')

  /** Every add is undoable for a few seconds — a mistapped row is one tap away. */
  const addWithUndo = async (grams: number, source: ProteinSource, note?: string) => {
    const log: ProteinLog = await protein.add(grams, source, note)
    showToast(t.nutrition.addedGrams(grams), {
      label: t.nutrition.undo,
      run: () => protein.remove(log.id),
    })
  }

  return (
    <SubPage title={t.nutrition.catalogues} backTo="/nutrition">
      <Segmented
        label={t.nutrition.catalogues}
        value={tab}
        options={TABS}
        onChange={(value) => setTab(value as Tab)}
      />

      {tab === 'fridge' ? (
        <ZeroCookCatalog
          onLog={(item) => void addWithUndo(item.proteinPerServingGrams, 'zero_cook', item.name)}
        />
      ) : (
        <TakeoutCheatSheet
          onLog={(option) =>
            void addWithUndo(option.estimatedProteinGrams ?? 0, 'takeout', option.cuisine)
          }
        />
      )}
    </SubPage>
  )
}
