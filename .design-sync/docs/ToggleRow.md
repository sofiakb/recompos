---
category: Primitives
---

# ToggleRow

A full-row switch: the whole row is the label, so the tap target is the width of the card. This is what every setting in RecompOS uses.

```tsx
<ToggleRow
  label="Minuteur de repos"
  description="Démarre automatiquement après chaque série."
  checked={enabled}
  onChange={setEnabled}
/>
```

`onChange` receives the new boolean directly, not an event. `description` is the second, muted line — use it for the consequence of turning the setting on.
