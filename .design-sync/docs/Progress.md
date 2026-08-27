---
category: Primitives
---

# Progress

A thin horizontal bar for "x of y" — protein against target, sets against a weekly plan. The value is clamped into `0..max`, so out-of-range numbers are safe.

```tsx
<Progress value={128} max={165} label="Protéines" />
<Progress value={62} />
```

- `label` is the **accessible name** (`aria-label`), not visible text. The bar draws no caption — if you need a visible one, write it yourself above the bar.
- `max` defaults to 100, so a bare percentage needs only `value`.
- The bar is 8px tall and fills its container's width. Inside a `Card`, put it in `CardContent`.
