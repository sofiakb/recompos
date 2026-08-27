import { Input } from 'recompos'

export function Default() {
  return (
    <div className="w-full">
      <Input placeholder="Nom du repas" />
    </div>
  )
}

export function Filled() {
  return (
    <div className="w-full">
      <Input defaultValue="Poulet, riz, brocolis" />
    </div>
  )
}

export function Numeric() {
  return (
    <div className="flex w-full flex-col gap-2">
      <Input type="number" inputMode="decimal" defaultValue="78.4" />
      <Input type="number" inputMode="numeric" placeholder="Calories" />
    </div>
  )
}

export function Disabled() {
  return (
    <div className="w-full">
      <Input defaultValue="Synchronisé automatiquement" disabled />
    </div>
  )
}
