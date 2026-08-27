---
category: App shell
---

# UpdatePrompt

The banner shown when a new service worker is waiting. Renders nothing when no update is pending, so it is mounted unconditionally in the app shell.

```tsx
<UpdatePrompt />
```

It never reloads on its own — that would throw away whatever the user was typing. The choice is always the user's: "Plus tard" or "Recharger".
