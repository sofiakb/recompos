---
category: App shell
---

# QuickActionFab

The floating "+" button above the bottom nav, and the sheet it opens: validate the daily floor, add protein, log a set, log a weigh-in. No props — it reads and writes app state directly.

```tsx
<QuickActionFab />
```

It hides itself on `/settings` (a place to configure, not to log). Goes once in the app shell, alongside `BottomNav`. Needs a react-router context.
