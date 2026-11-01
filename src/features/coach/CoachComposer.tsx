import { useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { TapTarget } from '@/components/ui/tap-target'
import { Textarea } from '@/components/ui/input'
import type { QuickPrompt } from '@/lib/coach/personas'
import { cn } from '@/lib/utils'
import { t } from '@/i18n/fr'

/** Short on purpose (spec coach §5.4): a question, not a journal entry. */
export const MAX_QUESTION_LENGTH = 280

interface CoachComposerProps {
  prompts: QuickPrompt[]
  /** Quick prompts always need the model; free text can still reach the distress guard. */
  promptsDisabled: boolean
  disabled: boolean
  onSend: (text: string, prompt?: QuickPrompt) => void
}

/**
 * The bottom of the chat: suggestions one swipe wide, then the field and its
 * send button. Pinned above the tab bar, where a thumb already is.
 */
export function CoachComposer({
  prompts,
  promptsDisabled,
  disabled,
  onSend,
}: Readonly<CoachComposerProps>) {
  const [text, setText] = useState('')
  const empty = text.trim().length === 0

  const submit = () => {
    if (empty || disabled) return
    onSend(text.trim())
    setText('')
  }

  return (
    <div className="fixed inset-x-0 bottom-[var(--nav-clearance)] z-30 mx-auto max-w-md px-3">
      <div className="flex flex-col gap-2 rounded-2xl border border-border/70 bg-background/85 p-2 shadow-xl backdrop-blur-xl">
        <div className="-mx-2 flex gap-2 overflow-x-auto px-2 pb-0.5 [scrollbar-width:none]">
          {prompts.map((prompt) => (
            <TapTarget
              key={prompt.id}
              disabled={promptsDisabled || disabled}
              onClick={() => onSend(prompt.question, prompt)}
              className="min-h-touch shrink-0 whitespace-nowrap rounded-full border border-border/70 px-4 text-sm font-medium transition-opacity hover:bg-accent disabled:opacity-40"
            >
              {prompt.question}
            </TapTarget>
          ))}
        </div>
        <form
          className="flex items-end gap-2"
          onSubmit={(event) => {
            event.preventDefault()
            submit()
          }}
        >
          <Textarea
            aria-label={t.coach.inputLabel}
            placeholder={t.coach.inputPlaceholder}
            maxLength={MAX_QUESTION_LENGTH}
            rows={1}
            value={text}
            disabled={disabled}
            onChange={(event) => setText(event.target.value)}
            onKeyDown={(event) => {
              // Enter sends, Shift+Enter breaks the line — what every chat does.
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault()
                submit()
              }
            }}
            className="max-h-32 min-h-touch flex-1 overflow-y-auto py-3"
          />
          <TapTarget
            type="submit"
            aria-label={t.coach.send}
            disabled={disabled || empty}
            className={cn(
              'lit-accent flex h-touch w-touch shrink-0 items-center justify-center rounded-full text-primary-foreground transition-opacity disabled:opacity-40',
            )}
          >
            <ArrowUp size={22} aria-hidden />
          </TapTarget>
        </form>
      </div>
    </div>
  )
}
