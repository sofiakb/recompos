import { Button } from 'recompos'

export function Variants() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="primary">Enregistrer</Button>
      <Button variant="secondary">Modifier</Button>
      <Button variant="outline">Annuler</Button>
      <Button variant="ghost">Plus tard</Button>
      <Button variant="destructive">Supprimer</Button>
    </div>
  )
}

export function Sizes() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button size="default">Peser</Button>
      <Button size="lg">Ajouter un repas</Button>
      <Button size="icon" aria-label="Ajouter">
        +
      </Button>
    </div>
  )
}

export function FullWidth() {
  return (
    <div className="flex w-full flex-col gap-2">
      <Button block>Valider la pesée</Button>
      <Button block variant="outline">
        Passer
      </Button>
    </div>
  )
}

export function Disabled() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button disabled>Enregistrer</Button>
      <Button variant="outline" disabled>
        Annuler
      </Button>
      <Button variant="destructive" disabled>
        Supprimer
      </Button>
    </div>
  )
}
