import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/input'
import { t } from '@/i18n/fr'

/** Short on purpose (spec coach §5.4): a question, not a journal entry. */
export const MAX_QUESTION_LENGTH = 280

interface CoachInputProps {
  disabled: boolean
  onSend: (text: string) => void
}

export function CoachInput({ disabled, onSend }: Readonly<CoachInputProps>) {
  const [text, setText] = useState('')
  const empty = text.trim().length === 0

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={(event) => {
        event.preventDefault()
        if (empty || disabled) return
        onSend(text.trim())
        setText('')
      }}
    >
      <Textarea
        aria-label={t.coach.inputLabel}
        placeholder={t.coach.inputPlaceholder}
        maxLength={MAX_QUESTION_LENGTH}
        value={text}
        disabled={disabled}
        onChange={(event) => setText(event.target.value)}
      />
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-muted-foreground">
          {t.coach.charCount(text.length, MAX_QUESTION_LENGTH)}
        </span>
        <Button type="submit" disabled={disabled || empty}>
          {t.coach.send}
        </Button>
      </div>
    </form>
  )
}
