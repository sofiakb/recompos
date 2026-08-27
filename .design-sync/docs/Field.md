---
category: Primitives
---

# Field

Labels a control and wires the two together. `children` is a **render prop**: it receives a generated id to hang on the input, so the label stays associated without you inventing ids.

```tsx
<Field label="Cible protéines" hint="Environ 2 g par kilo de poids cible.">
  {(id) => <Input id={id} type="number" inputMode="numeric" defaultValue="165" />}
</Field>
```

Works with `Input`, `Textarea`, or any control that takes an `id`. Use `hint` for the sentence that would otherwise become a tooltip.
