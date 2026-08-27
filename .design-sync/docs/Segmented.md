---
category: Primitives
---

# Segmented

A row of exclusive choices that looks like buttons but is a real radio group — arrow keys move between options.

```tsx
<Segmented
  label="Période"
  value={range}
  options={[
    { value: "7j", label: "7 j" },
    { value: "30j", label: "30 j" },
    { value: "90j", label: "90 j" },
  ]}
  onChange={setRange}
/>
```

`label` is the group's accessible name and is required. Keep it to 2–4 short options — it is a full-width row on a phone. For anything longer, use a `Sheet` with a list.
