import { Card, CardContent, ToggleRow } from 'recompos'

export function OnAndOff() {
  return (
    <div className="flex w-full flex-col gap-3">
      <ToggleRow label="Minuteur de repos" checked onChange={() => {}} />
      <ToggleRow label="Rappel de pesée" checked={false} onChange={() => {}} />
    </div>
  )
}

export function WithDescription() {
  return (
    <div className="w-full">
      <ToggleRow
        label="Analyse photo des repas"
        description="Les photos sont envoyées au service de vision, puis supprimées."
        checked
        onChange={() => {}}
      />
    </div>
  )
}

export function InSettingsCard() {
  return (
    <div className="w-full">
      <Card>
        <CardContent className="flex flex-col gap-4 pt-4">
          <ToggleRow
            label="Minuteur de repos"
            description="Démarre automatiquement après chaque série."
            checked
            onChange={() => {}}
          />
          <ToggleRow
            label="Conserver les photos"
            description="Sinon elles sont effacées après analyse."
            checked={false}
            onChange={() => {}}
          />
        </CardContent>
      </Card>
    </div>
  )
}
