# Un coach IA nutrition, qui ne fait pas culpabiliser

| | |
|---|---|
| Date | 01/11/2026 |
| Statut | Design validé, prêt pour le plan d'implémentation |
| Portée | Onglet « Coach » (persona nutrition), résumé local des 7 derniers jours, questions rapides, historique court |
| Amende | PRD §2 (décisions), §8 (modèle de données), §9 (navigation, 5 onglets), §14 (hors périmètre) |

---

## 1. Le problème

L'app sait compter : calories, protéines, plancher, poids. Elle ne sait pas **répondre**.
Les questions qui reviennent sont des questions de jugement, pas de chiffres :

- « Qu'est-ce que je mange ce soir, avec ce qu'il me reste ? »
- « J'ai beaucoup mangé ce midi, et maintenant ? »
- « Ma semaine, elle donne quoi ? »

Aujourd'hui la réponse est soit absente, soit un anneau à moitié rempli que l'utilisateur
interprète seul — et l'interprétation spontanée d'un chiffre manqué, c'est la culpabilité.
Le PRD l'exclut déjà (§3, principe 2 : « pas de honte, pas de série cassée, pas de reset
punitif » ; §10 : « aucun élément de honte »). Le coach est ce principe, rendu bavard.

## 2. Ce qui est décidé

| # | Sujet | Décision |
|---|---|---|
| A | Fournisseur | **Groq, via la chaîne existante** (`lib/llm/client.ts`) : Groq → OpenRouter → endpoint perso. Même clé que l'analyse photo. Aucun backend (décisions n°5 et n°16 maintenues). |
| B | Modèle | Le **modèle texte** déjà réglé (`openai/gpt-oss-120b`, repli `llama-3.3-70b-versatile`). Pas de troisième réglage de modèle. |
| C | Emplacement | **Un 5ᵉ onglet « Coach »** dans la barre basse, route `/coach`. Points d'entrée secondaires sur Aujourd'hui et Nutrition qui y mènent. |
| D | Extensibilité | Le coach est une **persona** (`nutrition` en V1). Un coach sportif sera une seconde persona sur le même écran, pas un second écran. |
| E | Périmètre V1 | **Questions rapides + champ libre court**, une réponse structurée par question. Pas de conversation longue ouverte. |
| F | Mémoire | **Un résumé déterministe des 7 derniers jours**, calculé sur l'appareil depuis Dexie et envoyé à chaque question. Plus les 4 derniers échanges. Pas d'embeddings, pas de « mémoire » côté modèle. |
| G | Contexte | **Tout** : repas, protéines, cibles, plancher et habitudes, poids, tour de taille, séances. Validé le 01/11/2026. |
| H | Déclenchement | **Uniquement à la demande.** Jamais de message proactif, et jamais déclenché par un dépassement de cible — un coach qui apparaît après un gros repas est un reproche. |
| I | Historique | Table Dexie `coachMessages`, purgée au-delà de 7 jours, incluse dans l'export. |
| J | Consentement | Un écran unique avant la première question : ce qui part chez le fournisseur, et un lien « Voir ce que le coach voit ». |
| K | Hors ligne | Le dernier échange reste lisible ; le champ est désactivé avec un message, pas une erreur. |

La décision n°18 (ordre des onglets par fréquence d'usage) place **Coach en dernier** :
c'est l'onglet le moins fréquent d'une journée, et il ne doit pas déplacer les quatre
autres sous le pouce.

## 3. Ce qui reste à vérifier en amont du plan

Pas de requête réelle passée à la rédaction (pas de clé dans l'environnement). À vérifier
sur la documentation Groq et par une requête réelle avant la Task 1 du plan :

- `reasoning_effort` (`low` / `medium` / `high`) accepté par `openai/gpt-oss-120b` sur
  Groq, et ignoré ou refusé par `llama-3.3-70b-versatile` — le repli ne doit pas casser.
- Température recommandée pour gpt-oss. Point de départ 0,7, à régler par l'évaluation
  (§7), et non à fixer ici.
- Limites du palier gratuit (requêtes et tokens par minute et par jour) pour le modèle
  texte. Un appel coach pèse environ 3 000 tokens en entrée.
- `response_format: json_object` toujours accepté sur le modèle texte (déjà utilisé par
  l'analyse texte, donc très probable).

## 4. Architecture

### 4.1 Le transport ne change presque pas

`postCompletion` fixe aujourd'hui `temperature: 0.5` et `max_completion_tokens: 2048`.
C'est juste pour une extraction, pas pour un coach. On ajoute un dernier paramètre
`options?: { temperature?: number; maxTokens?: number; reasoningEffort?: 'low' | 'medium' | 'high' }`,
dont l'absence reproduit exactement le comportement actuel : les tests existants de
`client.test.ts` et `meal.test.ts` sont la spécification et ne bougent pas.

```
src/lib/llm/
  client.ts        transport (inchangé hors `options`)
  meal.ts          lecture d'un repas (inchangé)
src/lib/coach/
  personas.ts      définition d'une persona : id, libellé, prompt système, questions rapides,
                   constructeur de contexte
  digest.ts        résumé des 7 jours — fonction pure, sans Dexie
  digestQuery.ts   lit Dexie et alimente digest.ts
  prompt.ts        prompt système nutrition, gabarit utilisateur, prompt de réparation
  schema.ts        parseCoachReply : la seule porte d'entrée d'une réponse
  guard.ts         lexique interdit, détection de détresse dans la question
  ask.ts           orchestration : contexte → appel → parse → garde → 1 relance max
src/db/repositories/
  coachRepository.ts   ajout, lecture des N derniers, purge > 7 jours
src/features/coach/
  CoachScreen + composants (carte réponse, puces de questions, champ libre, consentement)
```

Même règle que `meal.ts` : rien de ce qui revient du modèle n'est casté. `parseCoachReply`
est la seule porte.

### 4.2 La persona

```ts
interface CoachPersona {
  id: 'nutrition' // 'training' plus tard
  label: string
  systemPrompt: string
  quickPrompts: Array<{ id: string; label: string; question: string }>
  buildContext: (db: RecompDb, today: IsoDate) => Promise<CoachDigest>
}
```

L'écran Coach affiche un sélecteur de persona **seulement quand il y en a plus d'une**.
En V1 il n'y a rien à choisir, donc rien à afficher.

### 4.3 Le résumé des 7 jours

Fenêtre : les 7 journées logiques se terminant aujourd'hui inclus (rollover 04h00,
comme partout ailleurs). Forme envoyée, en JSON compact :

```json
{
  "aujourdhui": "2026-11-01", "heure": "19:40",
  "profil": { "cibleProteinesG": 140, "cibleKcal": 2100, "objectif": "recomposition",
              "activite": "sedentary", "age": 34, "sexe": "female" },
  "jours": [
    { "date": "2026-10-26", "saisi": true, "kcal": 1980, "proteinesG": 132,
      "repas": [{ "creneau": "lunch", "libelle": "bowl poulet riz", "kcal": 650, "proteinesG": 45 }],
      "plancherFait": true, "seance": "circuit 20 min" },
    { "date": "2026-10-27", "saisi": false }
  ],
  "poids": { "tendance4pts": [72.4, 72.1, 71.9, 71.8], "derniere": "2026-10-30" },
  "tourDeTailleCm": 81,
  "favoris": ["skyr + granola", "omelette 3 œufs"],
  "zeroCuisson": ["skyr", "thon en boîte", "shake"],
  "livraison": ["poke saumon", "kebab assiette sans frites"]
}
```

Règles :

- Un jour sans saisie vaut `"saisi": false` et **rien d'autre** — pas de zéro, qui se lirait
  comme un jour à jeun, pas de libellé qui se lirait comme un oubli.
- Aucun champ de type `ecart`, `depassement` ou `deficit` : on donne la valeur et la cible,
  le cadrage appartient au prompt.
- Les libellés de repas sont tronqués à 40 caractères, 6 repas par jour au plus. Budget
  visé : moins de 2 000 tokens pour le résumé.
- `digest.ts` est pur et testé sur des données fabriquées ; `digestQuery.ts` est la seule
  partie qui touche Dexie.

### 4.4 La réponse

JSON imposé, rendu en carte par l'interface :

```json
{
  "constat": "une à deux phrases, positives et vraies d'après les données",
  "suggestion": { "titre": "court", "detail": "une action faisable aujourd'hui" },
  "question": "une question ouverte, ou null"
}
```

`suggestion` peut être `null` (« Bilan de ma semaine » n'en demande pas toujours).
Chaque champ a une longueur maximale vérifiée par `parseCoachReply`.

### 4.5 Le cycle d'une question

1. **Garde d'entrée** (`guard.ts`) : si la question contient des signaux de détresse
   (restriction extrême, vomissement provoqué, idée de se punir, etc.), **pas d'appel au
   modèle**. On affiche une réponse fixe, douce, qui oriente vers un professionnel de santé
   et des ressources d'écoute — liste à valider par la cheffe de projet avant la livraison.
2. Contexte : persona + résumé + 4 derniers échanges + question.
3. Appel par la chaîne de fournisseurs, avec repli de modèle (comme `meal.ts`).
4. `parseCoachReply` ; en cas d'échec, **une** réparation (même principe que `repairPrompt`).
5. **Garde de sortie** : lexique interdit (§5.3). En cas de correspondance, **une** relance
   avec un message qui nomme le mot fautif. Toujours fautif → réponse de repli neutre
   (« Je n'ai pas trouvé la bonne formulation, tu peux reformuler ? »), jamais la réponse
   fautive.
6. Enregistrement de la question et de la réponse dans `coachMessages`.

Au pire : 1 appel + 1 réparation + 1 relance = 3 appels. Au nominal : 1.

## 5. Le prompt (persona nutrition)

### 5.1 Rôle et ton

- Coach en nutrition franc et factuel, jamais moralisateur, tutoiement, phrases courtes.
- Répond **d'abord à la question posée** ; un bilan chiffré seulement si la question s'y prête.
  À « c'est quoi ton rôle ? », il se présente en deux phrases.
- S'appuie **uniquement** sur le résumé : ne cite aucun chiffre qui n'y figure pas, sauf la
  cible journalière qu'il propose.
- **Bilan hebdomadaire (décision n°33, 01/11/2026)** : ce qui compte est la moyenne de la
  semaine, comparée à la cible (déjà en déficit). Si la moyenne dépasse la cible, il peut
  proposer de viser un peu moins sur les 2 à 4 jours suivants, chiffre à l'appui, jamais
  sous `semaine.minimumJourKcal` (85 % de la cible, plancher 1 200 kcal). Un gros repas
  n'appelle aucune réaction le jour même. _Remplace la règle d'origine « la journée
  suivante se vit normalement », jugée trop molle pour maigrir._
- Une suggestion est **une seule** action, faisable aujourd'hui, de préférence tirée des
  favoris, du catalogue zéro-cuisson ou de la cheat sheet livraison.
- Les protéines sont la seule cible que l'app calcule vraiment (décision n°11) : c'est le
  levier préféré des suggestions, formulé en ajout (« ajoute un skyr ») et jamais en retrait.

### 5.2 Interdits

- Sauter un repas, jeûner, « brûler » un repas par le sport.
- Toute journée proposée sous `semaine.minimumJourKcal`.
- Tout conseil médical, tout diagnostic, toute supplémentation hors protéines.
- Les régimes nommés, les aliments « interdits », les jugements de valeur sur un aliment.
- Commenter le poids ou la silhouette sans que la question le demande.

### 5.3 Lexique interdit (vérifié en sortie)

`craquer`, `craqué`, `tricher`, `triche`, `écart`, `coupable`, `culpabilité` (hors
négation explicite « sans culpabilité »), `rattraper`, `compenser`, `mauvais aliment`,
`interdit`, `péché`, `il faut`, `tu dois`, `raté`, `échec`.

La liste vit dans `guard.ts`, avec ses exceptions, et elle est testée sur des phrases
réelles dans les deux sens (doit attraper / ne doit pas attraper).

### 5.4 Questions rapides (V1)

| id | Libellé | Note |
|---|---|---|
| `tonight` | Une idée pour ce soir ? | Tient compte de l'heure et de ce qui est déjà saisi aujourd'hui |
| `week` | Bilan de ma semaine | Constat d'abord ; une suggestion au plus |
| `big_meal` | J'ai beaucoup mangé, et maintenant ? | Le cas qui justifie le coach. Réponse : prochain repas normal ; si la moyenne de la semaine dépasse la cible, ajustement modéré sur les jours suivants |
| `protein` | Comment finir mes protéines ? | Depuis le catalogue zéro-cuisson |

Plus un champ libre de 280 caractères au plus.

## 6. Interface

### 6.1 L'onglet Coach

- Barre basse à 5 onglets : Aujourd'hui · Nutrition · Séances · Progression · **Coach**.
  Icône `MessageCircleHeart` (lucide). Vérifier sur 360 px de large que les libellés
  tiennent sans troncature ; sinon raccourcir « Progression » n'est **pas** une option
  (décision de renommage déjà prise), on réduit l'espacement.
- Écran : un chat. Les messages des 7 derniers jours dans l'ordre chronologique, séparés
  par jour, le dernier en bas ; un message d'accueil fixe en tête. En bas, épinglés
  au-dessus de la barre d'onglets : les questions rapides en puces défilantes, le champ
  et le bouton d'envoi. Le bouton d'action flottant est masqué sur cet onglet.
  _Révisé le 01/11/2026 : la première version (dernier échange en haut, champ au milieu)
  n'était pas intuitive._
- Chaque réponse est une carte : constat, puis suggestion mise en avant, puis question.
- Icône œil dans l'en-tête, « Voir ce que le coach voit » : ouvre une feuille avec le résumé exact
  envoyé, formaté lisiblement.

### 6.2 Points d'entrée ailleurs

- **Aujourd'hui** : une ligne « Une question pour le coach ? » qui mène à `/coach`.
- **Nutrition** : la puce « Une idée pour ce soir ? » sous les totaux du jour, qui mène à
  `/coach?ask=tonight` et lance la question.
- Jamais de point d'entrée conditionné à une cible dépassée (décision H).

### 6.3 Consentement

Avant la première question, une feuille : « Pour te répondre, le coach envoie à ton
service IA (Groq) un résumé de tes 7 derniers jours : repas, protéines, poids, séances.
Rien n'est envoyé sans que tu poses une question. » Boutons « D'accord » / « Pas
maintenant ». La date d'accord est stockée dans `AppSettings.coachConsentAt` ; elle se
retire dans Réglages.

### 6.4 Sans clé, sans réseau

- Aucun fournisseur configuré : l'écran explique et renvoie vers Réglages → Analyse photo.
  Cette rubrique est renommée **« Services IA »** puisqu'elle ne sert plus qu'à la photo.
- Hors ligne : le fil reste lisible, le champ et les puces sont désactivés avec
  « Le coach a besoin du réseau ».
- Erreurs : les `LlmError` existantes, avec les messages existants (clé refusée, quota
  atteint, pas de réponse).

## 7. Évaluation

Deux niveaux.

**En CI (Vitest, sans réseau)** : `digest.ts`, `parseCoachReply`, `guard.ts`, `ask.ts`
avec un `fetch` simulé (réparation, relance sur mot interdit, repli neutre, garde de
détresse qui n'appelle pas le réseau), `coachRepository` (purge à 7 jours).

**Manuel, avec une vraie clé** : `tools/coach-eval.mjs`, lancé avec `GROQ_API_KEY` dans
l'environnement, jamais en CI. Il joue des semaines types contre le vrai modèle et
vérifie mécaniquement : JSON valide, aucun mot interdit, chaque nombre cité présent dans
le résumé, longueur respectée. Semaines types :

1. Semaine régulière, cibles atteintes.
2. Week-end copieux (deux jours à +40 % de la cible).
3. Trois jours non saisis.
4. Protéines basses toute la semaine.
5. Aucun repas saisi aujourd'hui, 21 h.
6. Question libre « j'ai tout gâché ce week-end ».
7. Question libre avec un signal de détresse (doit être interceptée avant l'appel).
8. Question hors sujet (« quel temps demain ? ») : recentrage poli.

La relecture humaine des réponses de ces 8 cas est le critère de livraison du prompt.

## 8. Modèle de données

```ts
export type CoachPersonaId = 'nutrition'

export interface CoachMessage {
  id: string
  persona: CoachPersonaId
  role: 'user' | 'coach'
  /** Question en clair, ou réponse sérialisée (constat, suggestion, question). */
  content: string
  quickPromptId?: string
  providerId?: VisionProviderId
  /** Réponse fixe de la garde de détresse ou réponse de repli : jamais renvoyée au modèle. */
  synthetic?: boolean
  timestamp: IsoDateTime
  date: IsoDate
}
```

- Dexie **version 4**, en delta : `coachMessages: 'id, persona, timestamp'`.
- Purge des messages de plus de 7 jours à l'ouverture de l'écran Coach et au lancement.
- `ExportBundle.coachMessages?`, optionnel : un bundle plus ancien s'importe sans.
- `AppSettings.coachConsentAt?: IsoDateTime`.

## 9. Hors périmètre de la V1

- Coach sportif (persona `training`) — l'architecture le prévoit, la V1 ne le livre pas.
- Conversation libre longue, réponses en streaming.
- Messages proactifs, bilan automatique du lundi, notifications (décision n°6 maintenue).
- Photo ou code-barres envoyés au coach.
- Plans de repas sur plusieurs jours, listes de courses.

## 10. Risques

| Risque | Parade |
|---|---|
| Le modèle invente un chiffre | Prompt : uniquement le résumé ; éval : chaque nombre cité est vérifié |
| Une formulation culpabilisante passe le lexique | Les 8 cas relus à la main ; lexique enrichi à chaque cas trouvé |
| Signal de troubles alimentaires mal géré | Garde d'entrée sans appel au modèle, réponse fixe relue |
| Quota gratuit atteint | À la demande seulement ; résumé compact ; message « quota atteint » existant |
| Tokens de raisonnement qui tronquent la réponse | `reasoningEffort: 'low'` si confirmé (§3), budget de sortie dédié |
| 5 onglets trop serrés sur petit écran | Vérification à 360 px avant livraison |

## 11. Critères d'acceptation

- L'onglet Coach existe, en 5ᵉ position, et `/coach?ask=tonight` lance la question.
- Une question rapide produit une carte (constat, suggestion, question) en moins de 10 s
  sur Groq dans le cas nominal.
- Le résumé envoyé est visible tel quel par l'utilisateur.
- Aucune réponse affichée ne contient un mot du lexique interdit.
- Un signal de détresse ne déclenche aucun appel réseau.
- Les échanges de plus de 7 jours disparaissent ; l'export les contient, l'import les rend.
- Hors ligne, l'écran s'ouvre et le dernier échange se lit.
- `npm test`, `npm run typecheck`, `npm run lint` passent.
