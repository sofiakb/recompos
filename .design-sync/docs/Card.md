---
category: Primitives
---

# Card

The container every screen is built from: a bordered `bg-card` panel. Compose it with `CardHeader`, `CardTitle`, `CardDescription` and `CardContent`, all exported from the same bundle.

```tsx
<Card>
  <CardHeader>
    <CardTitle>Protéines du jour</CardTitle>
    <CardDescription>Objectif calculé à partir de ton poids cible.</CardDescription>
  </CardHeader>
  <CardContent>
    <p className="tnum text-3xl font-semibold">128 g</p>
  </CardContent>
</Card>
```

- `CardHeader` already spaces the title and description; do not add your own gap.
- `CardContent` carries the padding, so put raw content straight inside it.
- Screens stack cards in a `flex flex-col gap-3 px-4` column.
