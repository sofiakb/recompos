---
category: Primitives
---

# Button

The one button in RecompOS. Every tappable target is at least 48px tall (`size="default"`), because the app is used one-handed on a phone.

```tsx
<Button onClick={save}>Enregistrer</Button>
<Button variant="secondary">Modifier</Button>
<Button variant="destructive">Supprimer</Button>
<Button block size="lg">Valider la pesée</Button>
<Button size="icon" aria-label="Ajouter"><Plus size={26} aria-hidden /></Button>
```

- `variant` carries the meaning: `primary` for the one action a screen is for, `secondary`/`outline` for the rest, `ghost` for dismissals, `destructive` for deletions.
- `block` is how a button fills a sheet or a form; do not reach for `w-full` yourself.
- `type` defaults to `"button"` — pass `type="submit"` explicitly inside a form.
