# Handoff — Refonte RecompOS (design, ergonomie, compréhension)

## Vue d'ensemble

RecompOS est une PWA personnelle de recomposition corporelle (dark-only, français, hors ligne, sans compte). L'app existante fonctionne mais « part dans tous les sens » : des données dupliquées entre écrans (poids sur Aujourd'hui + Tendances + Réglages, consistance sur Aujourd'hui + Tendances, protéines sur Aujourd'hui + Nutrition), une densité de chiffres sans hiérarchie, et un écran Réglages à 11 cartes à plat.

Cette refonte réorganise les mêmes fonctionnalités. **Aucune feature n'est supprimée.** Les quatre décisions structurantes :

1. **Une seule maison par donnée.** Chaque chiffre est saisi et détaillé à un seul endroit. Aujourd'hui n'en montre que des résumés tapables qui mènent au détail.
2. **Aujourd'hui répond à « que me reste-t-il à faire ».** Un compteur de plancher, puis **une seule habitude à la fois**, et un état « journée validée » calme quand tout est fait.
3. **Réglages devient une liste de 6 rubriques → sous-pages.**
4. **Onglets renommés et réordonnés** : Aujourd'hui · Nutrition · Séances · Progression (« Tendances » → « Progression »).

Le FAB et ses 4 actions rapides sont conservés tels quels : c'est le raccourci global assumé, les écrans gardent leur saisie complète.

## À propos des fichiers de design

Les fichiers de ce dossier sont des **références de design réalisées en HTML** — des prototypes qui montrent l'apparence et le comportement visés, **pas du code de production à copier**. Le travail consiste à **recréer ces écrans dans le codebase existant** (`sofiakb/recompos` : React 18 + TypeScript + Vite + Tailwind + Dexie + Zustand), avec ses patterns établis : composants `src/components/ui/*`, chaînes dans `src/i18n/fr.ts`, accès aux données par les repositories de `src/db/repositories/*`, jamais Dexie depuis un composant.

Deux fichiers :

- `RecompOS actuel.dc.html` — **recréation fidèle de l'état actuel** des 5 écrans, faite depuis le code source. Sert de point de comparaison, rien n'y est à implémenter.
- `RecompOS refonte.dc.html` — **la cible**. 12 vues + onboarding + 6 feuilles de saisie.

Les prototypes utilisent des styles inline et un état local factice ; le codebase a déjà les primitives équivalentes (`Button`, `Card`, `Sheet`, `Segmented`, `Progress`, `ToggleRow`, `Input`, `Field`, `LineChart`). **Composer avec elles**, ne pas réimplémenter les styles inline du prototype.

## Fidélité

**Haute fidélité (hifi).** Couleurs, typographie, espacements et tailles de cible sont définitifs et proviennent des tokens réels de l'app (`src/index.css`). Les icônes sont les vraies icônes lucide déjà utilisées. Les textes sont ceux de `src/i18n/fr.ts` quand ils existent (voir « Nouvelles chaînes » plus bas pour les ajouts).

À recréer au pixel, avec les composants du codebase.

---

## Tokens de design

Inchangés — ceux de `src/index.css`, thème sombre unique. Ne jamais écrire de hex ni de couleur Tailwind brute (`bg-zinc-900`, `text-white`) : uniquement les noms sémantiques.

| Token | HSL | Usage |
| --- | --- | --- |
| `--background` | `240 6% 4%` | fond de page |
| `--foreground` | `0 0% 98%` | texte principal |
| `--card` | `240 5% 8%` | surface de carte |
| `--muted` | `240 4% 13%` | pistes de barres, fond de Segmented |
| `--muted-foreground` | `240 5% 65%` | texte secondaire |
| `--border` / `--input` | `240 4% 16%` | filets, bordures de champ |
| `--primary` / `--ring` | `82 78% 55%` | accent lime, focus |
| `--primary-foreground` | `240 10% 5%` | texte sur accent |
| `--secondary` | `240 4% 13%` | boutons secondaires |
| `--accent` | `240 4% 16%` | survol |
| `--destructive` | `0 62% 50%` | suppressions |
| `--radius` | `0.875rem` (14 px) | cartes, boutons |

**Typographie** — pile système (`ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif`).

| Rôle | Taille / poids |
| --- | --- |
| Chiffre héros (compteur plancher) | 56 px / 600, `line-height:.9`, `letter-spacing:-.03em` |
| Chiffre de section (poids, force, taille) | 32 px / 600 |
| Titre d'écran (`h1`) | 28 px / 600, `letter-spacing:-.02em` |
| Titre de sous-page | 24 px / 600 |
| Titre de carte | 18–20 px / 600 |
| Corps | 15 px / 400 |
| Secondaire | 13–14 px, `--muted-foreground` |
| Étiquette de section | 12 px, `letter-spacing:.1em`, `text-transform:uppercase`, `--muted-foreground` |
| Micro-légende | 11–12 px |

**Espacements.** Gouttière d'écran 20 px (contre 16 px aujourd'hui). Entre sections : 28 px (Aujourd'hui, Nutrition, Séances) et 32 px (Progression). Dans une carte : 14–16 px. Padding de carte 16 px. `padding-bottom` du conteneur scrollable : 140 px pour dégager nav + FAB.

**Cibles tactiles.** 48 px minimum, sans exception (`min-h-touch`). Les rangées de Réglages → Habitudes de l'app actuelle utilisent des boutons 36 px : à corriger dans l'implémentation.

**Nombres.** Classe `tnum` sur tout chiffre qui change. Espace fine insécable dans les nombres (`2 140 kcal`) et avant `:` `?` `!`.

---

## Écrans

### 1. Aujourd'hui (`/`)

Répond, dans cet ordre : que me reste-t-il à faire, où j'en suis sur les protéines, ma consistance.

**Structure** — colonne `flex`, `gap:28px`, `padding:24px 20px 0`.

1. **En-tête.** `flex`, `align-items:flex-start`, `justify-content:space-between`. À gauche : date en étiquette majuscule (« Jeudi 27 août »), puis `h1` « Jour 42 » (28 px/600). À droite : bouton Réglages 48×48, icône lucide `settings` 22 px, `--muted-foreground`, survol `--accent`.
2. **Compteur de plancher.** `flex`, `align-items:flex-end`, `justify-content:space-between`. À gauche : `X` en 56 px/600 suivi de ` / Y` en 24 px/500 `--muted-foreground`. À droite, aligné à droite, `max-width:150px` : « habitudes du plancher validées » (13 px, secondaire). Dessous, `gap:6px` : une barre par habitude du plancher, `flex:1`, `height:6px`, `border-radius:9999px`, `--primary` si validée sinon `--muted`.
3. **Carte « Maintenant »** — visible tant qu'il reste une habitude de plancher. Bordure `hsl(var(--primary)/.4)`, fond `--card`, radius `--radius`, `padding:16px`, colonne `gap:14px`. Contenu : étiquette « Maintenant » (11 px, majuscule, `--primary`) ; titre de l'habitude (18 px/600, `text-wrap:pretty`) ; puis deux boutons empilés pleine largeur — **Fait** (primary, 48 px, icône lucide `check` 18 px stroke-width 3, `active:scale(.98)`) et **Plus tard** (ghost, 48 px, `--muted-foreground`).
   - « Fait » sur une habitude en mode `protein_portion` **n'valide pas directement** : elle ouvre la feuille « Quelle source de protéines ? » (voir Feuilles). C'est le comportement existant de `FloorCard` + `ProteinPortionSheet`, ici déplacé dans le héros.
   - « Plus tard » ne fait que passer à la suite (aucune donnée écrite).
4. **Carte « Journée validée »** — remplace la carte « Maintenant » quand le plancher est complet. Même bordure accent. Pastille 32×32 `--primary` avec `check`, titre « Journée validée » (20 px/600), puis « La journée compte. Tout le reste est du bonus. » (`t.today.floorDoneHint`). Rien à faire : pas de bouton.
5. **Liste du plancher** — récapitulatif toujours accessible (décocher doit rester possible). Une rangée par habitude : puce ronde 22 px (bordure 2 px `--primary` + fond `--primary` + `check` si validée, sinon bordure `hsl(var(--muted-foreground)/.4)`), titre 15 px (barré + `--muted-foreground` si validée), état à droite (« fait » / « à faire », 12 px). Rangée `min-height:48px`, filet `--border` en bas.
6. **« En plus »** (habitudes empilées) — étiquette de section, puis des chips en `flex-wrap`, `gap:8px` : `min-height:48px`, `border-radius:9999px`, `padding:0 16px`. Validée = bordure `hsl(var(--primary)/.35)`, fond `hsl(var(--primary)/.08)`, `check` 14 px `--primary`, texte `--foreground`. Non validée = bordure `--border`, fond transparent, texte `--muted-foreground`.
7. **Deux résumés tapables** — pas de saisie ici, seulement la lecture et le lien vers le détail.
   - *Protéines* → onglet Nutrition. Rangée `min-height:64px` : « Protéines » (14 px secondaire) à gauche, `128 / 165 g` à droite (15 px/600, le dénominateur en 400 secondaire), une barre de 4 px sous les deux, chevron `chevron-right` 18 px.
   - *Consistance* → onglet Progression. Rangée `min-height:56px` : « Consistance », `86 % sur 7 j`, chevron.
8. **Bouton « Démarrer le circuit 20 min »** — secondary, 56 px, icône `dumbbell` 20 px. Mène à l'onglet Séances (ou reprend la séance en cours, comportement actuel de `TodayScreen.onStartWorkout`).

**Ce qui disparaît d'Aujourd'hui** (sans disparaître de l'app) : la carte de pesée hebdomadaire (→ FAB et Progression), la strip de consistance à deux scores (→ Progression), la liste des entrées de protéines (→ Nutrition), la carte « Habitudes empilées » complète (→ chips).

### 2. Nutrition (`/nutrition`)

Haut : où j'en suis + saisie rapide. Bas : le journal du jour. Les catalogues passent derrière un bouton.

Colonne `gap:28px`, `padding:24px 20px 0`.

1. **En-tête** — date en étiquette, `h1` « Nutrition ».
2. **Anneau** — 200×200, `stroke-width:12`, rayon 90, `stroke-dasharray:565.5`, rotation −90°, piste `--muted`, arc `--primary`, `stroke-linecap:round`. L'arc plafonne à 100 % pendant que les chiffres continuent (comportement existant de `ProteinRing`). Au centre : total en 44 px/600, « sur 165 g » en 14 px secondaire, « encore 37 g » / « Cible atteinte » en 13 px `--primary`. Sous l'anneau, centré : provenance de la cible (« Calculé sur 78,4 kg × 1,8 g/kg » / « Cible ajustée à la main » / « Cible provisoire — ajoute ton poids pour la calculer »).
3. **Saisie rapide** — grille 4 colonnes, `gap:8px`, boutons `min-height:60px` : `+20`, `+30`, `+40` en primary (valeur 17 px/600 au-dessus d'un « g » 11 px opacité .8), puis un bouton secondary `plus` qui ouvre la feuille Montant libre. Chaque ajout est annulable par toast (comportement existant).
4. **Deux boutons côte à côte**, `min-height:56px` : **« Que manger ? »** (outline) → sous-page Catalogues ; **« Un repas »** (secondary, icône `camera`) → feuille Détail du repas / capture photo.
5. **Calories** — étiquette « Calories » + `1 620 / 2 140 kcal` sur la même ligne, barre 6 px, puis une ligne de macros `P 128 g · G 152 g · L 54 g` en 13 px secondaire (`gap:16px`). Version condensée de `CalorieCard` : plus de trois barres de macros empilées. Si le total dépasse la cible, la barre passe en `--muted-foreground` et le libellé devient « X kcal au-dessus » (comportement existant).
6. **Le journal du jour** — une seule liste chronologique, protéines **et** repas mêlés, la plus récente en haut. Rangée `min-height:56px` : heure (44 px de large, 12 px secondaire), libellé 15 px/500 + méta 12 px secondaire (source, kcal, badge « corrigé » / « manuel »), valeur `+40 g` à droite (14 px/600). Tap → feuille d'édition correspondante (entrée de protéines ou repas).

**Sous-page Catalogues** (« Que manger ? ») — en-tête avec flèche retour + `h1`, puis un `Segmented` à deux options : **Dans le frigo** / **En livraison**.
- *Dans le frigo* : `ZeroCookCatalog` — case à cocher de stock 22 px (radius 6 px), nom + portion, pastille `+ N g` (`border-radius:9999px`, fond `--secondary`, texte `--primary`, 48 px de haut) qui logue. Bouton « Ajouter une source ». Le mode « Gérer la liste » de l'existant reste (édition/suppression par rangée).
- *En livraison* : une carte par cuisine (bordure `--border`, radius `--radius`, `padding:16px`) : cuisine 15 px/600 + pastille `~N g`, ligne « à prendre » avec `check` `--primary`, ligne « à éviter » avec `x` secondaire. Bouton « Ajouter une cuisine ». Les filtres par cuisine de l'existant peuvent rester.

### 3. Séances (`/workouts`)

Deux états distincts.

**Hors séance** — colonne `gap:28px`.
1. En-tête : date + `h1` « Séances ».
2. **Carte du circuit** : titre « Circuit 20 min » (20 px/600), hint `t.workouts.circuitHint`, puis les 3 blocs — étiquette de groupe (96 px de large, 11 px majuscule secondaire), nom du mouvement 15 px/500, fourchette de reps 12 px `tnum`, bouton `repeat` 48×48 pour changer de mouvement. Bouton **« Démarrer le circuit »** primary 56 px, icône `play`.
3. Bouton outline 56 px **« Une série isolée, sans séance »** (icône `circle-plus`) — les micro-séries, sans carte dédiée.
4. **Séries du jour** — étiquette + rangées (mouvement, `12 reps — Poids du corps · Cible`, corbeille 40×40).
5. Rangée tapable **« Séances passées et index de force »** → Progression. L'historique n'existe plus qu'à un endroit.

**En séance** — colonne `gap:24px`, nav conservée, **FAB masqué**.
1. En-tête : « Séance en cours » (`--primary`) + chrono en 52 px/600 `tnum` ; à droite un bouton outline 48 px **« Terminer »** (icône `square`).
2. **Timer de repos** : carte `--card`, icône `timer`, libellé « Repos », temps restant 22 px/600 à droite, barre de progression 8 px, deux boutons 48 px `+30 s` / `Passer`. Le temps se calcule depuis un timestamp de départ, jamais en accumulant des ticks (`src/lib/timer.ts`) — un écran verrouillé ne doit pas voler de secondes.
3. **Les 3 blocs**, une carte chacun : groupe, mouvement 16 px/500, suggestion de surcharge 12 px, compteur `×N` en `--primary`, bouton **« Logguer »** 48 px qui ouvre la feuille Série.
4. Note de bas : d'où viennent les suggestions.

### 4. Progression (`/trends`)

Colonne `gap:32px`. Ordre : consistance, poids, force, tour de taille, séances passées, photos.

1. En-tête : « Depuis le 15 juillet » + `h1` « Progression ».
2. **Consistance** — `86 %` en 44 px/600, « de consistance sur 7 jours · solide » en 13 px, `71 % sur 30 j` aligné à droite. Puis la **heatmap 12 semaines** : 12 colonnes de 7 cases de 13×13 px, `gap:4px`, radius 3 px — validé `--primary`, manqué `--muted`, avant installation / futur transparent avec `box-shadow: inset 0 0 0 1px hsl(var(--border)/.5)`. Étiquette de mois au-dessus de la première colonne de chaque mois. Puis une phrase qui explique le glissant.
3. **Poids** — étiquette + delta `−1,2 kg` sur la même ligne, `78,4 kg lissés` en 32 px/600, `LineChart` (viewBox 320×140, aire dégradée `--primary` 0.28→0, ligne 2 px, point final 3 px, deux lignes de grille avec valeurs), bouton « Enregistrer une pesée » → feuille Pesée.
4. **Force** — index `118` en 32 px/600 + « +18 % de volume vs ta première semaine », `LineChart` identique, puis **Meilleures séries** (3 rangées, mouvement à gauche, `18 reps — Élastique noir` secondaire à droite). Le `Segmented` 4/8/12 semaines et le dépliant « Comment c'est calculé » de l'existant restent utiles : les garder.
5. **Tour de taille** — `86 cm` en 32 px/600, delta à droite, chart 320×100 avec la moyenne glissante en pointillés `--muted-foreground` (`stroke-dasharray:3 3`), bouton « Enregistrer une mesure ».
6. **Séances passées** — 3 rangées (date secondaire, type 12 px, durée `tnum`).
7. Rangée tapable **« Coffre photos »** (+ sous-titre « Face, profil, dos — sur l'appareil uniquement ») → sous-page.

**Sous-page Coffre photos** — retour + `h1`, phrase de confidentialité, `Segmented` Face/Profil/Dos, la grille de photos (état vide : « Aucune photo pour le moment. »), bouton « Ajouter une photo ». La comparaison première/dernière de `PhotoVault` reste.

### 5. Réglages (`/settings`)

Plus de 11 cartes à plat : une liste de rubriques, chacune une sous-page.

En-tête : flèche retour + `h1` « Réglages ». Puis 6 rangées `min-height:68px`, filet `--border`, titre 16 px/500 + sous-titre 12 px secondaire, chevron à droite :

| Rubrique | Sous-titre | Contenu |
| --- | --- | --- |
| Objectifs | Protéines, calories, ton corps | stepper protéines (±5 g) + provenance ; `Segmented` déficit (Maintien / −5 / −10 / −15 %) + stepper kcal (±50) ; taille, année de naissance, sexe, activité |
| Habitudes | 2 au plancher, 3 en plus | groupes Plancher / En plus, réordonner, éditer, archiver, restaurer |
| Séances | Timer de repos, mouvements | presets 60 s / 90 s / Autre ; accès à la liste des mouvements |
| Analyse photo | Clé API, modèle, rétention des photos | service, clé, modèle, actif, tester ; rétention des photos de repas |
| Données | Stockage, export, import | usage/quota, persistance, export JSON, import avec confirmation |
| Application | Haptique, sons, à propos | deux `ToggleRow`, « Revoir l'introduction », version, date d'installation, mention de confidentialité |

Pied de page : « Version 3.0 · installée le 15 juillet 2026. Tout reste sur cet appareil. Aucun compte, aucun serveur. »

**Deux déplacements à noter.** Le poids ne vit plus dans Réglages (il est dans Progression, avec le FAB pour saisir). La rétention des photos de repas rejoint la rubrique Analyse photo, avec ce qui la produit.

**Rangée d'habitude, dans Réglages → Habitudes.** Deux cibles de 48 px seulement : **Réordonner** (chevrons haut/bas empilés dans une seule icône) et **Modifier** (crayon) qui ouvre la feuille — l'historique et l'archivage y vivent. C'est un changement volontaire par rapport à l'existant, où cinq boutons de 36 px se partagent une rangée de 390 px.

### 6. Onboarding (3 écrans, une fois)

`padding:32px 24px 24px`, ni nav ni FAB. En haut : `1 / 3` en `tnum` 12 px et un bouton ghost « Passer ». Sous lui, 3 barres de 4 px (`--primary` jusqu'à l'étape courante, sinon `--muted`). Contenu centré verticalement. En bas : « Retour » (outline, à partir de l'étape 2) + « Suivant » / « Commencer » (primary 56 px, `flex:1`).

1. **Bienvenue** — tagline « Le système, pas la motivation. » (14 px/500 `--primary`), `h1` 30 px/600 « Pas de deadline. Pas de série à ne pas casser. », corps 15 px secondaire.
2. **Ton poids** — `h1`, corps, champ décimal 56 px (`inputMode="decimal"`, placeholder `80,5`) + « kg », puis « Ta cible de protéines » avec le stepper ±5 g et « Modifiable à tout moment dans les réglages. ».
3. **Ton plancher quotidien** — `h1`, corps, puis une rangée éditable par habitude du plancher : pastille `check` 28 px, champ texte 48 px, bouton `x` 48 px (masqué s'il ne reste qu'une habitude — un plancher vide rendrait toute journée invalidable).

Tout est pré-rempli : passer les trois écrans doit laisser une app utilisable.

---

## Feuilles de saisie (`Sheet`)

`Sheet` est le seul overlay de l'app. Fond `rgb(0 0 0 / .6)` + `backdrop-filter:blur(2px)`, panneau `--card`, `border-radius:16px 16px 0 0`, filet haut `--border`, `padding:16px 16px 24px`, poignée 40×4 px `--muted` centrée, `max-height:88%` scrollable, `animate-slide-up`, fermeture par Échap et par tap sur le fond. Le FAB est masqué quand une feuille est ouverte.

| Feuille | Ouverte par | Contenu |
| --- | --- | --- |
| **Quelle source de protéines ?** | « Fait » sur une habitude `protein_portion` | « Le choix est ajouté au total du jour. » puis les sources zéro-cuisson triées par grammes décroissants : nom + portion à gauche, pastille `N g` à droite. Le tap valide l'habitude **et** ajoute les grammes au total du jour. |
| **Montant libre** | bouton `+` de la saisie rapide | Valeur en 48 px/600 centrée + « g ». Pavé 3×4 : 1–9 secondary, `C` ghost, `0` secondary, retour arrière ghost. Bouton primary « Ajouter N g ». Un pavé et non un champ : le clavier système couvre la moitié de l'écran. |
| **Ton poids** | FAB, Progression | « À jeun de préférence, mais la régularité compte plus que le moment. », champ décimal 56 px + « kg », bouton primary. Validation 30–300 kg. |
| **Série** | « Logguer » d'un bloc, série isolée | Encart `hsl(var(--muted)/.6)` : « La dernière fois : 12 reps, Poids du corps » et la suggestion en `--primary`. Puis reps (− / champ 30 px/600 / +, boutons 48 px), « Charge ou élastique » (texte, placeholder « Poids du corps »), « C'était comment ? » (`Segmented` Facile / **Cible** / Difficile, Cible par défaut), bouton primary « Enregistrer la série ». À l'enregistrement : toast + démarrage du timer de repos. |
| **Détail du repas** | « Un repas », tap sur un repas du journal | Nom, `Segmented` Petit-déj / Déjeuner / Dîner / Collation. Encart « Ce n'est pas ça ? » : textarea + « Relancer avec cette précision » (relance l'analyse sur la même photo). Puis une carte par aliment : nom + corbeille 48 px, portion, grille 4 colonnes kcal / Prot. / Gluc. / Lip. (champs `tnum` centrés 48 px). « Ajouter un aliment », total recalculé en direct au-dessus du bouton, macros, « Les protéines de ce repas sont comptées dans le total du jour. », puis Enregistrer et Supprimer. **C'est le détail qui est éditable, pas le total** : « le riz c'était 200 g pas 300 » est une correction, « ce repas fait 620 et pas 780 » est une autre estimation. |
| **Modifier l'habitude** | crayon d'une rangée de Réglages → Habitudes | Intitulé, action visée, `Segmented` Type (Plancher / En plus), `Segmented` Catégorie (Séance / Nutrition / Mobilité), `Segmented` Validation (Case à cocher / Portion de protéines) + son hint. Puis, séparés d'un filet : « Historique — 38 validations au total » et « Archiver cette habitude ». Boutons Annuler / Enregistrer côte à côte. L'ancre (« Pendant que le café coule ») n'apparaît que pour une habitude « En plus ». |

**Toast** — inchangé : pastille `--card`, bordure `--border`, `border-radius:9999px`, positionnée au-dessus de la nav, avec action « Annuler » optionnelle en `--primary`.

---

## Interactions et comportements

- **Navigation** : 4 onglets + sous-pages. La nav est fixée en bas, `border-top --border`, fond `hsl(var(--background)/.95)` + `backdrop-filter:blur(8px)`, 4 items `min-height:56px` (icône 22 px + label 11 px), actif en `--primary`, inactif en `--muted-foreground`. L'onglet Nutrition reste actif sur la sous-page Catalogues, Séances reste actif pendant une séance.
- **Nav et FAB masqués** : pendant l'onboarding (les deux) ; sur les Réglages et pendant une séance (FAB seul) ; quand une feuille est ouverte (FAB seul).
- **Changement d'onglet** : remet le scroll en haut.
- **Validation d'une habitude** : optimiste, immédiate. Le compteur, les barres et la carte « Maintenant » se mettent à jour ensemble. Décocher reste possible depuis la liste récapitulative.
- **FAB** : « Valider le plancher » valide tout le plancher d'un coup (et demande la portion si une habitude en attend une) ; « +30 g de protéines » logue avec annulation ; « +1 série » ouvre la feuille Série ; « Enregistrer une pesée » ouvre la feuille Pesée.
- **Chaque ajout de protéines est annulable** quelques secondes via le toast.
- **Animations** : `animate-slide-up` pour les feuilles et le toast, `animate-pop-in` pour une puce qui se valide, `transition` 300 ms `ease-out` sur les largeurs de barres, 500 ms sur `stroke-dashoffset` de l'anneau, `active:scale(.98)` sur les boutons. Respecter `prefers-reduced-motion` (déjà géré dans `src/index.css`).
- **Journée à 4 h** : la journée logique bascule à 04h00, pas à minuit (`DAY_ROLLOVER_HOUR`). Rien ne change ici, mais tout « aujourd'hui » de l'UI en dépend.

## État

Rien de nouveau côté modèle de données : la refonte réorganise des vues sur l'état existant.

- **Zustand persisté** (`settingsStore`) : réglages, définitions d'habitudes, préférences.
- **Zustand éphémère** (`uiStore`) : toast, ouverture du FAB, demande de micro-série.
- **Dexie** : logs quotidiens, protéines, repas, séances, séries, mesures, photos — toujours via les repositories.
- **État local d'écran** à prévoir : onglet du `Segmented` de Catalogues (frigo / livraison), feuille ouverte et son contexte, étape d'onboarding, brouillons de feuille (reps, montant du pavé, lignes de repas).
- **Dérivés** : habitude suivante = première du plancher non validée ; `allDone` = plancher complet ; pourcentage de l'anneau plafonné à 100 ; barres du plancher = une par habitude.

## Nouvelles chaînes à ajouter à `src/i18n/fr.ts`

Aucun texte en dur dans un composant. Les ajouts de la refonte :

- « habitudes du plancher validées » (légende du compteur)
- « Maintenant » (étiquette de la carte héros)
- « Plus tard » (report d'une habitude)
- « Journée validée » (état calme)
- « fait » / « à faire » (états de la liste récapitulative)
- « En plus » (remplace « Habitudes empilées » côté UI)
- « Consistance » (résumé d'Aujourd'hui)
- « Que manger ? », « Dans le frigo », « En livraison », « Un repas »
- « Le journal du jour »
- « Démarrer le circuit 20 min », « Une série isolée, sans séance », « Séances passées et index de force », « Séance en cours », « Terminer »
- « Progression » (renomme l'onglet « Tendances »)
- « Objectifs », « Ton corps », « Données », « Application », « Analyse photo » + les 6 sous-titres de rubrique
- « Réordonner », « Modifier l'habitude », « Revoir l'introduction »
- « Depuis le 15 juillet » → à générer depuis `installedAt`, pas une chaîne figée

Une renommage à trancher côté produit : « Habitudes empilées » → « En plus » dans l'UI. Le modèle garde `kind: 'stack'`.

## Assets

Aucun nouvel asset. Toutes les icônes sont des icônes **lucide** déjà présentes via `lucide-react` : `settings`, `check`, `chevron-right`, `chevron-up`, `chevron-down`, `arrow-left`, `house`, `salad`, `dumbbell`, `trending-up`, `trending-down`, `plus`, `minus`, `x`, `circle-plus`, `play`, `square`, `repeat`, `timer`, `trash-2`, `camera`, `pencil`, `pencil-line`, `ruler`, `download`, `upload`, `refresh-cw`, `loader-circle`. Les graphiques restent du SVG écrit à la main (`src/components/charts/LineChart.tsx`, `WeightSparkline.tsx`) — pas de bibliothèque de charting.

## Fichiers

- `RecompOS refonte.dc.html` — la cible : 4 onglets, 3 sous-pages, 6 rubriques de réglages, onboarding, 6 feuilles. Cliquable (onglets, validation d'habitudes, FAB, feuilles, navigation dans les réglages).
- `RecompOS actuel.dc.html` — l'état actuel, recréé depuis le code, pour comparaison.
- `github.md` (racine du projet) — association au dépôt et table écran → fichiers sources.

Les deux fichiers s'ouvrent directement dans un navigateur. Ils chargent le bundle du design system depuis `_ds/` : garder l'arborescence si vous les déplacez.

## Ce qui n'est volontairement pas dans la refonte

- **Pas de notifications**, ni push ni locales — décision de cadrage du PRD (annexe B), pas un oubli.
- **Pas de thème clair.** Une seule palette existe.
- **Pas de série (streak).** La consistance est un pourcentage glissant borné par le nombre de jours depuis l'installation ; rien ne se remet jamais à zéro.
- **Pas de dépassement puni.** L'anneau plafonne, les chiffres continuent.
