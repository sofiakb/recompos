import { Button } from '@/components/ui/button'
import type { QuickPrompt } from '@/lib/coach/personas'

interface QuickPromptsProps {
  prompts: QuickPrompt[]
  disabled: boolean
  onPick: (prompt: QuickPrompt) => void
}

/** The four questions that cover most evenings, one tap each. */
export function QuickPrompts({ prompts, disabled, onPick }: Readonly<QuickPromptsProps>) {
  return (
    <div className="flex flex-wrap gap-2">
      {prompts.map((prompt) => (
        <Button
          key={prompt.id}
          variant="secondary"
          className="rounded-full text-sm"
          disabled={disabled}
          onClick={() => onPick(prompt)}
        >
          {prompt.question}
        </Button>
      ))}
    </div>
  )
}
