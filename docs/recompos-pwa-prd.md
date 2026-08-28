# PRD — RecompOS

**PWA anti-burnout de recomposition corporelle (zéro motivation, friction minimale)**

| | |
|---|---|
| Version | 2.2 — Nutrition calories d'abord, IMC dans Progression |
| Date | 2026-08-28 |
| Statut | Jalons 1 à 7 livrés ; refonte livrée |
| Remplace | v2.1 (décodeur de code-barres embarqué), v2.0 (trois sources de repas), v1.9 (refonte complète des écrans), v1.8 (coquille de la refonte), v1.7 (suivi calorique par photo), v1.6 (décision n°6 réexaminée), v1.5 (écarts refermés), v1.4 (V1 complète), v1.3 (plan recalé), v1.2 (poids et cible dérivée), v1.1 (cadrage), v1.0 (brouillon) |

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

Les arbitrages ci-dessous sont **verrouillés**. Toute remise en question est un changement de PRD, pas
une décision d'implémentation.

| # | Sujet | Décision | Conséquence principale |
|---|---|---|---|
| 1 | Périmètre V1 | Squelette navigable d'abord, puis itération module par module | Jalon 1 = 4 écrans + navigation + design system + PWA offline avec logique minimale |
| 2 | Stack UI | Tailwind CSS + shadcn/ui | Abandon de Gluestack UI v2 et de la compatibilité React Native. Web pur, bundle léger |
| 3 | Persistance | Zustand `persist` (localStorage) + Dexie/IndexedDB | localStorage pour réglages et état courant, IndexedDB pour historiques et photos |
| 4 | Langue | Français d'abord, i18n-ready | Tous les textes dans un module de constantes ; code et identifiants en anglais |
| 5 | Sauvegarde | Export/import JSON manuel | Zéro backend. Bouton export (JSON + photos) et import dans les réglages |
| 6 | Rappels | Aucune notification | Ni push, ni notification locale. L'ouverture de l'app est le seul déclencheur. Question rouverte le 23/08/2026, décision maintenue — voir annexe B |
| 7 | Photos | Octets locaux + compression WebP côté client | Jamais de sortie de l'appareil. Pas de chiffrement, pas de code PIN en V1. Stockées en `ArrayBuffer` et non en `Blob` (voir §8) |
| 8 | Onboarding | Mini-onboarding 3 écrans | ~30 secondes au premier lancement, jamais réaffiché |
| 9 | Graphiques | SVG maison (~2 Ko), Recharts écarté | Décision révisée au jalon 6 : trois courbes ne justifient pas ~100 Ko gzip. Réversible — Recharts reste le plan B si un graphique interactif devient nécessaire |
| 10 | Livraison | GitHub Pages + Actions, Vitest + Testing Library, lint et typecheck en CI | Déploiement auto sur push `main`, base path Vite à configurer |
| 11 | Cible de protéines | Dérivée du poids : 1,8 g/kg, arrondi à 5 g | La cible n'est plus un nombre à inventer ; elle suit le corps |
| 12 | Override manuel | Toute modification à la main fige la cible | Une nouvelle pesée ne réécrit jamais un chiffre choisi par l'utilisateur ; retour à l'auto en un tap |
| 13 | Suivi du poids | Pesée hebdomadaire suggérée, moyenne glissante sur 4 points | L'app n'affiche jamais la pesée brute comme un résultat |
| 14 | Plancher nutrition | « 1 portion de protéines zéro-cuisson », choisie dans le catalogue | Le plancher apporte de vrais grammes au total du jour, au prix d'un tap de plus |
| 15 | Suivi calorique | **Autorisé, par photo analysée par un modèle de vision.** Renverse l'exclusion §14, décidé le 27/08/2026 | Voir §6.6. La saisie manuelle d'un tracker payant était le point de friction réel ; une photo la remplace |
| 16 | Clé API | Saisie par l'utilisateur dans les Réglages, jamais compilée dans le bundle | L'hébergement est statique : une clé embarquée serait lisible par quiconque ouvre la page. Décision n°5 (zéro backend) tient |
| 17 | Cible calorique | **Mifflin-St Jeor × facteur d'activité, moins un déficit réglable** (10 % par défaut), arrondi à 50, override manuel qui fige. Révisée le 27/08/2026 | Même contrat que les décisions n°11 et n°12. La première version dérivait la cible du poids seul à 30 kcal/kg : c'était le maintien, pas un déficit — voir §6.7 |
| 18 | Refonte de la navigation | **Onglets Aujourd'hui · Nutrition · Séances · Progression, et Réglages en 6 rubriques menant à des sous-pages.** Décidé le 27/08/2026 sur le handoff `docs/design` | Une seule maison par donnée : la carte de pesée vivait à la fois dans Réglages et dans Progression, elle ne reste que dans Progression. La route `/trends` ne bouge pas malgré le renommage de l'onglet — renommer ne doit pas casser un signet |
| 19 | Nommage « empilées » | **L'UI garde « Habitudes empilées », contre la proposition « En plus » du handoff** | Écart assumé, pas un oubli d'implémentation : le terme dit le mécanisme, une habitude accrochée à une ancre existante. Le modèle gardait déjà `kind: 'stack'` dans les deux cas |
| 20 | Numéro de version affiché | **`package.json`, injecté au build**, jamais `SCHEMA_VERSION` | L'écran affichait « Version 3.0 » en beta : c'était le compteur de migrations Dexie déguisé en livraison. Le numéro de schéma reste visible, mais dans Réglages → Données, à côté de l'export, seul endroit où il veut dire quelque chose |
| 21 | Sources d'un repas | **Trois entrées : photo, description en texte, code-barres OpenFoodFacts.** Ajoutée le 28/08/2026 | La photo n'est plus la seule porte. Le texte passe par un modèle réglé à part du modèle vision, sur la même clé ; le code-barres n'appelle aucun modèle et ne coûte rien |
| 22 | Contexte d'analyse | **Une précision facultative est demandée avant l'envoi de la photo**, pas seulement après une lecture ratée | Une information que l'utilisateur avait avant la photo coûtait jusqu'ici un second appel. Le prompt distingue une précision d'une correction |
| 23 | Décodeur de code-barres | **Une dépendance est admise : `barcode-detector`, chargée à la demande.** Décidé le 28/08/2026, renverse la contrainte « aucune dépendance » du plan | `BarcodeDetector` est une API Chromium. Safari ne l'implémente pas, et tout navigateur sur iOS est Safari en dessous — c'est-à-dire l'appareil avec lequel on scanne. Sans décodeur embarqué, le bouton n'ouvre jamais la caméra sur iPhone. Voir §6.8 |
| 24 | Écran Nutrition | **Calories d'abord, journal rangé par repas, une seule feuille d'ajout.** Décidée le 28/08/2026 sur le handoff « Refonte de l'écran Nutrition » | Les protéines quittent le grand anneau mais gardent l'accent : c'est toujours le nombre dont l'app parle. Le journal chronologique devient un budget par repas. Les quatre points d'entrée de saisie deviennent le `+` d'un repas, ce qui répond « quel repas ? » avant d'ouvrir plutôt qu'après. Voir §6.9 |
| 25 | Cibles dérivées | **Cible kcal par repas en 25 / 40 / 30 / 5 %, figée ; glucides et lipides = le reste des calories après protéines, réparti 55/45** | Aucun réglage de plus à tenir à jour. Les protéines restent la seule cible que l'app calcule vraiment ; les deux autres sont ce qu'il reste du budget, et le disent. Une cible protéines qui mange tout le budget rend zéro, jamais un gramme négatif — et un dénominateur nul disparaît de l'écran au lieu d'inventer une cible |
| 26 | IMC | **Affiché dans la section Poids de Progression, calculé sur le poids lissé, et jamais sans la taille** | L'IMC est une lecture du poids, pas une mesure de plus : pas de section à lui. Sans `heightCm`, aucun chiffre — la carte se réduit au lien qui répare. Le graphique gagne une seconde graduation, pas une seconde courbe : à taille constante les deux tracés seraient superposés. Voir §6.5 |

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
| Vision | Endpoints OpenAI-compatibles (Groq, OpenRouter, libre) | Appelés depuis la page avec la clé de l'utilisateur. Aucun SDK : `fetch` et un parseur maison. **CORS vérifié sur Groq depuis un navigateur le 27/08/2026** — aucun relais nécessaire |

**Contraintes de bundle** : app shell sous 200 Ko gzip, vérifié à chaque build. Aucun découpage en
chunks n'a été nécessaire : au jalon 7, l'app complète pèse ~159 Ko gzip.

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

**Jalon 7 — Repas photographiés**

Suivi calorique par photo : capture, analyse par un modèle de vision configuré par l'utilisateur,
correction ligne par ligne, cible calorique dérivée du poids, file d'attente hors ligne, rétention des
photos et export. Lève l'exclusion §14 (décision n°15).

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
- **IMC** (décision n°26) : affiché dans la section **Poids** et nulle part ailleurs, sous le chiffre
  du poids lissé. C'est une lecture du poids, pas une mesure de plus.

  Calculé sur le **poids lissé**, le même chiffre affiché juste au-dessus : sur la pesée brute du
  matin, l'IMC bougerait d'un dixième par jour pour des raisons d'eau. Arrondi à une décimale à la
  source plutôt qu'à l'affichage, faute de quoi un 24,96 rendu « 25,0 » se contredirait avec la
  catégorie « corpulence normale » posée à côté.

  La carte rappelle la taille qui a servi au calcul, parce qu'elle se saisit ailleurs (Réglages ›
  Objectifs) et qu'un IMC sans sa taille n'est pas vérifiable. **Sans `heightCm`, aucun chiffre** : la
  carte se réduit à un lien vers le réglage manquant, et l'axe droit du graphique disparaît. Un IMC
  calculé sur une taille devinée a exactement l'air d'un vrai — c'est ce qui le rend pire que rien.

  Aucune couleur d'alerte : la catégorie est une information, pas un verdict. Même règle que l'anneau
  qui plafonne au lieu de virer au rouge.

  Le graphique de poids gagne **une seconde graduation à droite, pas une seconde courbe**. À taille
  constante l'IMC est le poids divisé par une constante : les deux tracés seraient rigoureusement
  superposés. `LineChart` accepte donc un axe secondaire — un libellé et une conversion — avec sa
  propre précision décimale, des bornes converties pouvant se retrouver bien plus serrées que celles
  dont elles viennent.
- **Mesures** : tour de taille en cm, saisie hebdomadaire suggérée mais jamais imposée. Courbe avec
  moyenne glissante sur 4 points pour lisser le bruit quotidien.
- **Coffre photos** : photos mensuelles stockées en octets dans IndexedDB, redimensionnées côté client
  à 1200 px sur le grand côté et converties en WebP qualité 0,8. Vue comparative deux photos côte à côte.
- **Matrice de consistance** : heatmap 12 semaines du plancher, en CSS grid, sans dépendance.
- **Aucun compte à rebours.** Uniquement des jalons cumulatifs.
- **Export / import** : bouton « Exporter mes données » produisant un JSON versionné (photos incluses
  en base64 dans un fichier séparé si le volume dépasse 5 Mo), et un import avec écran de confirmation
  explicite avant écrasement.

### 6.6 Module Repas — suivi calorique par photo (jalon 7)

**Pourquoi cette exclusion a été levée**

Le PRD refusait le suivi calorique pour une raison qui tient toujours : compter ses calories est la
mécanique la plus abandonnée des applications de fitness, parce qu'elle transforme chaque repas en
tâche comptable — exactement la friction que les principes n°1 et n°2 combattent.

Ce qui a changé n'est pas l'analyse, c'est le constat d'usage : la friction n'était pas *le comptage*,
c'était *la saisie*. Un tracker payant déjà utilisé au quotidien imposait de décrire chaque plat à la
main. Une photo supprime la saisie sans supprimer le comptage. Et si le suivi calorique est abandonné
dans trois mois, le reste de l'app continue sans lui : ce module est additif, aucun autre écran n'en
dépend.

**La boucle**

1. Photo de l'assiette, redimensionnée à 1024 px et encodée en WebP qualité 0,7 sur l'appareil.
2. Écriture immédiate en base, statut `pending`, **avant tout appel réseau**.
3. Analyse par le premier service configuré qui répond. Les octets partent en base64 dans le corps de
   la requête — la photo n'est hébergée nulle part.
4. Résultat validé, ligne par ligne, puis écrit sur le repas.
5. Correction humaine à un tap, ligne par ligne.

**Corriger l'identification, pas seulement les chiffres**

Une lecture peut être fausse d'un cran — un chiffre à rectifier — ou fausse de bout en bout : du
couscous lu comme du riz au lait, un verre de lben lu comme un « dessert aux fruits (type mangue) ».
Dans le second cas, corriger ligne par ligne revient à ressaisir le repas à la main, ce que la feature
existe précisément pour éviter.

Le détail d'un repas porte donc un champ **« Ce n'est pas ça ? »** : une phrase — « couscous, bœuf,
lben, carottes » — relance l'analyse **sur la même photo**. La précision fait autorité sur *ce que
sont* les aliments, jamais sur *combien* : la personne était à table, le modèle non ; mais les
portions se relisent sur la photo et ne sont pas reconduites de la lecture qu'on vient de remplacer.

La précision est conservée sur le repas, si bien qu'une relance ultérieure repart de la correction et
non de l'erreur.

**Deux règles nées d'une lecture ratée**

- **Ne jamais inventer une variété, un parfum ou une origine.** « Dessert lacté » si c'est ce qu'on
  voit ; pas « type mangue ». Le modèle avait fabriqué une déclinaison de toutes pièces.
- **Ne pas rabattre le plat sur la cuisine la plus fréquente.** Semoule, couscous, boulgour, riz et
  quinoa se ressemblent en photo : à défaut de trancher, la famille, une confiance basse, et le doute
  écrit dans les notes. Même chose pour un liquide blanc, qui n'est pas forcément du lait.

**Le détail plutôt que le total**

La réponse du modèle est stockée aliment par aliment, et c'est le détail qui est éditable. « Le riz
c'était 200 g pas 300 » est une correction qu'un humain peut faire ; « ce repas fait 620 et pas 780 »
est une deuxième supposition. Les totaux sont **toujours recalculés depuis le détail**, jamais lus
dans la réponse : les modèles rendent régulièrement une décomposition qui ne somme pas à leur propre
total.

**Où va l'effort de précision**

La littérature sur l'évaluation diététique par image situe l'erreur dominante dans l'**estimation de
la portion**, pas dans la reconnaissance de l'aliment. Le prompt dépense donc ses consignes là :
repères d'échelle visibles, matières grasses de cuisson comptées même invisibles, cohérence 4/4/9
entre macros et kcal, et une confiance annoncée qui retombe sur `low` au moindre doute. Une estimation
qui dit qu'elle est large reste utilisable ; une fausse précision, non.

**Protéines comptées une seule fois**

Le compteur de protéines existe déjà, avec son anneau, son habitude plancher et son total du jour. Un
repas ne tient donc **pas** un compte parallèle : il possède exactement un `ProteinLog` et le maintient
à jour. Créer en écrit un, corriger le met à jour, supprimer le retire, et un repas sans protéine n'en
garde aucun. Tout ce qui est branché en aval de `refreshProteinTotal` continue de fonctionner sans
savoir que les repas existent.

**Hors ligne**

C'est la seule fonction de l'app qui a besoin du réseau, et elle est construite pour s'en passer le
temps qu'il faut. La photo est enregistrée avant l'appel ; la file d'attente reprend au montage, au
retour de l'onglet et au retour du réseau. Une photo prise dans un sous-sol est un repas qui a eu
lieu : elle doit survivre à la fermeture de l'app. La saisie manuelle reste disponible sans clé, sans
réseau et sans photo.

**Rétention des photos**

Les octets d'un repas sont effacés après 30 jours par défaut (réglable : aucune, 7, 30, 90 jours) ;
les chiffres restent. Trois repas par jour à ~50 Ko font environ 55 Mo par an, ce qu'IndexedDB tient
sans difficulté — mais une assiette photographiée en mars ne vaut pas la place en décembre. **Aucun
stockage distant n'a été ajouté** : les photos n'ont jamais transité par localStorage, et un service
d'hébergement d'images aurait imposé un compte, une configuration dans le bundle et un second chemin
de sauvegarde pour un problème qui ne se pose pas.

**Sauvegarde**

Les repas partent dans l'export JSON ; leurs photos non, pour la même raison que la rétention les
efface. Un import restaure les chiffres et laisse les vignettes derrière.

**Modèles**

`qwen/qwen3.8-27b` par défaut sur Groq, avec `qwen/qwen3.6-27b` en secours automatique si le premier
disparaît du catalogue. Les identifiants de modèles hébergés sont renommés et retirés sans préavis, et
une version qui en épingle un est une version qui cesse de marcher au calendrier de quelqu'un d'autre.
Un modèle saisi à la main n'est jamais remplacé : le secours existe pour le défaut intégré, pas pour
contredire un choix délibéré.

Ces modèles raisonnent avant de répondre, ce qui a deux conséquences : le budget de tokens est fixé à
2048 pour qu'une réponse ne soit pas tronquée, et l'extracteur JSON parcourt **tous** les objets
équilibrés de la réponse plutôt que du premier `{` au dernier `}` — un préambule de raisonnement
contient ses propres accolades.

**Contraintes du fournisseur, tenues par un faux service**

L'appel réel n'est pas joignable depuis l'environnement de développement, ce qui a laissé passer deux
requêtes malformées jusqu'au téléphone. `tools/mock-vision.mjs` répond donc au même format **et refuse
ce que le vrai service refuse** : mode JSON sans le mot « json » dans les messages, identifiant de
modèle inconnu, requête au-delà de 20 Mo, plus de trois images. Chaque contrainte de la documentation
a par ailleurs son test unitaire, pour qu'aucune ne reparte en silence.

Valeurs suivies : `temperature` à 0,5 — bas de la fourchette 0,5–0,7 documentée, la constance étant ce
qu'on cherche pour lire une assiette — et `max_completion_tokens` à 2048, le double du défaut, parce
que ces modèles raisonnent avant de répondre et qu'une réponse tronquée est illisible.

**Chaîne de services**

Plusieurs services peuvent être configurés et sont essayés dans l'ordre. Un quota atteint devient une
pause de quelques secondes plutôt qu'un repas perdu. Le cumul sert au **repli**, pas à la moyenne :
deux modèles ne divergent pas sur *quoi*, ils divergent sur *combien*, et moyenner deux estimations de
portion ne corrige pas un biais — ça double le coût pour une impression de rigueur.

### 6.7 Cible calorique (jalon 7)

**Deux erreurs, et pourquoi elles étaient invisibles**

La première version calculait `poids_lissé × 30 kcal/kg`. Deux choses clochaient, et un coefficient
unique les cachait toutes les deux :

1. **30 kcal/kg pour quelqu'un de sédentaire, c'est le maintien**, pas un déficit — alors que la
   documentation du module en revendiquait un.
2. **Un coefficient qui ne connaît que le poids ne peut pas savoir**. Pour 78,3 kg il donnait 2400 ;
   Mifflin-St Jeor avec taille et âge donne 2050 à 2250 selon l'activité. L'écart, ~300 kcal/jour,
   **fait la taille du déficit lui-même**.

D'où la forme actuelle : trois nombres visibles à l'écran plutôt qu'un coefficient opaque.

```
dépense au repos  = Mifflin-St Jeor(poids, taille, âge, sexe)
maintien          = dépense au repos × facteur d'activité
cible             = arrondi_50(maintien × (1 − déficit))
```

**Repli assumé** — sans taille ni année de naissance, l'app estime la dépense au repos à
`poids × 22 kcal/kg` et **l'écrit à l'écran, en nommant les champs manquants**. Un *taux de repos*
et non un maintien fini, pour que le facteur d'activité s'applique dans les deux cas : un repli qui
ignorait l'activité faisait bouger le sélecteur sans changer le chiffre, et un interrupteur qui ne
fait rien est pire qu'un interrupteur absent. 22 kcal/kg tombe à quelques kcal de ce que donne
Mifflin-St Jeor pour un adulte moyen au même poids.

**Déficit** — 10 % par défaut, réglable (0, 10, 15, 20 %). Pas les 20–25 % d'une application
d'amaigrissement : l'objectif est la recomposition (§3.3), et un déficit marqué est la façon la plus
fiable d'arrêter de construire du muscle. C'est aussi le déficit qui tient un mauvais jour, ce qui est
toute la prémisse de l'app. Changer le déficit rebascule la cible en mode automatique — le régler et
le voir sans effet serait un piège.

**Le calcul est arrondi une seule fois**, à la fin. Retirer le déficit d'un maintien déjà arrondi
arrondit deux fois et dérive de 25 kcal sans raison.

**Profil facultatif** — taille, année de naissance et sexe ne sont demandés qu'une fois, dans les
réglages, et ne servent qu'à cette formule. Deux pièges rencontrés, tous deux couverts par le test de
bout en bout :

- Le sexe n'a **aucune valeur pré-sélectionnée**. Un contrôle qui affiche « Homme » sans l'avoir
  enregistré laisse le profil incomplet tout en paraissant rempli.
- Les champs numériques **ne s'enregistrent qu'à la perte du focus**. Borner à chaque frappe revient à
  borner un nombre à moitié tapé : saisir « 178 » commence par « 1 », qu'un plancher à 120 cm
  réécrivait en 120 — et le champ ne pouvait plus jamais être terminé.

Rien de tout cela ne remplace le vrai calibrage, que l'écran rappelle : ajuster après trois semaines,
en regardant ce que fait la courbe de poids.

---

### 6.8 Les trois sources d'un repas (décisions n°21 et n°22)

**Ce que chaque source garantit, et pourquoi `source` est stocké**

Un repas inscrit par code-barres porte la table nutritionnelle du fabricant : c'est une valeur
déclarée, pas une estimation. Une photo et une description portent une lecture de modèle, qui se
trompe surtout sur les portions. La différence ne se voit pas dans les chiffres — 162 kcal ressemble
à 162 kcal — donc elle est enregistrée dans `MealSource`, affichée en badge au journal, et disponible
à toute question ultérieure sur la provenance d'un nombre. `barcode` n'est pas `manual`, et `ai_text`
n'est pas `ai` : seul ce dernier peut être rejoué contre une image.

**Ce qui est écrit avant l'appel, et ce qui ne l'est pas**

La photo et la description sont écrites en base *avant* que la requête parte, et pour la même
raison : un repas pris dans un sous-sol sans réseau est un repas qui a eu lieu, et la file de reprise
doit pouvoir le récupérer après un onglet fermé. La description vit dans `hint`, le champ qui veut
déjà dire « ce que l'utilisateur a dit au modèle », si bien qu'une correction sur un repas texte est
simplement la nouvelle description. Un scan raté, lui, n'écrit rien : il se refait en une seconde, et
une file de recherches échouées dans le journal serait du bruit.

**Un seul prompt pour deux modalités**

Les règles nutritionnelles, le schéma JSON de sortie et le parseur sont communs à la photo et au
texte. Chaque modalité n'ajoute que le paragraphe qui décrit ce qu'elle regarde — les repères
d'échelle visuelle d'un côté, l'autorité des quantités données de l'autre. Un modèle de texte ment
exactement comme un modèle de vision : rien ne traverse cette frontière sans passer par
`parseAnalysis`. La précision donnée *avant* l'analyse et la correction donnée *après* sont la même
phrase et deux instructions différentes — une correction annule une lecture précédente, un contexte
n'en a aucune à annuler, et dire à un modèle d'écarter une lecture qui n'a pas eu lieu, c'est
l'inviter à l'inventer.

**Le décodeur, et pourquoi il n'est pas natif (décision n°23)**

`BarcodeDetector` est une API Chromium. Safari ne l'implémente pas, et sur iOS tous les
navigateurs reposent sur WebKit — donc aucun n'en dispose. Le plan d'origine interdisait toute
dépendance en s'appuyant sur l'idée fausse que Safari 17 la fournissait : sur iPhone, le bouton
« Code-barres » sortait avant même de demander la caméra et n'affichait que la saisie manuelle.

Le décodeur natif est donc utilisé là où il existe, et un décodeur WebAssembly est téléchargé là
où il manque. Il pèse 449 ko compressés, presque trois fois la coquille de l'app, ce qui décide de
tout le reste : il n'est jamais dans le bundle, il arrive au premier scan, et il est mis en cache
ensuite — la première lecture demande le réseau, les suivantes fonctionnent dans le métro. Il est
servi depuis notre propre origine et non depuis le CDN que la bibliothèque vise par défaut : une
app hors-ligne d'abord ne peut pas dépendre d'un tiers, et rien ici ne doit signaler à quiconque
qu'un scan a eu lieu.

**Ce qu'OpenFoodFacts ne garantit pas**

C'est une base communautaire : les champs sont facultatifs, les unités varient, et un produit peut
exister avec un nom et rien d'autre. Un code inconnu répond `200` avec `status: 0`, jamais un `404`.
L'énergie arrive parfois en kilojoules seulement. Une fiche sans énergie, ou sans aucune des trois
macros, est **refusée** plutôt que présentée à zéro — une fiche pleine de zéros serait un mensonge
avec un bouton dessus. Une macro isolée qui manque est comptée à zéro *et signalée* à l'écran :
l'utilisateur a le droit de savoir que « 0 g de glucides » était une absence.

---

### 6.9 L'écran Nutrition, calories d'abord (décisions n°24 et n°25)

L'écran menait par les protéines : un grand anneau, la carte Calories en dessous, quatre boutons de
saisie, un journal chronologique. Il répondait à « qu'est-ce que j'ai mangé », jamais à « est-ce que
je peux encore me le permettre ce soir ».

**Le bandeau chiffré**

Trois chiffres en haut, dans l'ordre où on les lit : **consommées · ce qu'il reste · protéines**. Les
calories prennent l'anneau, les protéines passent en chiffre latéral mais **gardent l'accent lime** —
c'est toujours le nombre dont cette app parle.

Dépasser reste une information, jamais un échec. L'anneau plafonne à 100 % au lieu de virer au rouge,
et le centre change de légende : « 95 au-dessus » plutôt que « 0 restantes » ou un négatif. Même règle
que l'anneau protéines suivait déjà.

Les macros vivent en trois jauges de 4 px, dépliables en trois anneaux accompagnés du raisonnement
derrière les cibles. Le détail se lit une fois par jour ; les kcal restantes se lisent à chaque
ouverture de l'onglet.

Une pastille rappelle la **consistance sur 7 jours** — pas une série de jours. « Un pourcentage
glissant, jamais une série » est un principe du produit (§3), et une série est exactement le compteur
qu'une semaine ratée remet à zéro.

**Les deux cibles dérivées** (décision n°25)

```
cible_repas   = arrondi_10(cible_jour × part)      part : 25 / 40 / 30 / 5 %
reste         = max(0, cible_jour − cible_prot × 4)
cible_glucides = arrondi_5(reste × 0,55 / 4)
cible_lipides  = arrondi_5(reste × 0,45 / 9)
```

Les protéines restent la seule cible que l'app calcule vraiment (décision n°11) ; les deux autres sont
ce qu'il reste du budget. D'où les deux garde-fous : une cible protéines qui mange tout le budget rend
**zéro**, jamais un gramme négatif affiché avec aplomb, et un dénominateur nul **disparaît de
l'écran** au lieu d'inventer une cible.

**La navigation de jour**

`‹ Aujourd'hui ›`, et les écritures atterrissent sur le jour regardé. Deux règles :

- « jour suivant » s'arrête à aujourd'hui. Il n'y a rien à loguer demain, et un bouton qui mène à un
  jour incapable de rien contenir est un bouton qui ment.
- La purge des photos de repas reste ancrée au **vrai** aujourd'hui. Remonter la semaine ne doit pas
  faire glisser la fenêtre de rétention avec elle et supprimer des photos encore dedans.

**Le journal par repas**

Quatre créneaux, toujours affichés, **vides compris** : `0 / 560 kcal` est exactement le point d'un
budget par repas.

Le piège du double comptage (§6.6) tient et se déplace : un repas qui porte des protéines possède son
`ProteinLog`, et c'est le repas qu'on montre. Mais ses grammes comptent **dans le créneau du repas**,
pas à l'heure où le log a été écrit — un dîner photographié à minuit reste un dîner. Les protéines
viennent donc toujours du registre, si bien que la somme des quatre groupes fait exactement le total
du bandeau. Un repas encore en analyse n'entre dans aucun total : ses chiffres ne sont pas encore des
chiffres.

Un dépassement de repas se dit sans rouge et sans reproche : « au-dessus du repas — c'est la journée
qui compte ».

**La feuille d'ajout unique**

Quatre feuilles séparées et une rangée de quatre boutons deviennent **le `+` d'un repas**, avec cinq
onglets : Recherche · Ajout rapide · Photo · Décrire · Code-barres.

Le gain n'est pas le rangement, c'est l'ordre des questions. **Le repas est décidé avant, pas après.**
L'ancien écran demandait « c'était quel repas ? » en dernier, dans l'éditeur, au moment où la réponse
est la moins disponible.

« Vos habitudes » liste les repas des 30 derniers jours, dédoublonnés sur le libellé et filtrés à la
frappe. Quelqu'un qui prend le même petit-déjeuner quatre fois par semaine ne devrait pas le
photographier quatre fois ; les macros du plus récent gagnent, c'est la lecture qu'il a corrigée en
dernier.

Le créneau visé survit à la feuille : prendre une photo passe la main à la caméra de l'OS, et la fiche
produit s'ouvre par-dessus. Les deux vivent plus longtemps que la feuille qui les a lancés et doivent
quand même atterrir sur le bon repas.

---

## 7. Architecture applicative

```text
src/
├── app/
│   ├── router.tsx              # HashRouter, routes, layout
│   └── providers.tsx           # thème, error boundary
├── components/
│   ├── ui/                     # primitives shadcn/ui (button, card, sheet, progress…)
│   ├── charts/                 # LineChart et Ring, dessinés à la main (décision n°9)
│   └── shared/                 # BottomNav, ScreenHeader, QuickActionFab, EmptyState
├── features/
│   ├── floor/                  # module 1 : composants, store, logique, tests
│   ├── nutrition/              # module 3 — bandeau, navigation de jour, journal par repas
│   ├── workouts/               # module 2
│   ├── trends/                 # module 4
│   ├── meals/                  # module 5 — capture, correction, feuille d'ajout à onglets
│   │   └── add/                # les cinq routes d'ajout, sous un seul point d'entrée
│   └── vision/                 # réglages de service et de clé
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
│   ├── image.ts                # redimensionnement et conversion WebP
│   ├── bmi.ts                  # IMC, sa catégorie, sa position sur la réglette
│   ├── format.ts               # nombres à la française : virgule, milliers, delta signé
│   ├── llm/
│   │   ├── client.ts           # transport OpenAI-compatible : clés, endpoints, modalités
│   │   └── meal.ts             # les deux lectures d'un repas, photo et texte
│   ├── off/
│   │   ├── product.ts          # parseur OpenFoodFacts, pur : kJ, portions, macros absentes
│   │   ├── client.ts           # requête v2, erreurs typées
│   │   └── barcode.ts          # somme de contrôle EAN, détecteur natif ou WASM à la demande
│   └── vision/
│       ├── prompt.ts           # consignes partagées par les deux modalités
│       ├── schema.ts           # validation stricte de la réponse du modèle
│       └── providers.ts        # façade historique, ré-exporte llm/
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
- Toute réponse d'un service externe passe par un parseur avant d'atteindre la base. `lib/vision/schema.ts`
  est la seule porte d'entrée : rien n'est casté, tout est validé.

**Répartition du stockage** (décision n°3)

| Donnée | Support | Justification |
|---|---|---|
| Réglages, profil, cible protéines | Zustand persist / localStorage | Petit, lu à chaque rendu, synchrone |
| Définitions des habitudes plancher et ancres | Zustand persist / localStorage | Peu volumineux, modifié rarement |
| Préférences UI (dernier onglet, sections repliées) | Zustand persist / localStorage | Confort, perte sans gravité |
| Logs quotidiens, protéines, séances, séries | Dexie / IndexedDB | Croissance illimitée, requêtes par plage de dates |
| Mesures | Dexie / IndexedDB | Historique long |
| Photos | Dexie / IndexedDB (`ArrayBuffer`) | Volumineux, incompatible localStorage |
| Repas et leurs macros | Dexie / IndexedDB | Croissance illimitée, requêtes par plage de dates |
| Photos de repas | Dexie / IndexedDB, table séparée | Lues à l'ouverture d'un repas, pas à chaque rendu ; effacées par la rétention sans toucher aux chiffres |
| Clés API des services de vision | Zustand persist / localStorage | Jamais dans le bundle (décision n°16) ; lues au moment de l'appel |

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
├── 🥗 Nutrition     Compteur 1-tap, journal du jour, catalogues derrière « Que manger ? »
├── 🏋️ Séances       Séance rapide, séries du jour, circuit et timer de repos
└── 📈 Progression   Consistance, poids, force, tour de taille, séances passées, photos

[ Bouton d'action flottant, présent sur les 4 onglets ]
└── Feuille rapide : « +30 g protéines » · « +1 série » · « Valider le plancher » · « Enregistrer une pesée »

[ Réglages ] accessible par l'icône en haut à droite du Dashboard — 6 rubriques, une sous-page chacune
├── Objectifs        Cible protéines, cible calorique et déficit, taille, année, sexe, activité
├── Habitudes        Plancher et empilées : réordonner, modifier, historique, archiver, restaurer
├── Séances          Timer de repos, catalogue de mouvements
├── Analyse photo    Service de vision, clé, modèle, test, rétention des photos de repas
├── Données          Stockage et persistance, export/import, version de schéma
└── Application      Haptique, sons, revoir l'introduction, à propos
```

L'ordre des onglets suit la fréquence d'usage d'une journée (décision n°18). Le renommage
« Tendances » → « Progression » ne déplace pas la route `/trends`.

L'onglet Aujourd'hui est la racine. Un retour à froid sur l'app y atterrit toujours.

---

## 10. Design system et UX

- **Dark mode par défaut**, unique thème en V1. Fond quasi noir, surfaces légèrement élevées, un seul
  accent vif réservé aux actions et à la progression.
- **Contraste** : AA minimum sur tout texte, AAA sur les chiffres clés du Dashboard.
- **Cibles tactiles** : 48×48 px minimum, 56 px pour les boutons de log rapide. L'échelle `touch`
  doit exister sur `height`/`width` **et** sur `minHeight`/`minWidth` dans `tailwind.config.js` :
  déclarée sur les seules variantes minimales, `h-touch` ne génère rien et le bouton s'écrase à la
  taille de son icône, sans erreur nulle part. Gardé par un test qui compile les utilitaires.

  **Le dessin peut être plus petit que la cible, jamais l'inverse.** Le handoff de l'écran Nutrition
  dessine le « + » d'un repas en 32 px ; il fait 32 px de lime **à l'intérieur** d'un bouton de 48 px.
  Même arbitrage sur les lignes d'aliments du journal, dessinées comme un relevé compact : elles font
  48 px de haut en gardant leur typo de 12 px, parce que chacune ouvre l'éditeur et qu'une lecture
  fausse doit rester corrigible. La compacité cède, la règle ne bouge pas.
- **Sections plutôt que cartes** : un écran est une colonne de sections à plat, chacune une mesure
  ou une action. Les cartes sont réservées à ce qui est vraiment un objet — la carte « Maintenant »,
  un bloc de séance. Six cartes de poids égal font d'un écran un défilement, pas une lecture.
- **Une seule maison par donnée** : un chiffre est saisi et détaillé à un seul endroit ; les autres
  écrans n'en montrent qu'un résumé tapable qui y mène (décision n°18).
- **Décimales** : virgule, jamais le point. Un nombre JavaScript rendu tel quel dans du texte
  français écrit « 78.4 » ; `formatDecimal` est le seul chemin vers l'affichage.
- **Milliers** : espace fine insécable (U+202F), par `formatCount`. `1850` est une suite de chiffres,
  `1 850` est un nombre qu'on lit d'un coup d'œil. Le groupage vient d'`Intl.NumberFormat('fr-FR')` —
  c'est l'affaire d'une locale, pas la nôtre — puis est normalisé : un ICU ancien rend U+00A0, et un
  chiffre ne doit pas changer de largeur d'un téléphone à l'autre.
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

- Synchronisation cloud, comptes utilisateurs, backend de quelque nature. L'analyse de photo appelle
  un service tiers depuis la page avec la clé de l'utilisateur — c'est un appel sortant, pas un
  backend : rien de l'app n'est hébergé ailleurs, et l'app entière fonctionne sans lui.
- Notifications push ou locales (décision n°6). Réexaminé le 23/08/2026 : maintenu, avec deux
  contournements sans serveur documentés en annexe B.
- Chiffrement des photos et code PIN (décision n°7).
- ~~Suivi calorique complet~~ — **levé le 27/08/2026, voir décision n°15 et §6.6.**
  ~~Scan de code-barres~~ — **levé le 28/08/2026, voir décision n°21 et §6.8.** Reste
  exclu : la base alimentaire embarquée. OpenFoodFacts est interrogé à la demande, rien
  n'est stocké ni maintenu ici — c'est un appel sortant, comme les services de vision.
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
| Estimation calorique fausse et crue sur parole | Décisions alimentaires sur un mauvais chiffre | Confiance affichée, détail corrigible ligne par ligne, totaux recalculés depuis le détail. L'erreur dominante est la portion : le prompt y consacre ses consignes |
| ~~Le service de vision refuse les appels depuis le navigateur (CORS)~~ | — | **Écarté le 27/08/2026** : Groq répond bien à un appel cross-origin depuis la page. Le bouton « tester la clé » reste la façon de le revérifier si un service change de politique |
| Un identifiant de modèle est retiré par le fournisseur | Analyse cassée du jour au lendemain | Un 404 est distingué d'une panne et déclenche un repli automatique sur un modèle de secours, une fois. Un modèle saisi à la main n'est jamais remplacé. Le message dit « modèle introuvable », pas « erreur du service » |
| Clé API exposée | Facturation détournée | Jamais dans le bundle ni dans git (décision n°16). Saisie locale, retirable en un tap |
| Abandon du suivi calorique | Module mort dans l'app | Additif par construction : aucun autre écran n'en dépend, et la saisie manuelle survit sans clé |

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

---

## Annexe B — Rappels : pourquoi il n'y en a pas, et par où passer si on en veut

**Statut** : décision n°6 maintenue. Question rouverte le 23 août 2026, tranchée à nouveau dans le même
sens. Cette annexe existe pour que la question ne soit pas re-instruite depuis zéro la prochaine fois.

### La raison produit

Une app anti-burnout qui relance sur le téléphone se retourne contre son propre principe. Le §15 le dit
déjà : le risque « abandon après 3 semaines » est mitigé par « aucune notification qui transforme l'app
en source de culpabilité ». Une notification manquée devient une dette ; trois deviennent une raison de
désinstaller. Tout le reste du produit est construit là-dessus — score élastique sans reset, plancher
volontairement ridicule, pesée suggérée et jamais imposée.

### La raison technique : le mur du « zéro serveur »

Même en changeant d'avis sur le produit, il n'existe aujourd'hui **aucun moyen d'envoyer un rappel
programmé depuis une PWA sans backend**. Les quatre pistes, et pourquoi aucune ne tient :

| Piste | État | Verdict |
|---|---|---|
| **Web Push** (Push API + VAPID) | Fonctionne sur iOS 16.4+ pour une PWA ajoutée à l'écran d'accueil, et sur Android | Exige un service de push **et** un serveur applicatif qui déclenche l'envoi. Donc backend, donc compte, donc des données qui sortent de l'appareil |
| **Notifications API seule** (`new Notification()`) | Disponible partout | Ne se déclenche que pendant qu'une page ou un service worker est vivant. Inutilisable comme rappel : il faudrait que l'app soit déjà ouverte |
| **Notification Triggers** (`TimestampTrigger`) | Origin trial Chrome ~83-86, jamais passé en stable, abandonné | C'était *exactement* l'API qu'il aurait fallu — une notification programmée localement, sans serveur. Elle n'existe pas |
| **Periodic Background Sync** | Chrome/Android uniquement, absent de Safari et Firefox | Le navigateur décide de la fréquence selon son propre score d'engagement ; l'intervalle demandé n'est qu'un indice. Et rien sur iOS, qui est la cible |

Conclusion : notifications = backend. C'est une contradiction directe avec la décision n°1 du §14
(« Synchronisation cloud, comptes utilisateurs, backend de quelque nature ») et avec la promesse de
vie privée du §1.

### Les deux options qui ne cassent rien

**Option A — export d'un fichier `.ics` (recommandée).**
Un bouton dans les Réglages produit un fichier calendrier à importer une fois, contenant un `VEVENT`
avec `RRULE:FREQ=DAILY` et un `VALARM`. Le rappel est ensuite géré par le calendrier du système.

- Aucun serveur, aucune permission de notification demandée, rien qui sorte de l'appareil.
- Réutilise la mécanique de téléchargement déjà écrite pour l'export JSON (`features/backup/useBackup.ts`).
- Coût estimé : un générateur de chaîne `.ics` d'une trentaine de lignes, un bouton, une chaîne i18n.
- **Limite assumée** : le rappel n'est pas conscient de l'app. Il sonnera même si le plancher est déjà
  validé. C'est le prix du zéro-serveur, et c'est acceptable pour un plancher qui se fait en 30 secondes.

**Option B — API Badging (`navigator.setAppBadge`).**
Une pastille sur l'icône de l'app installée quand le plancher du jour n'est pas fait.

- Supporté sur Chrome et sur iOS 16.4+ pour une PWA à l'écran d'accueil.
- **Limite qui la disqualifie presque** : la pastille ne peut être posée ou retirée que pendant que
  l'app tourne — sans push, il n'y a pas d'autre moment d'exécution. Elle se figerait donc sur l'état
  du dernier lancement et afficherait, deux jours plus tard, un rappel pour un jour révolu. Un chiffre
  faux est pire qu'un chiffre absent.

**Recommandation** : l'option A, ou rien.

### Si la décision n°6 est renversée malgré tout

Ce n'est pas un ajout de fonctionnalité, c'est un changement d'architecture. À mettre à jour en même
temps, sous peine d'incohérence du PRD :

1. Décision n°6 (§2) et la ligne correspondante du §14.
2. La première ligne du §14 : un backend cesse d'être hors périmètre.
3. La promesse « aucune requête réseau au runtime » du §1 et du README.
4. La ligne « abandon après 3 semaines » du §15, dont la mitigation repose explicitement sur l'absence
   de notification.
