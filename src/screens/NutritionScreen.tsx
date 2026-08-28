import { useEffect, useMemo, useRef, useState } from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet } from '@/components/ui/sheet'
import { useFloor } from '@/features/floor/useFloor'
import { AddSheet } from '@/features/meals/add/AddSheet'
import { CapturePreviewSheet } from '@/features/meals/CapturePreviewSheet'
import { MealEditorSheet } from '@/features/meals/MealEditorSheet'
import { ProductSheet } from '@/features/meals/ProductSheet'
import { useBarcode } from '@/features/meals/useBarcode'
import { useRecentMeals, type RecentMeal } from '@/features/meals/useRecentMeals'
import { CustomAmountSheet } from '@/features/nutrition/CustomAmountSheet'
import { DayNav } from '@/features/nutrition/DayNav'
import { DayTotals } from '@/features/nutrition/DayTotals'
import { buildSlotJournal } from '@/features/nutrition/journal'
import { MealSlotList } from '@/features/nutrition/MealSlotList'
import { useCalorieTarget, type CalorieTargetState } from '@/features/nutrition/useCalorieTarget'
import { useMeals, type StagedPhoto } from '@/features/nutrition/useMeals'
import { useProtein } from '@/features/nutrition/useProtein'
import { useProteinTarget, type ProteinTargetState } from '@/features/nutrition/useProteinTarget'
import { useUiStore } from '@/stores/uiStore'
import { formatLongDate, toLogicalDate } from '@/lib/date'
import { macroTargetsG, mealTargetKcal } from '@/lib/nutrition'
import { t } from '@/i18n/fr'
import type { MealEntry, MealSlot, ProteinLog, ProteinSource } from '@/types/models'

const SOURCES: ProteinSource[] = ['meal', 'zero_cook', 'takeout', 'shake']

/** The calorie target, said in one sentence — auto, manual or not yet knowable. */
function kcalExplain(target: CalorieTargetState): string {
  if (target.mode === 'manual') return t.nutrition.kcalTargetManual(target.targetKcal)
  if (target.isFallback) return t.nutrition.kcalTargetProvisional
  return t.nutrition.kcalTargetAuto(
    target.targetKcal,
    target.maintenanceKcal ?? 0,
    target.deficitPercent,
  )
}

function proteinExplain(target: ProteinTargetState): string {
  if (target.mode === 'manual') return t.nutrition.proteinTargetManual
  if (target.isFallback) return t.nutrition.proteinTargetNoWeight
  return t.nutrition.proteinFromWeight(target.smoothedWeightKg ?? 0, target.gramsPerKg)
}

/**
 * Where the day stands, how to add to it, and what has been added.
 *
 * The catalogues moved to a sub-page: they answer « what can I eat », which is
 * a question asked when deciding, not every time the tab is opened.
 */
export function NutritionScreen() {
  const [day, setDay] = useState(toLogicalDate())
  const protein = useProtein(day)
  const meals = useMeals(day)
  const target = useProteinTarget()
  const calories = useCalorieTarget()
  const { score7 } = useFloor()
  const showToast = useUiStore((state) => state.showToast)

  const fileInput = useRef<HTMLInputElement>(null)
  const [customOpen, setCustomOpen] = useState(false)
  const [staged, setStaged] = useState<StagedPhoto | null>(null)
  const [analysingCapture, setAnalysingCapture] = useState(false)
  const barcode = useBarcode()

  useEffect(() => {
    if (barcode.error) showToast(barcode.error)
  }, [barcode.error, showToast])
  const [describing, setDescribing] = useState(false)
  const [editingMeal, setEditingMeal] = useState<MealEntry | null>(null)
  const [mealSheetOpen, setMealSheetOpen] = useState(false)
  const [editingLog, setEditingLog] = useState<ProteinLog | null>(null)
  /** Which meal the add sheet is on; `null` closes it. */
  const [addingSlot, setAddingSlot] = useState<MealSlot | null>(null)
  /**
   * The meal an in-flight add belongs to, kept apart from the sheet's own state.
   *
   * Taking a photo hands the screen to the OS camera, and the product sheet
   * opens over the add sheet. Both outlive the sheet that started them, and both
   * still have to land on the right meal.
   */
  const [targetSlot, setTargetSlot] = useState<MealSlot>('lunch')
  const recent = useRecentMeals()

  const journal = useMemo(
    () => buildSlotJournal(protein.logs, meals.meals),
    [protein.logs, meals.meals],
  )

  const macroTargets = macroTargetsG(calories.targetKcal, target.targetGrams)
  const slotKcal = journal.find((group) => group.slot === targetSlot)?.kcal ?? 0
  // Protein comes from the ledger, not from the meals: a meal writes its protein
  // into that same ledger, so adding the two would count every photographed
  // meal twice.
  const totals = {
    kcal: meals.macros.kcal,
    proteinG: protein.totalGrams,
    carbsG: meals.macros.carbsG,
    fatG: meals.macros.fatG,
  }

  /** Every add is undoable for a few seconds — a mistyped 300 g is one tap away. */
  const addWithUndo = async (grams: number, source: ProteinSource, note?: string) => {
    const log: ProteinLog = await protein.add(grams, source, note)
    showToast(t.nutrition.addedGrams(grams), {
      label: t.nutrition.undo,
      run: () => protein.remove(log.id),
    })
  }

  const onFile = async (file: File | undefined) => {
    if (!file) return
    setAddingSlot(null)
    // Encoding a 12 Mpx photo takes a beat on a phone, and the add sheet has
    // just closed. Without this the screen sits blank and reads as « it did
    // not take ».
    showToast(t.meals.capturing)
    try {
      setStaged(await meals.stageCapture(file))
    } catch {
      showToast(t.photos.failed)
    }
  }

  const openMeal = (meal: MealEntry | null) => {
    setEditingMeal(meal)
    setMealSheetOpen(true)
  }

  const openAdd = (slot: MealSlot) => {
    setTargetSlot(slot)
    setAddingSlot(slot)
  }

  const addRecent = (meal: RecentMeal) => {
    setAddingSlot(null)
    void meals
      .addManual(meal.label, meal.items, targetSlot)
      .then(() => showToast(t.meals.saved(meal.kcal)))
  }

  const describe = (description: string) => {
    setDescribing(true)
    setAddingSlot(null)
    void meals
      .describeMeal(description, targetSlot)
      .catch(() => showToast(t.meals.unknownError))
      .finally(() => setDescribing(false))
  }

  const addKcalOnly = (kcal: number) => {
    setAddingSlot(null)
    const item = { name: t.nutrition.kcalOnly, quantity: '', kcal, proteinG: 0, carbsG: 0, fatG: 0 }
    void meals
      .addManual(t.nutrition.kcalOnly, [item], targetSlot)
      .then(() => showToast(t.meals.saved(kcal)))
  }

  return (
    <>
      <DayTotals
        dateLabel={formatLongDate(day)}
        consistencyPercent={day === toLogicalDate() ? score7.percent : null}
        totals={totals}
        targets={{
          kcal: calories.targetKcal,
          proteinG: target.targetGrams,
          carbsG: macroTargets.carbsG,
          fatG: macroTargets.fatG,
        }}
        explain={{ kcal: kcalExplain(calories), protein: proteinExplain(target) }}
      />

      <DayNav date={day} onChange={setDay} />

      <MealSlotList
        groups={journal}
        targetKcal={calories.targetKcal}
        analysing={meals.analysing}
        onAdd={openAdd}
        onOpenMeal={openMeal}
        onOpenProtein={setEditingLog}
      />

      <AddSheet
        slot={addingSlot}
        consumedKcal={slotKcal}
        targetKcal={mealTargetKcal(calories.targetKcal, targetSlot)}
        canAnalyse={meals.canAnalyse}
        describing={describing}
        recent={recent}
        onClose={() => setAddingSlot(null)}
        onPickRecent={addRecent}
        onProtein={(grams) => {
          setAddingSlot(null)
          void addWithUndo(grams, 'meal')
        }}
        onCustomProtein={() => {
          setAddingSlot(null)
          setCustomOpen(true)
        }}
        onKcalOnly={addKcalOnly}
        onOpenCamera={() => fileInput.current?.click()}
        onDescribe={describe}
        onBarcode={(code) => void barcode.submit(code)}
      />

      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        // `capture` opens the camera straight away on a phone, while still
        // allowing the library on a desktop that has no camera.
        capture="environment"
        className="sr-only"
        onChange={(event) => {
          void onFile(event.target.files?.[0])
          event.target.value = ''
        }}
      />

      <CustomAmountSheet
        open={customOpen}
        onClose={() => setCustomOpen(false)}
        onSubmit={(grams) => {
          setCustomOpen(false)
          void addWithUndo(grams, 'meal')
        }}
      />

      {barcode.product ? (
        <ProductSheet
          open
          product={barcode.product}
          onClose={barcode.close}
          onAdd={(item) => {
            void meals.addProduct(item, targetSlot).then(() => showToast(t.meals.productAdded))
            barcode.close()
            setAddingSlot(null)
          }}
        />
      ) : null}

      {staged ? (
        <CapturePreviewSheet
          open
          previewUrl={staged.previewUrl}
          pending={analysingCapture}
          onCancel={() => {
            meals.discardCapture(staged)
            setStaged(null)
          }}
          onConfirm={(context) => {
            setAnalysingCapture(true)
            void meals
              .confirmCapture(staged, { context: context || undefined, slot: targetSlot })
              .catch(() => showToast(t.meals.unknownError))
              .finally(() => {
                setAnalysingCapture(false)
                setStaged(null)
              })
          }}
        />
      ) : null}

      <MealEditorSheet
        open={mealSheetOpen}
        meal={editingMeal}
        defaultSlot={targetSlot}
        photoUrlFor={meals.photoUrlFor}
        onClose={() => setMealSheetOpen(false)}
        onSave={async (label, slot, items) => {
          const kcal = items.reduce((total, item) => total + item.kcal, 0)
          if (editingMeal) await meals.correct(editingMeal.id, { label, slot, items })
          else await meals.addManual(label, items, slot)
          setMealSheetOpen(false)
          showToast(t.meals.saved(kcal))
        }}
        onDelete={async (id) => {
          if (editingMeal) await meals.remove(id)
          setMealSheetOpen(false)
          if (editingMeal) showToast(t.meals.deleted)
        }}
        onRetry={(id, hint) => {
          // The sheet closes: the row shows « Analyse en cours… » and the result
          // arrives in place, rather than under a sheet frozen on stale numbers.
          setMealSheetOpen(false)
          void meals.retry(id, hint)
        }}
      />

      <Sheet
        open={editingLog !== null}
        onClose={() => setEditingLog(null)}
        title={editingLog ? t.nutrition.editLog(editingLog.grams) : undefined}
      >
        <p className="mb-2 text-sm text-muted-foreground">{t.nutrition.sourceLabel}</p>
        <div className="grid grid-cols-2 gap-2">
          {SOURCES.map((source) => (
            <Button
              key={source}
              variant={editingLog?.sourceType === source ? 'primary' : 'secondary'}
              onClick={() => {
                if (editingLog) void protein.setSource(editingLog.id, source)
                setEditingLog((current) => (current ? { ...current, sourceType: source } : null))
              }}
            >
              {t.nutrition.source[source]}
            </Button>
          ))}
        </div>

        <Button
          variant="ghost"
          block
          className="mt-4 text-destructive"
          onClick={() => {
            if (editingLog) void protein.remove(editingLog.id)
            setEditingLog(null)
          }}
        >
          <Trash2 size={18} aria-hidden />
          {t.nutrition.removeLog}
        </Button>
      </Sheet>
    </>
  )
}
