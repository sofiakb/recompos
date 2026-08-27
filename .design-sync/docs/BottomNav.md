---
category: App shell
---

# BottomNav

The four-tab bar pinned to the bottom of the app: Aujourd'hui, Séances, Nutrition, Tendances. No props — the tabs and their routes are fixed.

```tsx
<BottomNav />
```

It is `position: fixed` with a safe-area inset and highlights the active route itself, so it goes once in the app shell, not per screen. Needs a react-router context. Leave about 5.5rem of bottom padding on scrolling content so the last row clears it.
