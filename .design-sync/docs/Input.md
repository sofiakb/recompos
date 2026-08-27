---
category: Primitives
---

# Input

A single-line text input at the 48px minimum touch height. Takes every native `<input>` attribute.

```tsx
<Input placeholder="Nom du repas" />
<Input type="number" inputMode="decimal" defaultValue="78.4" />
```

Set `inputMode` on numeric fields (`decimal` for weights, `numeric` for whole grams and calories) — it decides which keypad a phone shows. Pair with `Field` rather than writing your own `<label>`.
