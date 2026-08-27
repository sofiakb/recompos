---
category: Primitives
---

# Sheet

The only overlay in RecompOS: a bottom sheet, hand-rolled rather than pulled from Radix. It is `position: fixed` over the whole viewport, animates up from the bottom edge, and renders nothing at all when `open` is false.

```tsx
<Sheet open={open} onClose={() => setOpen(false)} title="Pesée du matin">
  <div className="flex flex-col gap-4">
    <Field label="Poids">{(id) => <Input id={id} type="number" inputMode="decimal" />}</Field>
    <Button block>Enregistrer</Button>
  </div>
</Sheet>
```

- `onClose` is required — Escape and the backdrop are the only ways out, so wire it.
- It locks body scroll while open. There is no visible close button.
- Omit `title` and the header disappears; the content moves up to fill it.
- Actions inside a sheet are `block` buttons, stacked in a `flex flex-col gap-2`.
