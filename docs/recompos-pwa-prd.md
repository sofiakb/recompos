# PRD — RecompOS

**PWA anti-burnout de recomposition corporelle (zéro motivation, friction minimale)**

| | |
|---|---|
| Version | 1.5 — V1 complète, écarts refermés |
| Date | 2026-08-23 |
| Statut | Jalons 1 à 6 livrés |
| Remplace | v1.4 (V1 complète), v1.3 (plan recalé), v1.2 (poids et cible dérivée), v1.1 (cadrage), v1.0 (brouillon) |

---

## 1. Vision

**RecompOS** est une PWA personnelle, mono-utilisateur, installable et hors ligne, conçue pour un
professionnel occupé, sédentaire, avec charge familiale, et sujet aux cycles sprint/burnout de 1 à 3 mois.

L'application ne cherche pas à motiver. Elle cherche à **rendre l'action par défaut plus facile que
l'inaction**, et à **survivre aux trous** — une semaine ratée ne remet aucun compteur à zéro.

**Proposition de valeur** : construire du muscle et perdre du gras durablement, via un plancher
d'habitudes non négociable, un suivi de surcharge progressive et un compteur de protéines, chacun
actionnable en moins de 3 taps, sans deadline, sans culpabilisation, sans cloud.

---

## 2. Décisions de cadrage

Les dix arbitrages ci-dessous sont **verrouillés**. Toute remise en question est un changement de PRD, pas
une décision d'implémentation.

| # | Sujet | Décision | Conséquence principale |
|---|---|---|---|
| 1 | Périmètre V1 | Squelette navigable d'abord, puis itération module par module | Jalon 1 = 4 écrans + navigation + design system + PWA offline avec logique minimale |
| 2 | Stack UI | Tailwind CSS + shadcn/ui | Abandon de Gluestack UI v2 et de la compatibilité React Native. Web pur, bundle léger |
| 3 | Persistance | Zustand `persist` (localStorage) + Dexie/IndexedDB | localStorage pour réglages et état courant, IndexedDB pour historiques et photos |
| 4 | Langue | Français d'abord, i18n-ready | Tous les textes dans un module de constantes ; code et identifiants en anglais |
| 5 | Sauvegarde | Export/import JSON manuel | Zéro backend. Bouton export (JSON + photos) et import dans les réglages |
| 6 | Rappels | Aucune notification | Ni push, ni notification locale. L'ouverture de l'app est le seul déclencheur |
| 7 | Photos | Octets locaux + compression WebP côté client | Jamais de sortie de l'appareil. Pas de chiffrement, pas de code PIN en V1. Stockées en `ArrayBuffer` et non en `Blob` (voir §8) |
| 8 | Onboarding | Mini-onboarding 3 écrans | ~30 secondes au premier lancement, jamais réaffiché |
| 9 | Graphiques | SVG maison (~2 Ko), Recharts écarté | Décision révisée au jalon 6 : trois courbes ne justifient pas ~100 Ko gzip. Réversible — Recharts reste le plan B si un graphique interactif devient nécessaire |
| 10 | Livraison | GitHub Pages + Actions, Vitest + Testing Library, lint et typecheck en CI | Déploiement auto sur push `main`, base path Vite à configurer |
| 11 | Cible de protéines | Dérivée du poids : 1,8 g/kg, arrondi à 5 g | La cible n'est plus un nombre à inventer ; elle suit le corps |
| 12 | Override manuel | Toute modification à la main fige la cible | Une nouvelle pesée ne réécrit jamais un chiffre choisi par l'utilisateur ; retour à l'auto en un tap |
| 13 | Suivi du poids | Pesée hebdomadaire suggérée, moyenne glissante sur 4 points | L'app n'affiche jamais la pesée brute comme un résultat |
| 14 | Plancher nutrition | « 1 portion de protéines zéro-cuisson », choisie dans le catalogue | Le plancher apporte de vrais grammes au total du jour, au prix d'un tap de plus |

---

## 3. Principes produit

1. **Zéro friction de saisie** — toute action cœur (protéine, habitude plancher, série de 5 reps) se
   complète en moins de 3 taps depuis le dashboard, sans navigation intermédiaire.
2. **Système plutôt que motivation** — pas de honte, pas de série cassée, pas de reset punitif.
   Consistance élastique en pourcentage glissant.
3. **Recomposition plutôt que poids sur la balance** — les métriques primaires sont les PR de force,
   l'adhérence au plancher, le tour de taille et les photos. Jamais le poids seul.
4. **Hors ligne d'abord, installable** — fonctionne en avion, sur iOS et Android, sans compte,
   sans réseau, sans serveur.
5. **Pas de deadline** — aucun compte à rebours vers une date. Uniquement des jalons cumulatifs
   (« Jour 90 de consistance »).
6. **Sobriété visuelle** — dark mode par défaut, une action évidente par écran, aucun élément décoratif
   qui n'informe pas.

---

## 4. Stack technique

| Couche | Choix | Notes |
|---|---|---|
| Build | Vite 5 + TypeScript 5 (strict) | `base` à configurer pour GitHub Pages |
| Framework | React 18 | Function components, hooks uniquement |
| Routage | React Router 6, `HashRouter` | Le hash évite les 404 sur les liens profonds GitHub Pages, au prix d'URLs moins propres |
| UI | Tailwind CSS 3 + shadcn/ui | Composants copiés dans `src/components/ui`, pas de dépendance runtime |
| Icônes | Lucide React | Import nommé uniquement, pour préserver le tree-shaking |
| État | Zustand 4 + middleware `persist` | Un store par domaine, pas de store global monolithique |
| Base locale | Dexie 4 (IndexedDB) | Historiques, séances, mesures, photos |
| Graphiques | SVG écrit à la main | `components/charts/LineChart.tsx`, ~120 lignes, aucune dépendance |
| PWA | `vite-plugin-pwa` (Workbox) | `registerType: 'autoUpdate'`, precache de l'app shell |
| Tests | Vitest + Testing Library + jsdom | Logique métier couverte en priorité |
| Qualité | ESLint, Prettier, `tsc --noEmit` | Bloquants en CI |
| CI/CD | GitHub Actions → GitHub Pages | Déploiement sur push `main` |

**Contraintes de bundle** : app shell sous 200 Ko gzip, vérifié à chaque build. Aucun découpage en
chunks n'a été nécessaire : au jalon 6, l'app complète pèse ~145 Ko gzip.

---

## 5. Découpage en jalons

Le découpage initial en « lots 0 à 4 » a dérivé dès le premier retour utilisateur : le suivi du poids
n'était prévu nulle part, et il a fallu entamer la nutrition pour que la cible de protéines serve à
quelque chose. Plutôt que de conserver une numérotation qui ne décrit plus le dépôt, le plan est
recalé ici sur ce qui est réellement livré, et réordonné par utilité quotidienne.

### Livré

**Jalon 1 — Squelette navigable**
Projet Vite + React + TS, Tailwind et primitives shadcn maison, 4 écrans routés plus Réglages, base
Dexie et stores Zustand, types complets, données de seed, PWA installable et hors ligne, mini-onboarding
3 écrans, déploiement GitHub Pages automatique.

**Jalon 2 — Plancher & consistance**
Plancher du jour et habitudes empilées validables en 1 tap, `floorCompleted` dérivé des complétions,
score de consistance élastique 7 et 30 jours, jalon cumulatif « Jour N ».

**Jalon 3 — Poids & nutrition**
Suivi du poids (pesée hebdomadaire suggérée, moyenne glissante, historique), cible de protéines dérivée
du poids avec override figé, plancher nutrition en portion réelle, compteur de protéines complet
(anneau, ajout rapide, montant libre, annulation), catalogue zéro-cuisson avec inventaire, cheat sheet
livraison filtrable.

**Jalon 4 — Habitudes éditables**
Création, renommage, réordonnancement et archivage d'une habitude depuis les Réglages, restauration
d'une habitude archivée, historique par habitude, heatmap de consistance sur 12 semaines. Archiver la
dernière habitude du plancher est refusé : un plancher vide rendrait toute journée invalidable.

**Jalon 5 — Séances**
Circuit 20 min à trois blocs avec chrono de séance et mouvement interchangeable par bloc, micro-séries
hors séance depuis l'action rapide, suggestions de surcharge progressive, timer de repos dérivé d'un
timestamp. Une séance close sans aucune série est supprimée plutôt qu'archivée à vide.

**Jalon 6 — Tendances & sauvegarde**
Index de force hebdomadaire base 100 sur 12 / 26 / 52 semaines, meilleures séries par mouvement, tour
de taille avec moyenne glissante, coffre photos WebP redimensionnées sur l'appareil avec comparaison
première/dernière, courbes SVG maison, export JSON versionné et import avec confirmation explicite
avant écrasement.

Chaque jalon est autonome, testé, déployé, et utilisable seul. Aucun jalon n'a cassé le précédent.

**Reprise post-jalon 6.** Une relecture du dépôt contre le §6 a trouvé trois promesses que le code
portait sans les exposer — les fonctions existaient et étaient testées, mais aucune UI ne les appelait :

- Les catalogues zéro-cuisson et livraison sont maintenant réellement éditables (ajout, modification,
  suppression), comme le §6.2 le demandait. L'édition est derrière un bouton « Gérer la liste » : la
  ligne est tapée plusieurs fois par jour pour logguer et deux fois par mois pour éditer, et mettre les
  deux dedans chasserait l'action fréquente.
- Un mouvement personnalisé peut être créé depuis le sélecteur d'exercice, et supprimé tant qu'aucune
  série ne le référence — sinon l'historique afficherait un identifiant brut pour toujours.
- Le timer de repos accepte une durée libre entre 15 s et 600 s, en plus des deux presets (§6.3).
- Le plancher se replie une fois validé (§6.1), avec réouverture en un tap pour pouvoir décocher.

**Conséquence sur le seed** : remplir les catalogues ne peut plus se décider sur « la table est vide ».
Un utilisateur qui supprime ses sept sources zéro-cuisson le pense ; l'ancienne règle les lui rendait
toutes au lancement suivant. Le fait d'avoir semé est désormais enregistré dans les réglages
(`catalogsSeededAt`), et une sauvegarde antérieure au drapeau se voit attribuer sa date d'export à
l'import — sinon restaurer une sauvegarde ferait réapparaître des entrées supprimées exprès.

**Écarts assumés par rapport aux versions précédentes du PRD**, tous deux décidés au jalon 6 :

1. **Recharts n'est pas utilisé.** Trois courbes de ligne, sans interaction, ne justifient pas ~100 Ko
   gzip sur un téléphone. `components/charts/LineChart.tsx` fait le travail en une centaine de lignes,
   gère les trous de données et une série secondaire en pointillés. La décision est réversible.
2. **Les photos sont stockées en `ArrayBuffer`, pas en `Blob`.** Le clone structuré traite un
   `ArrayBuffer` de façon identique dans toutes les implémentations d'IndexedDB, ce qui n'est pas vrai
   du `Blob` (Safari a livré des bugs, et `fake-indexeddb` le réduit à un objet vide, rendant la
   sauvegarde intestable). Le `Blob` n'est reconstruit qu'au moment de l'affichage.

---

## 6. Modules fonctionnels

### 6.1 Module Floor & Stack (jalons 2 et 4)

**Plancher quotidien non négociable**

Le plancher est un ensemble de 1 à 5 items minimaux, définis à l'onboarding et modifiables ensuite.
Défauts : `5 pompes`, `1 portion de protéines zéro-cuisson`.

La portion n'est pas une simple case à cocher : la valider ouvre le catalogue zéro-cuisson et le choix
est ajouté au total de protéines du jour. Décocher l'habitude retire ces grammes. Un plancher qui se
coche sans rien apporter nutritionnellement serait un mensonge poli.

- Affiché en haut du Dashboard, toujours au-dessus de la ligne de flottaison.
- Validation en 1 tap par item, plus un bouton « Tout valider ».
- Une fois le plancher complet : micro-animation de confirmation, retour haptique
  (`navigator.vibrate(30)` quand disponible), la carte se replie pour libérer l'écran.
- Aucun message négatif si le plancher n'est pas fait. La carte reste simplement ouverte.

**Ancres de habit stacking**

Habitudes rattachées à un déclencheur existant de la journée. Trois ancres par défaut :

| Ancre | Action |
|---|---|
| Pendant que le café coule | 10 squats à vide |
| Avant d'ouvrir le laptop | 1 série de pompes max |
| Douche du soir | 2 min de gainage ou band pull-aparts |

Cases à cocher, toggle en 1 tap, réinitialisées chaque jour à 04h00 locale.

**Score de consistance élastique**

Remplace explicitement la série consécutive.

```
score7  = jours avec plancher validé sur les 7 derniers jours  / min(7, jours depuis installation)  × 100
score30 = jours avec plancher validé sur les 30 derniers jours / min(30, jours depuis installation) × 100
```

- Arrondi à l'entier. Le dénominateur exclut les jours antérieurs à l'installation, pour ne pas
  afficher 3 % le deuxième jour.
- Bandes de lecture, sans jugement : `< 50 %` → « à relancer », `50–79 %` → « en route »,
  `≥ 80 %` → « solide ».
- Aucun reset, jamais. Un trou de 10 jours fait baisser le pourcentage puis remonte naturellement.
- Jalon cumulatif affiché à côté : « Jour N depuis le début », N = jours écoulés depuis l'installation,
  pas jours consécutifs.

### 6.2 Module Nutrition (jalon 3)

**Cible quotidienne dérivée du poids**

La cible n'est pas un nombre que l'utilisateur doit inventer : elle se calcule.

```
cible = arrondi_5(poids_lissé × 1,8 g/kg), borné à [80, 250] g
```

- Le poids lissé est la moyenne des 4 dernières pesées, pas la dernière. Une pesée isolée varie d'un
  kilo sur l'eau seule, ce qui ferait bouger la cible sans raison physiologique.
- L'arrondi à 5 g évite une fausse précision sur une entrée déjà lissée.
- 1,8 g/kg est le milieu de la fourchette de recomposition : assez haut pour protéger le muscle en
  déficit, assez bas pour rester atteignable un mauvais jour.
- **Sans aucune pesée**, une cible provisoire de 150 g s'affiche, explicitement signalée comme telle.

**Override manuel figé**

Modifier la cible à la main la bascule en mode `manual` et la fige. Une pesée ultérieure ne la
déplace plus jamais — l'app ne change pas un chiffre que l'utilisateur a posé. Les réglages affichent
en permanence ce que le calcul donnerait, et un bouton « revenir au calcul automatique » rend la main
à la formule en un tap.

**Compteur protéines 1-tap**

- Boutons rapides : `+20 g`, `+30 g`, `+40 g`, `Autre` (bottom sheet avec pavé numérique).
- Anneau de progression vers la cible du jour.
- Chaque ajout crée un `ProteinLog` horodaté et typé (`shake`, `zero_cook`, `takeout`, `meal`).
- Le type source est optionnel : par défaut `meal`, modifiable après coup dans la liste du jour.
- Annulation du dernier ajout disponible pendant 10 secondes (toast avec « Annuler »).
- **Journée logique** : un log entre 00h00 et 04h00 est rattaché à la veille. Le seuil est constant
  dans tout le code (`DAY_ROLLOVER_HOUR = 4`).

**Cheat sheet livraison**

Fiche de décision consultable hors ligne, filtrable par type de cuisine, avec pour chaque entrée les
choix recommandés et les pièges. Données de seed en annexe A, éditables par l'utilisateur (ajout,
modification, suppression), stockées en base.

**Catalogue zéro-cuisson**

Checklist d'inventaire des protéines instantanées (skyr, thon en boîte, cottage cheese, œufs durs,
charcuterie maigre, whey). Chaque item porte ses grammes de protéines par portion et peut être logué
directement dans le compteur en 1 tap depuis la liste.

### 6.3 Module Séances (jalon 5)

**Deux modes**

- **Circuit 20 min** : trois blocs — poussée (pompes et variantes, développé élastique), tirage
  (tractions à la porte, rowing élastique), bas du corps (fentes bulgares, goblet squats).
  Timer global de séance visible.
- **Micro-séries** : log d'une série isolée, n'importe quand dans la journée, sans ouvrir de séance.
  Accessible en 1 tap depuis le bouton d'action flottant du Dashboard.

**Surcharge progressive — règles de suggestion**

Au moment de saisir une série, la dernière performance sur le même exercice est affichée juste à côté
du champ, avec une suggestion calculée :

| Difficulté de la dernière série | Suggestion |
|---|---|
| Facile | +2 reps |
| Cible | +1 rep |
| Difficile | mêmes reps, même charge |

- Quand les reps atteignent le haut de la fourchette de l'exercice (défaut 15 au poids de corps),
  la suggestion bascule sur la progression suivante : variante plus difficile ou élastique supérieur,
  avec retour au bas de la fourchette.
- La difficulté est saisie en 3 boutons (Facile / Cible / Difficile). Le RPE numérique reste stocké
  en optionnel pour l'analyse, mais n'est jamais demandé à l'écran.
- La suggestion est toujours pré-remplie et toujours modifiable. Aucun blocage.

**Timer de repos**

Compte à rebours 60 s / 90 s / personnalisé (15 à 600 s), signal sonore court et vibration en fin. Continue de
tourner si l'écran est verrouillé (recalcul sur `timestamp` de départ, pas sur `setInterval` seul).

### 6.4 Module Poids (jalon 3)

- **Pesée suggérée, jamais imposée** : une carte discrète apparaît sur le dashboard quand la dernière
  pesée date de 7 jours ou plus, et disparaît sinon. Aucune notification, aucun rappel insistant.
- **Une entrée par jour logique** : une seconde pesée le même jour corrige la première au lieu de
  s'ajouter.
- **Moyenne glissante sur 4 points** affichée à la place du chiffre brut, avec la tendance en kg
  entre la fenêtre courante et la précédente.
- **Le poids ne pilote rien d'autre que la cible de protéines.** Il n'apparaît pas comme un objectif,
  il n'y a pas de poids cible, et aucun écran ne le présente comme une mesure de réussite — le PRD
  reste centré sur la recomposition (§3.3).

### 6.5 Module Tendances (jalon 6)

- **Index de force** : progression du volume (reps × séries, pondéré par la charge quand renseignée)
  sur les mouvements de base, fenêtre 3, 6 ou 12 mois, courbe SVG.

  Le facteur de charge est la part de poids de corps ajoutée : une traction à +8 kg sur un corps de
  80 kg vaut 1,1 fois une traction au poids de corps. Cela évite qu'un passage au lesté en cours de
  fenêtre ressemble à un bond de 800 %, et n'introduit aucune constante inventée — l'app connaît déjà
  le poids de corps. Le résultat est publié en **base 100 sur la première semaine ayant du volume** :
  la valeur absolue mélange des mouvements et ne veut rien dire seule. Une semaine sans série est un
  **trou dans la courbe**, pas un zéro.
- **Mesures** : tour de taille en cm, saisie hebdomadaire suggérée mais jamais imposée. Courbe avec
  moyenne glissante sur 4 points pour lisser le bruit quotidien.
- **Coffre photos** : photos mensuelles stockées en octets dans IndexedDB, redimensionnées côté client
  à 1200 px sur le grand côté et converties en WebP qualité 0,8. Vue comparative deux photos côte à côte.
- **Matrice de consistance** : heatmap 12 semaines du plancher, en CSS grid, sans dépendance.
- **Aucun compte à rebours.** Uniquement des jalons cumulatifs.
- **Export / import** : bouton « Exporter mes données » produisant un JSON versionné (photos incluses
  en base64 dans un fichier séparé si le volume dépasse 5 Mo), et un import avec écran de confirmation
  explicite avant écrasement.

---

## 7. Architecture applicative

```text
src/
├── app/
│   ├── router.tsx              # HashRouter, routes, layout
│   └── providers.tsx           # thème, error boundary
├── components/
│   ├── ui/                     # primitives shadcn/ui (button, card, sheet, progress…)
│   └── shared/                 # BottomNav, ScreenHeader, QuickActionFab, EmptyState
├── features/
│   ├── floor/                  # module 1 : composants, store, logique, tests
│   ├── nutrition/              # module 3
│   ├── workouts/               # module 2
│   └── trends/                 # module 4
├── db/
│   ├── dexie.ts                # déclaration de la base et des migrations
│   └── repositories/           # accès typé par table, jamais de Dexie brut dans un composant
├── stores/
│   ├── settingsStore.ts        # persist localStorage
│   └── uiStore.ts              # état éphémère, non persisté
├── lib/
│   ├── date.ts                 # journée logique, rollover 04h00, clés YYYY-MM-DD
│   ├── consistency.ts          # calcul des scores élastiques
│   ├── overload.ts             # règles de surcharge progressive
│   └── image.ts                # redimensionnement et conversion WebP
├── i18n/
│   └── fr.ts                   # tous les textes utilisateur, clé → chaîne
└── types/
    └── models.ts               # schémas de la section 8
```

**Règles d'architecture**

- Aucun composant n'accède directement à Dexie : il passe par un repository, lui-même appelé par un
  hook ou un store. Cela rend la logique testable sans DOM.
- Aucun texte utilisateur en dur dans un composant : tout passe par `i18n/fr.ts`, ce qui rend l'ajout
  de l'anglais mécanique (décision n°4).
- La logique métier pure (`lib/`) ne dépend ni de React ni de Dexie, et est couverte par des tests
  unitaires.

**Répartition du stockage** (décision n°3)

| Donnée | Support | Justification |
|---|---|---|
| Réglages, profil, cible protéines | Zustand persist / localStorage | Petit, lu à chaque rendu, synchrone |
| Définitions des habitudes plancher et ancres | Zustand persist / localStorage | Peu volumineux, modifié rarement |
| Préférences UI (dernier onglet, sections repliées) | Zustand persist / localStorage | Confort, perte sans gravité |
| Logs quotidiens, protéines, séances, séries | Dexie / IndexedDB | Croissance illimitée, requêtes par plage de dates |
| Mesures | Dexie / IndexedDB | Historique long |
| Photos | Dexie / IndexedDB (`ArrayBuffer`) | Volumineux, incompatible localStorage |

---

## 8. Modèle de données

Révision du modèle v1.0 : ajout des identifiants et horodatages de création/modification sur toutes les
entités (nécessaires à un export/import fiable), suppression de `completed` sur la définition d'une
habitude — l'état de complétion appartient au jour, pas à la définition.

```typescript
export type IsoDate = string;      // 'YYYY-MM-DD', journée logique (rollover 04h00)
export type IsoDateTime = string;  // ISO 8601 complet

export interface FloorHabitDefinition {
  id: string;
  title: string;                            // « 5 pompes »
  triggerAnchor?: string;                   // « Pendant que le café coule »
  targetRepsOrAction: string;               // « 10 squats »
  category: 'workout' | 'nutrition' | 'mobility';
  kind: 'floor' | 'stack';                  // plancher non négociable vs habitude empilée
  completionMode: 'toggle' | 'protein_portion'; // portion = choisir la source et loguer ses grammes
  order: number;
  archivedAt?: IsoDateTime;                 // jamais supprimée, pour ne pas trouer l'historique
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

export interface HabitCompletion {
  id: string;
  habitId: string;
  date: IsoDate;
  completedAt: IsoDateTime;
}

export interface Exercise {
  id: string;
  name: string;
  pattern: 'push' | 'pull' | 'legs' | 'core' | 'other';
  defaultRepRange: [number, number];        // ex. [8, 15]
  progressionChain?: string[];              // ids d'exercices, du plus facile au plus dur
  isCustom: boolean;
}

export interface ExerciseSet {
  id: string;
  sessionId?: string;                       // absent pour une micro-série
  exerciseId: string;
  reps: number;
  loadOrResistance: string;                 // « Poids du corps », « +5 kg », « Élastique noir »
  difficulty: 'easy' | 'target' | 'hard';
  rpe?: number;                             // 1-10, jamais demandé à l'écran
  date: IsoDate;
  timestamp: IsoDateTime;
}

export interface WorkoutSession {
  id: string;
  date: IsoDate;
  startedAt: IsoDateTime;
  endedAt?: IsoDateTime;
  durationMinutes?: number;
  type: '20min_circuit' | 'micro_sets' | 'custom';
  notes?: string;
}

export interface ProteinLog {
  id: string;
  date: IsoDate;
  timestamp: IsoDateTime;
  grams: number;
  sourceType: 'shake' | 'zero_cook' | 'takeout' | 'meal';
  note?: string;
}

export interface DailyLog {
  date: IsoDate;                            // clé primaire
  floorCompleted: boolean;                  // dérivé : tous les items de plancher actifs sont cochés
  totalProteinGrams: number;                // agrégat dénormalisé, recalculé à chaque écriture
  proteinTargetGrams: number;               // figé au moment du jour, pour ne pas réécrire l'histoire
  notes?: string;
}

export interface Measurement {
  id: string;
  date: IsoDate;
  waistCm?: number;
  weightKg?: number;                        // saisi mais volontairement discret dans l'UI
  createdAt: IsoDateTime;
}

export interface ProgressPhoto {
  id: string;
  date: IsoDate;
  bytes: ArrayBuffer;                       // WebP, 1200 px max sur le grand côté
  mimeType: string;                         // image/webp, ou image/jpeg en repli
  angle: 'front' | 'side' | 'back';
  widthPx: number;
  heightPx: number;
  byteSize: number;
  createdAt: IsoDateTime;
}

export interface TakeoutOption {
  id: string;
  cuisine: string;                          // « Japonais », « Shawarma », « Rôtisserie », « Burger »
  pick: string;                             // ce qu'on commande
  avoid: string;                            // ce qu'on évite
  estimatedProteinGrams?: number;
  isCustom: boolean;
}

export interface ZeroCookItem {
  id: string;
  name: string;
  proteinPerServingGrams: number;
  servingLabel: string;                     // « 1 pot 150 g »
  inStock: boolean;
  isCustom: boolean;
}

export interface AppSettings {
  schemaVersion: number;
  installedAt: IsoDateTime;                 // base du dénominateur de consistance et du « Jour N »
  proteinTargetMode: 'auto' | 'manual';     // auto = dérivé du poids lissé
  manualProteinTargetGrams?: number;        // seulement en mode manual, figé
  locale: 'fr';
  onboardingCompletedAt?: IsoDateTime;
  restTimerDefaultSeconds: number;          // 15 à 600 s ; 60 et 90 proposés en presets
  catalogsSeededAt?: IsoDateTime;           // vider un catalogue exprès doit tenir
  hapticsEnabled: boolean;
  soundEnabled: boolean;
}

export interface ExportBundle {
  schemaVersion: number;
  exportedAt: IsoDateTime;
  settings: AppSettings;
  habits: FloorHabitDefinition[];
  completions: HabitCompletion[];
  dailyLogs: DailyLog[];
  proteinLogs: ProteinLog[];
  sessions: WorkoutSession[];
  sets: ExerciseSet[];
  measurements: Measurement[];
  takeoutOptions: TakeoutOption[];
  zeroCookItems: ZeroCookItem[];
  photos?: Array<Omit<ProgressPhoto, 'bytes'> & { dataUrl: string }>;
}
```

**Migrations** : `schemaVersion` est incrémenté à chaque changement de forme. La v2 déplace la cible de
protéines d'un nombre brut vers un calcul, et convertit l'ancien plancher « 1 shaker » en portion
réelle ; une valeur saisie en v1 survit comme override manuel, parce que c'était une décision humaine. Dexie porte les migrations
de base ; l'import refuse un bundle de version supérieure à celle du code et migre celles inférieures.

---

## 9. Navigation

```text
[ Barre de navigation basse — 4 onglets, cibles tactiles 48×48 px minimum ]
├── 🏠 Aujourd'hui   Plancher du jour, anneau protéines, ancres d'habitude, bouton « Séance 20 min »
├── 🏋️ Séances       Séance rapide, historique, PR et surcharge progressive
├── 🥗 Nutrition     Compteur 1-tap, cheat sheet livraison, catalogue zéro-cuisson
└── 📈 Tendances     Force, tour de taille, photos, matrice de consistance

[ Bouton d'action flottant, présent sur les 4 onglets ]
└── Feuille rapide : « +30 g protéines » · « +1 série » · « Valider le plancher »

[ Réglages ] accessible par l'icône en haut à droite du Dashboard
└── Profil, cible protéines, habitudes, timer, export/import, à propos
```

L'onglet Aujourd'hui est la racine. Un retour à froid sur l'app y atterrit toujours.

---

## 10. Design system et UX

- **Dark mode par défaut**, unique thème en V1. Fond quasi noir, surfaces légèrement élevées, un seul
  accent vif réservé aux actions et à la progression.
- **Contraste** : AA minimum sur tout texte, AAA sur les chiffres clés du Dashboard.
- **Cibles tactiles** : 48×48 px minimum, 56 px pour les boutons de log rapide.
- **Zone du pouce** : toute action fréquente vit dans le tiers inférieur de l'écran.
- **Composants** : `Card`, `Button`, `Progress`, `Sheet` (bottom sheet), `Dialog`, `Tabs`, `Toast`
  depuis shadcn/ui.
- **Retour immédiat** : chaque validation déclenche une micro-animation courte (150–200 ms), une
  vibration légère si supportée, et un toast annulable pour les actions destructrices.
- **États vides utiles** : jamais un écran vide seul ; toujours une phrase et l'action qui le remplit.
- **Aucun élément de honte** : pas de rouge sur un objectif manqué, pas de « série perdue »,
  pas de pourcentage négatif mis en avant.
- **Respect de `prefers-reduced-motion`** : animations désactivées si l'utilisateur le demande.

---

## 11. PWA et hors ligne

- **Manifeste** : nom `RecompOS`, `display: standalone`, orientation portrait, thème sombre,
  icônes 192, 512 et maskable, écrans de démarrage iOS.
- **Service worker** : `vite-plugin-pwa` en `registerType: 'autoUpdate'`, precache de l'app shell
  (HTML, JS, CSS, polices, icônes). Aucun appel réseau au runtime, donc aucune stratégie de cache
  d'API à définir.
- **Mise à jour** : bandeau discret « Nouvelle version disponible » avec bouton de rechargement,
  jamais de rechargement forcé au milieu d'une saisie.
- **iOS** : vérifier l'installation depuis Safari (Partager → Sur l'écran d'accueil), le comportement
  hors ligne après force-quit, et la persistance IndexedDB. `navigator.storage.persist()` est demandé
  au premier lancement pour réduire le risque d'éviction.
- **Quota** : afficher l'espace utilisé dans les Réglages via `navigator.storage.estimate()`, et
  alerter au-delà de 80 %.

---

## 12. Qualité, tests, CI/CD

**Tests (Vitest + Testing Library)**

Priorité à la logique pure, qui concentre les vrais risques de bug :

- `lib/consistency.ts` — dénominateur tronqué à l'installation, trous, jour de rollover, 100 %, 0 %.
- `lib/date.ts` — journée logique à 03h59 et 04h01, changements d'heure, passage de mois.
- `lib/overload.ts` — les trois règles de difficulté, le franchissement du haut de fourchette, la
  bascule sur la progression suivante.
- `lib/nutrition.ts` — formule de cible, bornes, lissage du poids, amortissement d'un pic hydrique.
- Migration v1 → v2 — override conservé, plancher converti, habitudes existantes préservées.
- Agrégation des protéines — somme, annulation, réécriture de `DailyLog.totalProteinGrams`.
- Export/import — aller-retour sans perte, refus d'un `schemaVersion` supérieur.

Tests de composants sur les parcours critiques uniquement : valider le plancher, ajouter 30 g,
logger une série. Pas de test de rendu exhaustif.

**CI (GitHub Actions)**

Sur chaque push et chaque PR : `npm ci`, `tsc --noEmit`, `eslint`, `vitest run`, `vite build`.
Les quatre sont bloquants.

**Déploiement**

Sur push `main` et CI verte : build puis publication sur GitHub Pages.
`base: '/recompos/'` dans `vite.config.ts`, cohérent avec `scope` et `start_url` du manifeste.

---

## 13. Critères d'acceptation

**Jalon 1 — squelette**

- [x] `npm run dev`, `npm run build`, `npm test`, `npm run lint` passent sans erreur ni warning.
- [x] Les 4 onglets sont routés et l'état de navigation survit à un rechargement.
- [~] L'app est installable et s'ouvre en mode avion — vérifié sous Chromium mobile ; reste à confirmer sur un iPhone réel.
- [x] Les réglages écrits persistent après fermeture complète de l'app.
- [x] La base Dexie est créée avec toutes les tables et les données de seed.
- [x] L'onboarding 3 écrans s'affiche une seule fois.
- [x] Le plancher du jour s'affiche et se valide, et la validation survit à un redémarrage.
- [ ] Le site est en ligne sur GitHub Pages.

**Transverses, valables sur tous les jalons**

- [ ] Toute action cœur est atteignable en moins de 3 taps depuis l'ouverture de l'app.
- [ ] Aucun écran n'affiche de compte à rebours vers une date.
- [ ] Aucun message ne culpabilise l'utilisateur.
- [ ] Aucune requête réseau au runtime en dehors du chargement initial des assets.
- [ ] Toute chaîne visible par l'utilisateur vient de `i18n/fr.ts`.

---

## 14. Hors périmètre

Explicitement exclu, pour éviter la dérive :

- Synchronisation cloud, comptes utilisateurs, backend de quelque nature.
- Notifications push ou locales (décision n°6).
- Chiffrement des photos et code PIN (décision n°7).
- Suivi calorique complet, base alimentaire, scan de code-barres.
- Intégrations santé (Apple Health, Google Fit), objets connectés, balances.
- Fonctions sociales, partage, classements.
- Portage React Native ou Expo (conséquence de la décision n°2).
- Mode clair.

---

## 15. Risques

| Risque | Impact | Mitigation |
|---|---|---|
| Éviction d'IndexedDB par iOS après 7 jours sans usage | Perte de données | `navigator.storage.persist()`, PWA installée (exemptée), rappel d'export dans les Réglages |
| Photos saturant le quota | Écritures en échec | Compression WebP 1200 px, jauge d'espace, alerte à 80 % |
| Abandon après 3 semaines (le cycle burnout que l'app combat) | L'app ne sert plus | Score élastique sans reset, plancher volontairement ridicule (5 pompes), aucune notification qui transforme l'app en source de culpabilité |
| Une bibliothèque de graphiques alourdit le démarrage | Ouverture lente | Courbes SVG écrites à la main, aucune dépendance ajoutée |
| Dérive de périmètre jalon après jalon | V1 jamais livrée | Section 14 opposable, critères de sortie par jalon |

---

## Annexe A — Données de seed

**Cheat sheet livraison**

| Cuisine | On prend | On évite |
|---|---|---|
| Japonais | Yakitori (poulet, bœuf), sashimi, edamame | Tempura, bowls sauce sucrée, California rolls |
| Shawarma / libanais | Assiette poulet grillé, viande en supplément, salade | Frites, sauce blanche à volonté, galette |
| Rôtisserie | Demi-poulet rôti, haricots verts | Gratin, pommes de terre à la graisse |
| Burger | Double steak, un seul pain, sans sauce, eau ou soda zéro | Menu frites, milkshake, bacon-fromage-sauce |
| Poke | Base salade, double protéine, sauce à part | Base riz sucré, mayo épicée, toppings frits |
| Italien | Poulet ou poisson grillé, salade de mozzarella | Pizza, pâtes crème, pain à l'ail |

**Catalogue zéro-cuisson**

| Item | Protéines par portion | Portion |
|---|---|---|
| Skyr nature | 17 g | 1 pot 150 g |
| Thon en boîte au naturel | 26 g | 1 boîte 130 g |
| Cottage cheese | 12 g | 100 g |
| Œufs durs prêts à consommer | 13 g | 2 œufs |
| Blanc de poulet en tranches | 20 g | 100 g |
| Whey | 24 g | 1 dose 30 g |
| Fromage blanc 0 % | 8 g | 100 g |

**Exercices par défaut**

| Exercice | Schéma | Fourchette | Chaîne de progression |
|---|---|---|---|
| Pompes inclinées | push | 8–15 | → pompes → pompes surélevées → pompes archer |
| Pompes | push | 8–15 | → pompes surélevées |
| Rowing élastique | pull | 10–15 | → rowing élastique plus dur |
| Tractions à la porte | pull | 5–12 | → tractions lestées |
| Fentes bulgares | legs | 8–12 | → fentes bulgares lestées |
| Goblet squat | legs | 10–15 | → goblet squat lesté |
| Gainage | core | 30–120 s | → gainage bras tendus |

**Habitudes plancher par défaut**

| Type | Titre | Ancre |
|---|---|---|
| Plancher | 5 pompes | — |
| Plancher | 1 portion de protéines zéro-cuisson | — |
| Empilée | 10 squats à vide | Pendant que le café coule |
| Empilée | 1 série de pompes max | Avant d'ouvrir le laptop |
| Empilée | 2 min de gainage | Douche du soir |
