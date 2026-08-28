import { useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/input'
import { Sheet } from '@/components/ui/sheet'
import { t } from '@/i18n/fr'

interface DescribeMealSheetProps {
  open: boolean
  onClose: () => void
  onSubmit: (description: string) => void
  /** True while the analysis is in flight. */
  pending: boolean
}

/**
 * A meal told rather than photographed.
 *
 * The one thing this screen has to get right is that the person is not filling a
 * form: they are saying what they ate. So it is one free-text box, and the
 * prompt behind it — not the field — carries the demand for quantities.
 */
export function DescribeMealSheet({ open, onClose, onSubmit, pending }: DescribeMealSheetProps) {
  const [text, setText] = useState('')

  useEffect(() => {
    if (open) setText('')
  }, [open])

  return (
    <Sheet open={open} onClose={onClose} title={t.meals.describeTitle}>
      <div className="flex flex-col gap-3">
        <p className="text-sm text-muted-foreground">{t.meals.describeHint}</p>
        <Textarea
          aria-label={t.meals.describeTitle}
          value={text}
          placeholder={t.meals.describePlaceholder}
          className="min-h-[120px]"
          onChange={(event) => setText(event.target.value)}
        />
        <Button
          size="lg"
          block
          disabled={!text.trim() || pending}
          onClick={() => onSubmit(text.trim())}
        >
          <Sparkles size={16} aria-hidden />
          {pending ? t.meals.analysing : t.meals.describeSubmit}
        </Button>
      </div>
    </Sheet>
  )
}
