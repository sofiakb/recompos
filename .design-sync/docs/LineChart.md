---
category: Charts
---

# LineChart

A small SVG line chart, hand-drawn rather than imported: Recharts would cost roughly 100 kB gzip against a 200 kB budget for the whole shell.

```tsx
<LineChart
  ariaLabel="Poids sur 30 jours"
  points={series.map((e) => ({ label: shortDate(e.date), value: e.weightKg ?? null }))}
  formatValue={(v) => `${v.toFixed(1)} kg`}
/>
```

- `ariaLabel` is required — it is the chart's accessible name.
- A `null` value draws a **gap** rather than interpolating across missing days. Pass `null`, never skip the point.
- `overlay` adds a dashed second series of the same length, for a rolling mean.
- `formatValue` formats the axis ticks; tick precision is otherwise picked automatically so adjacent labels never read identically.

It is drawn on a fixed 320x140 viewBox and scales to its container. Put it inside `CardContent`.
