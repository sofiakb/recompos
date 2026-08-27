import { Button, Field, Input, Sheet } from 'recompos'

/**
 * The sheet is `position: fixed` over the whole screen. Each cell frames it in a
 * phone-shaped box whose own transform is the containing block, so the card
 * shows the sheet resting over a screen instead of covering the whole page.
 */
function Screen({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative h-[300px] w-full overflow-hidden rounded-lg border border-border bg-background"
      style={{ transform: 'translateZ(0)' }}
    >
      {children}
    </div>
  )
}

export function WeighIn() {
  return (
    <Screen>
      <Sheet open onClose={() => {}} title="Pesée du matin">
        <div className="flex flex-col gap-4">
          <Field label="Poids" hint="À jeun, juste après le réveil.">
            {(id) => <Input id={id} type="number" inputMode="decimal" defaultValue="78.4" />}
          </Field>
          <Button block>Enregistrer</Button>
        </div>
      </Sheet>
    </Screen>
  )
}

export function QuickActions() {
  return (
    <Screen>
      <Sheet open onClose={() => {}} title="Ajouter">
        <div className="flex flex-col gap-2">
          <Button block variant="secondary">
            Un repas
          </Button>
          <Button block variant="secondary">
            Une série
          </Button>
          <Button block variant="secondary">
            Une pesée
          </Button>
        </div>
      </Sheet>
    </Screen>
  )
}

export function Untitled() {
  return (
    <Screen>
      <Sheet open onClose={() => {}}>
        <p className="text-sm text-muted-foreground">
          Une feuille sans titre : l’en-tête disparaît et le contenu remonte.
        </p>
      </Sheet>
    </Screen>
  )
}
