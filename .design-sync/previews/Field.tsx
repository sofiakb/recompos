import { Field, Input, Textarea } from 'recompos'

export function WithInput() {
  return (
    <div className="w-full">
      <Field label="Poids du matin">
        {(id) => <Input id={id} type="number" inputMode="decimal" defaultValue="78.4" />}
      </Field>
    </div>
  )
}

export function WithHint() {
  return (
    <div className="w-full">
      <Field label="Cible protéines" hint="Environ 2 g par kilo de poids cible.">
        {(id) => <Input id={id} type="number" inputMode="numeric" defaultValue="165" />}
      </Field>
    </div>
  )
}

export function WithTextarea() {
  return (
    <div className="w-full">
      <Field label="Note de séance" hint="Facultatif.">
        {(id) => <Textarea id={id} rows={3} placeholder="Développé couché lourd, dos fatigué." />}
      </Field>
    </div>
  )
}
