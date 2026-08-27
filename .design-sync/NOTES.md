# design-sync notes — RecompOS

Repo-specific gotchas for future syncs. Read before re-running.

## Setup this repo needs

- **Self-link required.** `recompos` is a private app, not a published package, so
  `node_modules/recompos` doesn't exist and the converter crashes reading its
  `package.json`. Recreate it per clone: `ln -sfn ../ node_modules/recompos`.
- **No dist, no build step.** There is no library build — `npm run build` produces a
  Vite *app* bundle, not an entry with `.d.ts`. The converter runs in synth-entry mode
  (`[NO_DIST]` is expected, not an error). Hence no `buildCmd` in the config.
- **`srcDir` is `src/components`, deliberately.** Pointed at `src` the synth scan pulls
  66 "components" — every PascalCase export in screens/, features/, stores/. Narrowing
  to the components tree yields exactly the 15 real ones.
- **Tailwind must be compiled before every build.** `cfg.cssEntry` needs static CSS, and
  `src/index.css` is `@tailwind` directives. Regenerate first, every time:
  `npx tailwindcss -c .design-sync/tailwind.sync.cjs -i src/index.css -o .design-sync/.cache/recompos.css --minify`
  `tailwind.sync.cjs` widens the repo config's `content` to also scan
  `.design-sync/previews/**/*.tsx`, so utilities used only inside authored previews are
  still generated. Skip this after editing a preview and those classes silently vanish.
- **`virtual:pwa-register/react` is shimmed.** `UpdatePrompt` imports a Vite-only virtual
  module that esbuild cannot resolve. `.design-sync/tsconfig.sync.json` maps it to
  `.design-sync/shims/pwa-register.ts`. That is why `cfg.tsconfig` points at the sync
  tsconfig and not the repo's.
- **Router provider.** `BottomNav`, `ScreenHeader` and `QuickActionFab` use react-router.
  `react-router-dom` is added via `cfg.extraEntries` purely so `cfg.provider.component`
  can be `MemoryRouter`; it is not part of the design system's own API.
- **`src/stores/uiStore.ts` is an extraEntry** so `Toast` previews can seed the Zustand
  store (`Toast` renders `null` with no toast in flight).

## Render check

- Playwright's own chromium is NOT installed and does not need to be. Homebrew's
  `chromium` fails (`Target page, context or browser has been closed`). Use the system
  Chrome instead:
  `DS_CHROMIUM_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"`

## Findings from the first sync (2026-08-27)

- **Fixed in app code: `Button size="icon"` was broken.** `button-variants.ts` uses
  `h-touch w-touch`, but `tailwind.config.js` only defined `minHeight.touch` /
  `minWidth.touch`. Those classes generated nothing and the icon button collapsed to a
  sliver. `height.touch` / `width.touch` were added to the app's own config.
- **`Progress`'s `label` prop is `aria-label` only** — it draws no visible caption. The
  docs say so; do not "fix" a preview that looks captionless. Same for `Segmented`.
- **`Sheet` has no visible close button** — Escape and the backdrop are the only ways out.
- **`Toast` supports exactly ONE preview cell.** It reads the singleton zustand store, so
  two cells side by side both show whichever message was staged last. The store must be
  seeded at MODULE scope, not in the component body: seeding during render is too late —
  `Toast` has already taken its snapshot, and zustand notifying mid-render schedules no
  second pass. `cfg.overrides.Toast.cardMode` is `single` for this reason.
- **The four `position: fixed` components** (`Toast`, `BottomNav`, `QuickActionFab`,
  `UpdatePrompt`) and `Sheet` need a frame with its OWN `transform: translateZ(0)` in
  their preview, or `fixed` resolves against the grid cell and escapes the card. All five
  are `cardMode: single`.
- **`cfg.srcDir` and `cfg.tsconfig` are written as `../../…` deliberately.** Resolved
  through the `node_modules/recompos` symlink, esbuild produced TWO copies of
  `src/stores/uiStore` (entry files get realpath'd, `paths`-resolved imports do not), so
  `window.RecompOS.useUiStore` was a different store from the one `Toast` reads and every
  Toast preview came out blank. Do not "simplify" those paths back to `src/components`.
- **Card sub-parts are excluded from the component list on purpose**
  (`componentSrcMap` nulls). `CardHeader`/`CardTitle`/`CardDescription`/`CardContent`
  still ship in the bundle and are documented inside `Card.prompt.md`; they just get no
  picker card of their own. That was the user's call.
- **The group for `src/components/shared` is `shared`, not "App shell".** The docs carry
  `category: App shell`, but the source directory name wins over frontmatter in the
  converter's group rule. Only `ui/` falls through to the category (it is a generic dir
  name), which is how those became `primitives`. Not worth a lib fork.

## Known render warns

None. The final validate run is completely clean. A warn line on a future re-sync is
genuinely new — look at it before recording it here.

## Re-sync risks

- **`.design-sync/.cache/recompos.css` is generated and gitignored.** Run
  `./.design-sync/build-css.sh` before EVERY build, or `cfg.cssEntry` points at a stale or
  missing file.
- **`.design-sync/tailwind.sync.cjs` carries a hand-written `safelist`** pinning the
  semantic colour palette and the layout scales. Without it the shipped CSS is only what
  `src/` happens to use, and the design agent's own classes (`bg-accent`, `ring-ring`,
  `gap-6`, `grid-cols-2`…) silently resolve to nothing. If the app adds a colour token to
  `tailwind.config.js`, add it to the `COLORS` list too — the safelist does not read it.
- **The conventions header enumerates real class names.** If the palette or the custom
  scales change, re-validate every name in `.design-sync/conventions.md` against
  `ds-bundle/_ds_bundle.css` before uploading.
- **The PWA shim can drift.** `.design-sync/shims/pwa-register.ts` reimplements the shape
  of `useRegisterSW`. If `vite-plugin-pwa` changes that hook's return type, the shim still
  compiles against the old shape and `UpdatePrompt` may render wrong.
- **`react-router-dom` is in `extraEntries` only to supply `MemoryRouter`** as the preview
  provider. Its exports land on `window.RecompOS` alongside the real components — that is
  why the bundle reports 98 exports for 15 components.
- **Only the closed state of `QuickActionFab` is verified.** Its open sheet, and every
  hover/drag state across the system, are interactions a static screenshot cannot reach.
- **Chrome is the render browser** (`DS_CHROMIUM_PATH`, see above), not playwright's own
  chromium. A Chrome major-version bump could change screenshots; grades would then clear
  and need re-confirming.
