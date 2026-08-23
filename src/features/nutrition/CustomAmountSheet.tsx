import { useEffect, useState } from 'react'
import { Delete } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet } from '@/components/ui/sheet'
import { MAX_PROTEIN_LOG_GRAMS } from '@/lib/nutrition'
import { t } from '@/i18n/fr'

interface CustomAmountSheetProps {
  open: boolean
  onClose: () => void
  onSubmit: (grams: number) => void
}

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']

/**
 * A keypad rather than a text input: the OS keyboard covers half the screen and
 * takes a beat to appear, which is the opposite of a 1-tap log.
 */
export function CustomAmountSheet({ open, onClose, onSubmit }: CustomAmountSheetProps) {
  const [value, setValue] = useState('')

  useEffect(() => {
    if (open) setValue('')
  }, [open])

  const grams = Number(value || '0')
  const isValid = grams > 0 && grams <= MAX_PROTEIN_LOG_GRAMS

  const press = (key: string) => {
    setValue((current) => {
      const next = `${current}${key}`.replace(/^0+/, '')
      return Number(next) > MAX_PROTEIN_LOG_GRAMS ? current : next
    })
  }

  return (
    <Sheet open={open} onClose={onClose} title={t.nutrition.custom}>
      <p className="tnum mb-4 text-center text-5xl font-semibold">
        {value || '0'}
        <span className="ml-1 text-lg text-muted-foreground">g</span>
      </p>

      <div className="grid grid-cols-3 gap-2">
        {KEYS.slice(0, 9).map((key) => (
          <Button key={key} size="lg" variant="secondary" onClick={() => press(key)}>
            {key}
          </Button>
        ))}
        <Button
          size="lg"
          variant="ghost"
          aria-label={t.common.cancel}
          onClick={() => setValue('')}
          className="text-muted-foreground"
        >
          C
        </Button>
        <Button size="lg" variant="secondary" onClick={() => press('0')}>
          0
        </Button>
        <Button
          size="lg"
          variant="ghost"
          aria-label={t.nutrition.deleteDigit}
          onClick={() => setValue((current) => current.slice(0, -1))}
          className="text-muted-foreground"
        >
          <Delete size={20} aria-hidden />
        </Button>
      </div>

      <Button
        size="lg"
        block
        className="mt-3"
        disabled={!isValid}
        onClick={() => {
          if (isValid) onSubmit(grams)
        }}
      >
        {t.nutrition.addGrams(grams)}
      </Button>
    </Sheet>
  )
}
