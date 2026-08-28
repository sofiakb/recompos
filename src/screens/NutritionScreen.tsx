import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Camera, ScanBarcode, Sparkles, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { buttonVariants } from '@/components/ui/button-variants'
import { Sheet } from '@/components/ui/sheet'
import { ScreenHeader } from '@/components/shared/ScreenHeader'
import { CalorieCard } from '@/features/meals/CalorieCard'
import { BarcodeScanSheet } from '@/features/meals/BarcodeScanSheet'
import { CapturePreviewSheet } from '@/features/meals/CapturePreviewSheet'
import { DescribeMealSheet } from '@/features/meals/DescribeMealSheet'
import { MealEditorSheet } from '@/features/meals/MealEditorSheet'
import { ProductSheet } from '@/features/meals/ProductSheet'
import { useBarcode } from '@/features/meals/useBarcode'
import { CustomAmountSheet } from '@/features/nutrition/CustomAmountSheet'
import { DayJournal } from '@/features/nutrition/DayJournal'
import { buildDayJournal } from '@/features/nutrition/journal'
import { ProteinRing } from '@/features/nutrition/ProteinRing'
import { QuickAddRow } from '@/features/nutrition/QuickAddRow'
import { useMeals, type StagedPhoto } from '@/features/nutrition/useMeals'
import { useProtein } from '@/features/nutrition/useProtein'
import { useProteinTarget } from '@/features/nutrition/useProteinTarget'
import { useUiStore } from '@/stores/uiStore'
import { formatLongDate } from '@/lib/date'
import { t } from '@/i18n/fr'
import type { MealEntry, ProteinLog, ProteinSource } from '@/types/models'

const SOURCES: ProteinSource[] = ['meal', 'zero_cook', 'takeout', 'shake']

/**
 * Where the day stands, how to add to it, and what has been added.
 *
 * The catalogues moved to a sub-page: they answer « what can I eat », which is
 * a question asked when deciding, not every time the tab is opened.
 */
export function NutritionScreen() {
  const protein = useProtein()
  const meals = useMeals()
  const target = useProteinTarget()
  const showToast = useUiStore((state) => state.showToast)

  const fileInput = useRef<HTMLInputElement>(null)
  const [customOpen, setCustomOpen] = useState(false)
  const [capturing, setCapturing] = useState(false)
  const [staged, setStaged] = useState<StagedPhoto | null>(null)
  const [analysingCapture, setAnalysingCapture] = useState(false)
  const barcode = useBarcode()

  useEffect(() => {
    if (barcode.error) showToast(barcode.error)
  }, [barcode.error, showToast])
  const [describeOpen, setDescribeOpen] = useState(false)
  const [describing, setDescribing] = useState(false)
  const [editingMeal, setEditingMeal] = useState<MealEntry | null>(null)
  const [mealSheetOpen, setMealSheetOpen] = useState(false)
  const [editingLog, setEditingLog] = useState<ProteinLog | null>(null)

  const journal = useMemo(
    () => buildDayJournal(protein.logs, meals.meals),
    [protein.logs, meals.meals],
  )

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
    setCapturing(true)
    try {
      setStaged(await meals.stageCapture(file))
    } catch {
      showToast(t.photos.failed)
    } finally {
      setCapturing(false)
    }
  }

  const openMeal = (meal: MealEntry | null) => {
    setEditingMeal(meal)
    setMealSheetOpen(true)
  }

  return (
    <>
      <ScreenHeader eyebrow={formatLongDate(protein.today)} title={t.nav.nutrition} />

      <div className="flex flex-col gap-7 px-5 pt-2">
        <div className="flex flex-col gap-4">
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
        </div>

        <QuickAddRow
          onAdd={(grams) => void addWithUndo(grams, 'meal')}
          onCustom={() => setCustomOpen(true)}
        />

        <div className="grid grid-cols-2 gap-2">
          {/* A link, not a button: it navigates, so it should behave like one
              (middle-click, long-press) while wearing the button's clothes. */}
          <Link
            to="/nutrition/catalogues"
            className={buttonVariants({ variant: 'outline', size: 'lg' })}
          >
            {t.nutrition.whatToEat}
          </Link>
          <Button
            variant="secondary"
            size="lg"
            disabled={!meals.canAnalyse || capturing}
            onClick={() => fileInput.current?.click()}
          >
            <Camera size={18} aria-hidden />
            {capturing ? t.meals.capturing : t.nutrition.aMeal}
          </Button>
          <Button
            variant="secondary"
            size="lg"
            disabled={!meals.canAnalyse}
            onClick={() => setDescribeOpen(true)}
          >
            <Sparkles size={18} aria-hidden />
            {t.nutrition.describeMeal}
          </Button>
          <Button variant="secondary" size="lg" onClick={barcode.start}>
            <ScanBarcode size={18} aria-hidden />
            {t.nutrition.scanProduct}
          </Button>
        </div>

        {!meals.canAnalyse ? (
          <p className="-mt-4 text-xs text-muted-foreground">{t.meals.noProvider}</p>
        ) : null}

        <CalorieCard macros={meals.macros} />

        <section className="flex flex-col gap-2">
          <h2 className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">
            {t.nutrition.journalTitle}
          </h2>
          <DayJournal
            entries={journal}
            analysing={meals.analysing}
            onOpenProtein={setEditingLog}
            onOpenMeal={openMeal}
          />
          <Button variant="ghost" className="self-start" onClick={() => openMeal(null)}>
            {t.meals.addManual}
          </Button>
        </section>
      </div>

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

      <BarcodeScanSheet
        open={barcode.open}
        onClose={barcode.close}
        onDetected={(code) => void barcode.submit(code)}
      />
      {barcode.product ? (
        <ProductSheet
          open
          product={barcode.product}
          onClose={barcode.close}
          onAdd={(item) => {
            void meals.addProduct(item).then(() => showToast(t.meals.productAdded))
            barcode.close()
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
              .confirmCapture(staged, context || undefined)
              .catch(() => showToast(t.meals.unknownError))
              .finally(() => {
                setAnalysingCapture(false)
                setStaged(null)
              })
          }}
        />
      ) : null}

      <DescribeMealSheet
        open={describeOpen}
        pending={describing}
        onClose={() => setDescribeOpen(false)}
        onSubmit={(description) => {
          setDescribing(true)
          void meals
            .describeMeal(description)
            .catch(() => showToast(t.meals.unknownError))
            .finally(() => {
              setDescribing(false)
              setDescribeOpen(false)
            })
        }}
      />

      <MealEditorSheet
        open={mealSheetOpen}
        meal={editingMeal}
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
