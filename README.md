# RecompOS

PWA personnelle de recomposition corporelle : plancher d'habitudes non négociable, protéines en un tap,
surcharge progressive. Hors ligne, sans compte, sans serveur — tout reste sur l'appareil.

Le cahier des charges complet est dans [`docs/recompos-pwa-prd.md`](docs/recompos-pwa-prd.md).

## État : lot 0 (squelette navigable)

Livré :

- Les 4 onglets routés — Aujourd'hui, Séances, Nutrition, Tendances — plus l'écran Réglages.
- Le plancher du jour et les habitudes empilées : validation en 1 tap, persistée.
- Le score de consistance élastique sur 7 et 30 jours, et le jalon « Jour N ».
- Mini-onboarding 3 écrans, affiché une seule fois.
- PWA installable, fonctionnelle hors ligne, avec bandeau de mise à jour non intrusif.
- Base Dexie créée et pré-remplie (exercices, cheat sheet livraison, catalogue zéro-cuisson).

À venir, un lot à la fois : compteur de protéines (lot 2), tracker de séances et surcharge progressive
(lot 3), tendances, photos et export/import (lot 4).

## Démarrer

```bash
npm ci
npm run dev
```

L'app tourne sur http://localhost:5173/recompos/ — le chemin `/recompos/` est le `base` de production
(GitHub Pages) et vaut aussi en développement.

## Scripts

| Commande            | Rôle                                                     |
| ------------------- | -------------------------------------------------------- |
| `npm run dev`       | Serveur de développement                                 |
| `npm run build`     | Typecheck puis build de production                       |
| `npm run preview`   | Sert le build — nécessaire pour tester le service worker |
| `npm test`          | Tests Vitest                                             |
| `npm run lint`      | ESLint, zéro warning toléré                              |
| `npm run typecheck` | `tsc --noEmit`                                           |
| `npm run format`    | Prettier                                                 |

Le service worker n'est pas actif en `dev` : pour vérifier le comportement hors ligne, lancer
`npm run build && npm run preview`, puis couper le réseau et recharger.

## Installer sur le téléphone

- **iOS / Safari** : Partager → « Sur l'écran d'accueil ». L'installation est ce qui protège la base
  IndexedDB de l'éviction automatique après une période sans usage.
- **Android / Chrome** : la bannière d'installation apparaît, ou Menu → « Installer l'application ».

## Architecture

```text
src/
├── app/          Router (hash), layout, montage de l'app
├── components/   ui/ primitives, shared/ nav, header, FAB, toast
├── features/     un dossier par module métier
├── db/           schéma Dexie, données de seed, repositories
├── stores/       Zustand (settings persistés, état UI éphémère)
├── lib/          logique pure : dates, consistance, utilitaires
├── i18n/         toutes les chaînes visibles par l'utilisateur
└── types/        modèle de données
```

Trois règles structurantes :

- **Aucun composant n'appelle Dexie directement** — il passe par un repository, ce qui rend la logique
  testable sans DOM.
- **Aucun texte en dur dans un composant** — tout vient de `src/i18n/fr.ts`, pour rendre l'ajout de
  l'anglais mécanique.
- **`src/lib/` ne dépend ni de React ni de Dexie** — c'est là que vivent les règles qui méritent des
  tests unitaires.

### Le stockage est volontairement coupé en deux

`localStorage` (via Zustand `persist`) porte ce qui est petit, lu à chaque rendu et nécessaire dès la
première frame : réglages, définitions d'habitudes, préférences. IndexedDB (via Dexie) porte ce qui
grossit sans limite ou se requête par plage de dates : logs quotidiens, protéines, séances, séries,
mesures, photos.

### Deux détails qui expliquent beaucoup de code

- **La journée bascule à 04h00**, pas à minuit : un shaker logué à 1h du matin appartient à la soirée
  qui précède. `DAY_ROLLOVER_HOUR` dans `src/lib/date.ts` est la seule source de vérité.
- **La consistance n'est pas une série** : c'est un pourcentage glissant dont le dénominateur est borné
  par le nombre de jours depuis l'installation. Rien ne se remet jamais à zéro.

## Déploiement

Chaque push sur `main` déclenche `.github/workflows/deploy.yml` : typecheck, tests, build, publication
sur GitHub Pages. Il faut activer Pages une fois dans **Settings → Pages → Source: GitHub Actions**.

Le site est servi depuis `/recompos/`. Ce chemin apparaît à trois endroits qui doivent rester cohérents :
`base` dans `vite.config.ts`, `start_url` et `scope` du manifeste. Un fork sous un autre nom de dépôt
doit les changer tous les trois.

## Vie privée

Aucune requête réseau au runtime, aucun compte, aucune télémétrie. Les données ne quittent jamais
l'appareil — ce qui veut aussi dire qu'elles disparaissent si le stockage du navigateur est vidé.
L'export manuel arrive au lot 4.
