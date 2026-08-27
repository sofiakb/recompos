import { Progress } from 'recompos'

/**
 * `label` is the accessible name only — the bar draws no caption of its own, so
 * every cell that needs visible text writes it, which is also how the app's
 * screens use it.
 */
export function WithCaption() {
  return (
    <div className="flex w-full flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <span className="text-sm text-muted-foreground">Protéines</span>
        <span className="tnum text-sm font-medium">128 / 165 g</span>
      </div>
      <Progress value={128} max={165} label="Protéines" />
    </div>
  )
}

export function States() {
  return (
    <div className="flex w-full flex-col gap-4">
      <Progress value={0} max={165} label="Rien de consigné" />
      <Progress value={82} max={165} label="À mi-chemin" />
      <Progress value={165} max={165} label="Objectif atteint" />
    </div>
  )
}

export function Bare() {
  return (
    <div className="w-full">
      <Progress value={62} />
    </div>
  )
}
