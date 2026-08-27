## Building with RecompOS

RecompOS is a French-language, mobile-first PWA for body-recomposition tracking. Two things decide whether what you build looks like it belongs.

### 1. It is dark-only, and there is no theme provider

There is exactly one theme. `styles.css` defines the palette on `:root` and paints `body`; nothing needs wrapping for components to be styled. Do **not** add a light mode, a `dark:` variant, or a theme toggle — no light palette exists, and `dark:` classes are not compiled.

The one wrapper that is required: **`MemoryRouter`** (or any react-router router, exported from the bundle) around anything using `BottomNav`, `ScreenHeader` or `QuickActionFab`. Without it they throw.

```tsx
const { MemoryRouter, ScreenHeader, Card, CardHeader, CardTitle, CardContent } = window.RecompOS

<MemoryRouter>
  <div className="min-h-screen bg-background text-foreground">
    <ScreenHeader title="Aujourd’hui" subtitle="Jeudi 27 août" showSettings />
    <div className="flex flex-col gap-3 px-4 pb-24">
      <Card>
        <CardHeader><CardTitle>Protéines du jour</CardTitle></CardHeader>
        <CardContent>
          <p className="tnum text-3xl font-semibold">
            128 <span className="text-base font-normal text-muted-foreground">/ 165 g</span>
          </p>
        </CardContent>
      </Card>
    </div>
  </div>
</MemoryRouter>
```

### 2. Style with Tailwind, using the semantic palette — never raw colours

Layout glue is ordinary Tailwind (`flex`, `gap-3`, `px-4`, `text-sm`). Colour is **only ever** one of these names. Never write `bg-zinc-900`, `text-white`, `bg-[#a3e635]` or any hex — they are not in the compiled stylesheet and will not resolve.

| Family | Names | Use for |
|---|---|---|
| Surface | `bg-background`, `bg-card`, `bg-muted`, `bg-accent` | page, panel, inset track, hover fill |
| Text | `text-foreground`, `text-card-foreground`, `text-muted-foreground` | body copy, on-card copy, secondary copy |
| Brand | `bg-primary`, `text-primary`, `text-primary-foreground` | the lime accent — one primary action per screen |
| Danger | `bg-destructive`, `text-destructive-foreground` | deletions |
| Line | `border-border`, `border-input`, `ring-ring` | borders, field borders, focus rings |

Each name works with every property prefix (`bg-`, `text-`, `border-`, `ring-`, `fill-`, `stroke-`, `shadow-`) and with `hover:` / `focus-visible:` / `active:` / `disabled:`.

Also RecompOS's own: `rounded-lg` (14px, the card/button radius), `min-h-touch` / `h-touch` / `w-touch` (48px — every tappable target), `pb-safe-b` / `pt-safe-t` (iOS insets), `animate-slide-up`, `animate-pop-in`, and **`tnum`** (tabular figures — put it on every number that changes, so dashboards do not jitter).

### 3. House rules

- **French UI copy.** Every label, button and message. Use a narrow no-break space before `:` `?` `!` and in numbers (`2 140 kcal`).
- **48px minimum touch target.** `Button` already guarantees it; anything tappable you build yourself needs `min-h-touch`.
- **One screen = a `ScreenHeader` then a `flex flex-col gap-3 px-4` column of `Card`s.** Leave `pb-24` so content clears the bottom nav.
- `Sheet` is the only overlay — no modals, popovers or dropdowns exist. `Toast` and `UpdatePrompt` are singletons that go once in the shell, never per screen.

### 4. Where the truth is

- `_ds/<folder>/styles.css` and its `@import` closure — the real compiled palette and every class that exists.
- `components/<group>/<Name>/<Name>.prompt.md` — per-component usage, with the props that matter and the gotchas.
- `components/<group>/<Name>/<Name>.d.ts` — the exact prop contract.

`Card` ships four sub-parts (`CardHeader`, `CardTitle`, `CardDescription`, `CardContent`) that are importable from the bundle but have no card of their own — read `Card.prompt.md` for how they compose.
