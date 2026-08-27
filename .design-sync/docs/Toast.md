---
category: App shell
---

# Toast

The single toast host. It renders whatever is in the ui store, or nothing at all, so it is mounted once in the app shell and never rendered per screen.

```tsx
<Toast />                                  // once, in the shell

const showToast = useUiStore((s) => s.showToast)
showToast("Pesée enregistrée : 78,4 kg")
showToast("Repas supprimé", { label: "Annuler", run: undo }, UNDO_TOAST_MS)
```

The optional action turns it into an undo toast; `UNDO_TOAST_MS` (10 s) is the duration that keeps undo reachable one-handed. It sits above the bottom nav and dismisses itself on a timer.
