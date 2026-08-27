---
category: App shell
---

# ScreenHeader

The title block at the top of a screen. Already carries the iOS safe-area inset, so it must be the first thing in the scroll container.

```tsx
<ScreenHeader title="Tendances" subtitle="30 derniers jours" showSettings />
```

`showSettings` adds the link to the settings screen — it belongs on the primary tabs only. Needs a react-router context.
