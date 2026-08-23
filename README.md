# RecompOS

PWA personnelle de recomposition corporelle : plancher d'habitudes non négociable, protéines en un tap,
surcharge progressive. Hors ligne, sans compte, sans serveur — tout reste sur l'appareil.

Le cahier des charges complet est dans [`docs/recompos-pwa-prd.md`](docs/recompos-pwa-prd.md).

## État : V1 complète, jalons 1 à 6 livrés

- **Plancher & consistance** : plancher du jour et habitudes empilées en 1 tap, score élastique sur 7
  et 30 jours, jalon « Jour N », heatmap sur 12 semaines.
- **Habitudes éditables** : créer, renommer, réordonner, archiver et restaurer depuis les Réglages,
  avec l'historique de chacune. Archiver la dernière habitude du plancher est refusé — un plancher vide
  rendrait toute journée invalidable.
- **Poids** : pesée suggérée chaque semaine, moyenne glissante sur 4 points, historique et courbe.
- **Nutrition** : cible dérivée du poids (1,8 g/kg) et ajustable à la main — l'ajustement fige alors la
  cible jusqu'à un retour explicite au calcul automatique. Compteur 1-tap avec annulation. Catalogue
  zéro-cuisson et cheat sheet livraison entièrement éditables, defaults compris. Valider « 1 portion de
  protéines zéro-cuisson » demande laquelle et ajoute ses grammes au total du jour.
- **Séances** : circuit 20 min à trois blocs avec chrono, micro-séries hors séance, mouvements
  personnalisés, suggestions de surcharge progressive, timer de repos (60 s, 90 s ou libre) qui survit
  à un écran verrouillé.
- **Tendances** : index de force hebdomadaire, meilleures séries, tour de taille avec moyenne glissante,
  coffre photos redimensionnées sur l'appareil.
- **Sauvegarde** : export JSON versionné, import avec confirmation explicite avant écrasement.
- Mini-onboarding 3 écrans, PWA installable et hors ligne, bandeau de mise à jour non intrusif.

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
├── components/   ui/ primitives, charts/ courbes SVG, shared/ nav, header, FAB, toast
├── features/     un dossier par module métier
├── db/           schéma Dexie, données de seed, repositories
├── stores/       Zustand (settings persistés, état UI éphémère)
├── lib/          logique pure : dates, consistance, surcharge, index de force, sauvegarde
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

### Les décisions qui expliquent le plus de code

- **La journée bascule à 04h00**, pas à minuit : un shaker logué à 1h du matin appartient à la soirée
  qui précède. `DAY_ROLLOVER_HOUR` dans `src/lib/date.ts` est la seule source de vérité.
- **La consistance n'est pas une série** : c'est un pourcentage glissant dont le dénominateur est borné
  par le nombre de jours depuis l'installation. Rien ne se remet jamais à zéro.
- **La cible de protéines suit le poids, sauf si tu la touches** : `auto` recalcule à chaque pesée,
  `manual` fige le nombre que tu as choisi. L'app ne déplace jamais une valeur que tu as posée.
- **Les durées se calculent depuis un timestamp de départ**, jamais en accumulant des ticks : un écran
  verrouillé étrangle `setInterval`, et un timer de repos qui perd 20 secondes est pire que pas de timer.
- **Semer les catalogues n'est pas « la table est vide »** : c'est un drapeau dans les réglages
  (`catalogsSeededAt`). Sans lui, supprimer ses sept sources zéro-cuisson les rendrait toutes au
  lancement suivant, et restaurer une sauvegarde ferait réapparaître des entrées supprimées exprès.
- **Les graphiques sont du SVG écrit à la main** (`components/charts/LineChart.tsx`) : trois courbes de
  ligne ne justifient pas ~100 Ko gzip de bibliothèque. Le PRD §5 documente cet écart.

## Déploiement

Chaque push sur `main` déclenche `.github/workflows/deploy.yml` : typecheck, tests, build, publication
sur GitHub Pages. Il faut activer Pages une fois dans **Settings → Pages → Source: GitHub Actions**.

Le site est servi depuis `/recompos/`. Ce chemin apparaît à trois endroits qui doivent rester cohérents :
`base` dans `vite.config.ts`, `start_url` et `scope` du manifeste. Un fork sous un autre nom de dépôt
doit les changer tous les trois.

## Vie privée

Aucune requête réseau au runtime, aucun compte, aucune télémétrie. Les données ne quittent jamais
l'appareil — ce qui veut aussi dire qu'elles disparaissent si le stockage du navigateur est vidé.

**Réglages → Exporter mes données** écrit un JSON versionné contenant tout : réglages, habitudes,
historique, séries, mesures et photos en base64. Au-delà de 5 Mo de photos, elles partent dans un
second fichier. L'import accepte l'un, l'autre, ou les deux à la fois, et demande une confirmation
explicite avant d'écraser — il remplace, il ne fusionne pas.
