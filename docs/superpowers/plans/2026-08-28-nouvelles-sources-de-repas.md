# Trois nouvelles sources de repas — plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Inscrire un repas depuis un code-barres OpenFoodFacts, depuis une description en texte libre, et donner un contexte facultatif à l'analyse photo avant qu'elle parte.

**Architecture:** Le transport HTTP vers les modèles (endpoint, clé, timeout, mode JSON, erreurs typées, réparation) est extrait de `lib/vision/providers.ts` vers `lib/llm/client.ts`, au-dessus duquel `lib/llm/meal.ts` pose deux lectures — photo et texte — qui partagent le même prompt système, le même schéma JSON et le même `parseAnalysis`. OpenFoodFacts vit à part dans `lib/off/`, sans clé et sans modèle : un code-barres est un fait, pas une estimation.

**Tech Stack:** React 18 + TypeScript strict, Vite, Dexie (IndexedDB), Zustand persist, Tailwind, Vitest + Testing Library. Aucune dépendance npm ajoutée par ce plan.

**Spec:** `docs/superpowers/specs/2026-08-28-nouvelles-sources-de-repas-design.md`

## Global Constraints

- **Aucune dépendance ajoutée.** Le scan utilise `BarcodeDetector`, API native du navigateur. Pas de ZXing, pas de quagga.
- **Zéro backend** (PRD décision n°5). Tout appel sortant part de la page.
- **Clé API jamais dans le bundle ni dans git** (PRD décision n°16). OpenFoodFacts n'en demande aucune en lecture.
- **Modèle texte par défaut : `openai/gpt-oss-120b`. Repli : `llama-3.3-70b-versatile`.** Groq uniquement ; OpenRouter et l'endpoint personnalisé n'ont pas de défaut.
- **Endpoint OpenFoodFacts : `https://world.openfoodfacts.org/api/v2/product/{ean}.json`**, avec `fields=` et `app_name=RecompOS&app_version={__APP_VERSION__}`. L'en-tête `User-Agent` est interdit au navigateur : ne pas essayer de l'écrire.
- **Un code inconnu répond `200` avec `{"status":0}`**, pas un `404`. Toujours lire le corps.
- **Textes d'interface en français**, dans `src/i18n/fr.ts`, jamais en dur dans un composant. Commentaires de code en anglais, comme le reste du dépôt.
- **Cible tactile 48 px** : tout contrôle interactif utilise `min-h-touch` / `h-touch`. `src/test/touchTargets.test.ts` le vérifie.
- **Tests colocalisés** : `foo.ts` → `foo.test.ts` dans le même dossier.
- **TypeScript strict** : `npm run typecheck` doit passer. `npm run lint` tourne avec `--max-warnings 0`.
- **Commandes** : `npm test` (une passe), `npm test -- <motif>` (ciblé), `npm run typecheck`, `npm run lint`.

## Pièges de l'environnement, vérifiés dans le dépôt

Un avertissement ESLint **fait échouer la CI** (`--max-warnings 0`). Trois règles actives mordent sur ce plan :

| Règle | Ce qu'elle interdit ici |
|---|---|
| `@typescript-eslint/no-non-null-assertion` | Aucun `valeur!`. Sortir la valeur du `?` dans une variable en amont. |
| `react-hooks/exhaustive-deps` | Tout `useEffect`/`useCallback` déclare ses dépendances. Les `setX` de `useState` et les refs sont stables et n'ont pas à y figurer. |
| `react-refresh/only-export-components` | Un `.tsx` n'exporte que des composants. Types et hooks vont dans un `.ts`. |

Autres faits établis en lisant le dépôt :

- **Vitest tourne en `jsdom`, `globals: true`, avec `src/test/setup.ts`** (`vite.config.ts`). Les tests importent quand même explicitement depuis `vitest`, comme le reste de la suite — s'y tenir.
- **jsdom n'a ni `BarcodeDetector` ni `navigator.mediaDevices`.** C'est ce qui rend le repli saisie manuelle testable sans truquage : ne pas mocker ces API, la branche par défaut est la bonne.
- **`src/db/repositories/*.test.ts` ouvre une `RecompDb` jetable par test** et passe `db` en **dernier argument** de chaque fonction du dépôt. Omettre cet argument écrit dans la base partagée.
- **`__APP_VERSION__` est déclaré** dans `src/vite-env.d.ts` et injecté par `define` dans `vite.config.ts`. Disponible aussi sous Vitest ; rien à ajouter.
- **`src/test/touchTargets.test.ts` compile Tailwind**, il ne scanne pas les composants : ajouter un écran ne peut pas le casser, mais il ne protège pas non plus contre un bouton trop petit. Utiliser `size="lg"` ou `min-h-touch`.
- **`t.common.cancel`** vaut « Annuler » (`src/i18n/fr.ts:561`).
- **`src/i18n/fr.ts` finit par `} as const`** : toute clé ajoutée l'est avant cette ligne, et son type se propage tout seul.
- **`Sheet` n'utilise pas de portail** (`fixed inset-0 z-50`). Deux feuilles ouvertes ensemble se départagent par l'ordre du DOM.

## Si une étape ne se comporte pas comme décrit

Ce plan a été écrit contre le dépôt au commit `bfb4d70`. Quand la réalité diffère :

1. **Un test échoue après un déplacement de code (Task 1, Task 2)** — c'est le déplacement qui est faux, pas le test. Le test existant est la spécification du comportement actuel : ne jamais l'ajuster pour le faire passer.
2. **Un identifiant nommé ici n'existe pas** — le chercher avant d'en créer un : `grep -rn "<nom>" src`. Le plan cite des lignes précises, mais un fichier a pu bouger.
3. **Un test neuf échoue sur une valeur attendue** — recalculer avant de changer l'attendu. Les nombres du plan sont vérifiés : `539 × 0,3 = 161,7 → 162` ; `2252 / 4,184 = 538,2 → 538` ; `539 × 0,15 = 80,85 → 81` ; `3017620422003` et `96385074` ont une somme de contrôle valide, `3017620422004` non.
4. **Une tâche s'avère plus large que décrite** — la finir quand même, et le noter dans le message de commit. Ne pas en déborder sur la suivante.

## Structure des fichiers

**Créés**

| Fichier | Responsabilité |
|---|---|
| `src/lib/llm/client.ts` | Transport OpenAI-compatible : providers, endpoint, clé, timeout, mode JSON, erreurs typées, test de clé. Ne sait rien des repas. |
| `src/lib/llm/client.test.ts` | Modalité, modèle texte, repli. |
| `src/lib/llm/meal.ts` | Les deux lectures de repas au-dessus du transport : `analyseMealPhoto`, `analyseMealText`. |
| `src/lib/llm/meal.test.ts` | Chemin texte : succès, réparation, chaîne, modèle utilisé. |
| `src/lib/vision/prompt.test.ts` | Les deux prompts partagent règles et format ; contexte ≠ correction. |
| `src/lib/off/product.ts` | Pur : `parseProduct`, `toMealItem`. Toute la logique tordue d'OpenFoodFacts. |
| `src/lib/off/product.test.ts` | kJ, macros manquantes, portions, mise à l'échelle. |
| `src/lib/off/client.ts` | `fetchProduct` : URL, timeout, erreurs typées. |
| `src/lib/off/client.test.ts` | `status:0`, 429, réseau, URL formée. |
| `src/lib/off/barcode.ts` | `isValidEan`, `isBarcodeScanSupported`, `detectBarcode`. |
| `src/lib/off/barcode.test.ts` | Sommes de contrôle EAN-13 et EAN-8. |
| `src/features/meals/DescribeMealSheet.tsx` | Zone de texte → analyse. |
| `src/features/meals/DescribeMealSheet.test.tsx` | Bouton désactivé à vide, texte transmis. |
| `src/features/meals/CapturePreviewSheet.tsx` | Aperçu + précisions facultatives → analyse. |
| `src/features/meals/CapturePreviewSheet.test.tsx` | Analyse avec et sans texte, annulation. |
| `src/features/meals/BarcodeScanSheet.tsx` | Caméra + boucle de détection, repli saisie manuelle. |
| `src/features/meals/BarcodeScanSheet.test.tsx` | Repli quand l'API manque, refus d'un EAN invalide. |
| `src/features/meals/ProductSheet.tsx` | Fiche produit + quantité → `MealItem`. |
| `src/features/meals/ProductSheet.test.tsx` | Recalcul des macros à la quantité. |
| `src/features/meals/useBarcode.ts` | Enchaîne scan → produit → item, porte les erreurs. |

**Modifiés**

| Fichier | Changement |
|---|---|
| `src/lib/vision/providers.ts` | Devient une façade de ré-export. Ses appelants et ses tests ne bougent pas. |
| `src/lib/vision/prompt.ts` | Règles et format extraits en bloc commun ; amorces photo et texte ; `contextPrompt`. |
| `src/types/models.ts` | `MealSource` +`'ai_text'` +`'barcode'` ; `VisionProviderSettings.textModel?`. |
| `src/db/repositories/mealRepository.ts` | `createTextMeal`, `createBarcodeMeal` ; `editMeal` traite `'ai_text'` comme `'ai'`. |
| `src/features/nutrition/useMeals.ts` | `stageCapture`/`confirmCapture`, `describeMeal`, `addProduct`. |
| `src/screens/NutritionScreen.tsx` | Grille à quatre boutons, branchement des trois feuilles. |
| `src/features/meals/MealEditorSheet.tsx` | Bouton « Ajouter un produit » ; correction d'un repas texte. |
| `src/features/nutrition/DayJournal.tsx` | Badges des deux nouvelles sources. |
| `src/features/vision/VisionSettingsCard.tsx` | Second champ « Modèle texte ». |
| `src/i18n/fr.ts` | Clés de chaque écran ajouté. |
| `docs/recompos-pwa-prd.md` | §2 décision n°19, §6.6, §14. |

---

### Task 1: Extraire le transport dans `lib/llm/`

Déplacement pur. Aucun comportement ne change ; la preuve est que `src/lib/vision/providers.test.ts` et `src/lib/vision/schema.test.ts` passent sans être touchés.

**Files:**
- Create: `src/lib/llm/client.ts`
- Create: `src/lib/llm/meal.ts`
- Modify: `src/lib/vision/providers.ts` (remplacé par une façade)
- Test: `src/lib/vision/providers.test.ts` (existant, **non modifié**)

**Interfaces:**
- Consumes: rien.
- Produces:
  - `src/lib/llm/client.ts` : `type Modality = 'vision' | 'text'` (introduit ici mais pas encore lu ; Task 3 le branche), `interface ProviderDefinition`, `const PROVIDERS: Record<VisionProviderId, ProviderDefinition>`, `const VISION_PROVIDER_ORDER: VisionProviderId[]`, `type LlmErrorKind`, `class LlmError extends Error { kind; providerId? }`, `interface ConfiguredProvider { id: VisionProviderId; settings: VisionProviderSettings }`, `function resolveEndpoint(id, settings, useFallbackModel?): { url: string; model: string } | null`, `function configuredProviders(providers): ConfiguredProvider[]`, `function mentionsJson(messages: unknown[]): boolean`, `function postCompletion(id, settings, messages, fetchImpl, useFallbackModel?): Promise<string>`, `function testProvider(id, settings, fetchImpl?)`, `function fitsInRequest(dataUrl: string): boolean`, `const MAX_REQUEST_BYTES`.
  - `src/lib/llm/meal.ts` : `interface AnalyseInput { dataUrl: string; hint?: string }`, `interface AnalyseOutcome { analysis: MealAnalysis; providerId: VisionProviderId }`, `function analysePhotoWithProvider(provider, input, fetchImpl?): Promise<MealAnalysis>`, `function analyseMealPhoto(providers, input, fetchImpl?): Promise<AnalyseOutcome>`.

- [ ] **Step 1: Créer `src/lib/llm/client.ts` en y déplaçant le transport**

Coupe depuis `src/lib/vision/providers.ts`, **sans rien réécrire**, ces symboles dans cet ordre : `ProviderDefinition`, `PROVIDERS`, `VISION_PROVIDER_ORDER`, `VisionErrorKind`, `VisionError`, `fitsInRequest`, `ConfiguredProvider`, `REQUEST_TIMEOUT_MS`, `MAX_TOKENS`, `MAX_REQUEST_BYTES`, `REQUEST_OVERHEAD_BYTES`, `resolveEndpoint`, `hasFallbackModel`, `configuredProviders`, `mentionsJson`, `postCompletion`, `testProvider`. Leurs commentaires de tête partent avec eux.

Deux renommages, et deux seulement :

```ts
export type LlmErrorKind =
  | 'auth'
  | 'rate_limit'
  | 'network'
  | 'server'
  | 'bad_response'
  | 'model'
  | 'too_large'

export class LlmError extends Error {
  constructor(
    readonly kind: LlmErrorKind,
    message: string,
    readonly providerId?: VisionProviderId,
  ) {
    super(message)
    // Kept as `VisionError` on purpose: the name is what a thrown error prints,
    // and the settings screen still speaks of vision providers.
    this.name = 'VisionError'
  }
}
```

Remplace chaque `new VisionError(` par `new LlmError(` **dans ce fichier seulement**, et chaque annotation `VisionErrorKind` par `LlmErrorKind`.

En-tête du fichier :

```ts
/**
 * Transport for every provider speaking the OpenAI chat-completions dialect.
 *
 * There is no server (PRD décision n°5), so the request goes straight from the
 * page to the provider with a key the user typed into Settings. This file knows
 * about keys, endpoints, timeouts and failure shapes — and nothing at all about
 * meals. What is read (a plate, a sentence) lives one layer up, in `llm/meal.ts`.
 */
import type { VisionProviderId, VisionProviderSettings } from '@/types/models'

/** Which model of a provider a call wants. Read from Task 3 onward. */
export type Modality = 'vision' | 'text'
```

**Deux visibilités à changer en même temps que le déplacement :**

- `postCompletion` est aujourd'hui privée dans `providers.ts`. Elle devient `export async function postCompletion(` : Task 3 la teste directement, et Task 4 l'appelle depuis `meal.ts`.
- `hasFallbackModel` reste privée.

Tout le reste garde la visibilité qu'il avait.

- [ ] **Step 2: Créer `src/lib/llm/meal.ts` avec la lecture photo**

Y déplacer `AnalyseInput`, `messageContent`, `analyseWithProvider`, `AnalyseOutcome`, `analyseMeal`. Renommer les deux fonctions publiques, sans autre changement de corps :

- `analyseWithProvider` → `analysePhotoWithProvider`
- `analyseMeal` → `analyseMealPhoto`

En-tête et imports :

```ts
/**
 * Reading a meal, whatever it arrives as.
 *
 * Both modalities share one system prompt, one JSON shape and one parser: a text
 * model lies in exactly the same ways a vision model does, so nothing crossing
 * this boundary is cast — `parseAnalysis` is the only door in.
 */
import {
  LlmError,
  postCompletion,
  fitsInRequest,
  type ConfiguredProvider,
} from '@/lib/llm/client'
import { hintPrompt, MEAL_SYSTEM_PROMPT, MEAL_USER_PROMPT, repairPrompt } from '@/lib/vision/prompt'
import { parseAnalysis, type MealAnalysis } from '@/lib/vision/schema'
import type { VisionProviderId } from '@/types/models'
```

Dans les corps déplacés, `new VisionError(` devient `new LlmError(`.

- [ ] **Step 3: Réduire `src/lib/vision/providers.ts` à une façade**

Remplacer tout le fichier par :

```ts
/**
 * Historical entry point for the vision path.
 *
 * The transport moved to `lib/llm/client.ts` and the reading to `lib/llm/meal.ts`
 * when a second modality arrived. This file stays as the door its callers and
 * its test suite already know, so that split cost no churn anywhere else.
 */
export {
  PROVIDERS,
  VISION_PROVIDER_ORDER,
  MAX_REQUEST_BYTES,
  LlmError as VisionError,
  configuredProviders,
  fitsInRequest,
  mentionsJson,
  resolveEndpoint,
  testProvider,
  type ConfiguredProvider,
  type LlmErrorKind as VisionErrorKind,
  type Modality,
  type ProviderDefinition,
} from '@/lib/llm/client'

export {
  analyseMealPhoto as analyseMeal,
  analysePhotoWithProvider as analyseWithProvider,
  type AnalyseInput,
  type AnalyseOutcome,
} from '@/lib/llm/meal'
```

- [ ] **Step 4: Vérifier que rien n'a bougé**

```bash
npm test -- vision
npm run typecheck
npm run lint
```

Attendu : `providers.test.ts` et `schema.test.ts` verts, sans avoir été édités. Si un test échoue, c'est que le déplacement a modifié un corps de fonction — le corriger, ne pas ajuster le test.

- [ ] **Step 5: Commit**

```bash
git add src/lib/llm src/lib/vision/providers.ts
git commit -m "refactor: séparer le transport LLM de la lecture d'assiette"
```

---

### Task 2: Un prompt système et un schéma JSON pour les deux modalités

**Files:**
- Modify: `src/lib/vision/prompt.ts` (réécriture complète)
- Modify: `src/lib/llm/meal.ts` (import du prompt photo)
- Test: `src/lib/vision/prompt.test.ts` (créer)

**Interfaces:**
- Consumes: `analysePhotoWithProvider` de Task 1, qui importe aujourd'hui `MEAL_SYSTEM_PROMPT` et `MEAL_USER_PROMPT`.
- Produces: `const MEAL_JSON_SHAPE: string`, `const MEAL_RULES: string`, `const MEAL_PHOTO_SYSTEM_PROMPT: string`, `const MEAL_TEXT_SYSTEM_PROMPT: string`, `const MEAL_PHOTO_USER_PROMPT: string`, `function mealTextUserPrompt(description: string): string`, `function contextPrompt(text: string): string`, `function hintPrompt(hint: string): string`, `function repairPrompt(previous: string): string`.

- [ ] **Step 1: Écrire les tests qui échouent**

Créer `src/lib/vision/prompt.test.ts` :

```ts
import { describe, expect, it } from 'vitest'
import {
  contextPrompt,
  hintPrompt,
  mealTextUserPrompt,
  MEAL_JSON_SHAPE,
  MEAL_PHOTO_SYSTEM_PROMPT,
  MEAL_RULES,
  MEAL_TEXT_SYSTEM_PROMPT,
} from '@/lib/vision/prompt'

describe('prompts partagés', () => {
  it('donne le même bloc de règles aux deux modalités', () => {
    expect(MEAL_PHOTO_SYSTEM_PROMPT).toContain(MEAL_RULES)
    expect(MEAL_TEXT_SYSTEM_PROMPT).toContain(MEAL_RULES)
  })

  it('donne le même format de sortie aux deux modalités', () => {
    expect(MEAL_PHOTO_SYSTEM_PROMPT).toContain(MEAL_JSON_SHAPE)
    expect(MEAL_TEXT_SYSTEM_PROMPT).toContain(MEAL_JSON_SHAPE)
  })

  it('dit « json » dans les deux, sans quoi le mode JSON est refusé', () => {
    expect(MEAL_PHOTO_SYSTEM_PROMPT).toMatch(/json/i)
    expect(MEAL_TEXT_SYSTEM_PROMPT).toMatch(/json/i)
  })

  it("garde les repères d'échelle visuelle du côté photo", () => {
    expect(MEAL_PHOTO_SYSTEM_PROMPT).toMatch(/assiette/i)
    expect(MEAL_TEXT_SYSTEM_PROMPT).not.toMatch(/assiette ~26/i)
  })

  it('demande au chemin texte de signaler les portions non données', () => {
    expect(MEAL_TEXT_SYSTEM_PROMPT).toMatch(/portion/i)
    expect(MEAL_TEXT_SYSTEM_PROMPT).toMatch(/notes/i)
  })
})

describe('contexte et correction', () => {
  it("ne désavoue pas une lecture précédente quand il n'y en a pas eu", () => {
    expect(contextPrompt('riz complet')).not.toMatch(/précédente/i)
    expect(contextPrompt('riz complet')).toContain('riz complet')
  })

  it('désavoue explicitement la lecture ratée dans une correction', () => {
    expect(hintPrompt('couscous, pas du riz')).toMatch(/précédente/i)
    expect(hintPrompt('couscous, pas du riz')).toContain('couscous, pas du riz')
  })

  it('coupe les espaces autour du texte reçu', () => {
    expect(contextPrompt('  riz  ')).toContain('riz')
    expect(contextPrompt('  riz  ')).not.toContain('  riz  ')
  })
})

describe('mealTextUserPrompt', () => {
  it("porte la description telle que l'utilisateur l'a écrite", () => {
    expect(mealTextUserPrompt('200 g de poulet')).toContain('200 g de poulet')
  })
})
```

- [ ] **Step 2: Lancer le test, vérifier qu'il échoue**

```bash
npm test -- prompt
```
Attendu : ÉCHEC, `MEAL_RULES` / `MEAL_JSON_SHAPE` / `contextPrompt` / `mealTextUserPrompt` n'existent pas.

- [ ] **Step 3: Réécrire `src/lib/vision/prompt.ts`**

```ts
/**
 * The prompt is the feature (PRD §6.6).
 *
 * Everything the app can do about accuracy happens here: the model is told to
 * work in grams first and calories second, to name what it cannot see rather
 * than average it away, and to hedge out loud. Published work on photo-based
 * dietary assessment puts the dominant error in *portion size*, not in
 * identifying the food — so the prompt spends its instructions there.
 *
 * Two modalities read a meal: a photo and a written description. They share
 * these rules and this output shape, and differ only in the paragraph that
 * describes what they are looking at. Keeping the shared part shared is what
 * stops a fix landing on one path and not the other.
 */

/**
 * The contract, written once.
 *
 * Also the reason both system prompts say « JSON »: the providers refuse
 * `response_format: json_object` unless the word appears in the conversation.
 */
export const MEAL_JSON_SHAPE = [
  'Format exact :',
  '{',
  '  "label": "résumé court du plat, 60 caractères max",',
  '  "items": [',
  '    {"name": "aliment", "quantity": "portion estimée, ex: 150 g ou 1 bol",',
  '     "kcal": 0, "proteinG": 0, "carbsG": 0, "fatG": 0}',
  '  ],',
  '  "confidence": "low | medium | high",',
  '  "notes": "ce que tu n\'arrives pas à déterminer, en une phrase"',
  '}',
].join('\n')

/** True of a meal however it is read. Neither modality may soften these. */
export const MEAL_RULES = [
  'Règles :',
  '- Une ligne par aliment distinct. Ne regroupe pas « viande + féculent ».',
  '- Les huiles, sauces et matières grasses de cuisson comptent. Si tu en soupçonnes',
  '  sans en avoir la preuve, ajoute une ligne et dis-le dans "notes".',
  '- Les macros doivent être cohérentes avec les kcal (4/4/9 kcal par g).',
  '- "confidence" vaut "low" dès qu\'un aliment est caché, mélangé ou ambigu.',
  '- Aliment non identifiable : nomme-le « aliment non identifié » plutôt que de deviner.',
  "- N'invente jamais une variété, un parfum ou une origine qui ne t'est pas donnée.",
  '  « Dessert lacté » si tu as un dessert lacté ; pas « type mangue ».',
  '  Nomme la famille, jamais une déclinaison que tu supposes.',
  '- Ne rabats pas le plat sur la cuisine que tu rencontres le plus souvent. Semoule,',
  '  couscous, boulgour, riz et quinoa se confondent facilement : si tu ne peux pas',
  '  trancher, écris la famille (« céréale en grains »), mets "confidence" à "low"',
  '  et dis dans "notes" entre quoi tu hésites.',
  "- Un liquide blanc n'est pas forcément du lait : lait, lben, kéfir, yaourt à boire,",
  '  sauce blanche. Là encore, la famille et le doute, pas la déclinaison.',
  '- Tout en français. Aucun champ supplémentaire.',
].join('\n')

const JSON_ONLY =
  'Tu réponds UNIQUEMENT par un objet JSON valide, sans texte autour, sans bloc de code.'

export const MEAL_PHOTO_SYSTEM_PROMPT = [
  "Tu es un assistant nutritionnel. On te donne la photo d'un repas.",
  JSON_ONLY,
  '',
  MEAL_JSON_SHAPE,
  '',
  MEAL_RULES,
  '',
  'Sur la photo :',
  "- Estime la portion en grammes en te servant des repères d'échelle visibles",
  "  (assiette ~26 cm, couverts, verre, main). C'est la portion qui fait l'erreur,",
  '  pas la reconnaissance : prends le temps de la raisonner avant de chiffrer.',
].join('\n')

export const MEAL_TEXT_SYSTEM_PROMPT = [
  "Tu es un assistant nutritionnel. On te donne la description écrite d'un repas.",
  JSON_ONLY,
  '',
  MEAL_JSON_SHAPE,
  '',
  MEAL_RULES,
  '',
  'Sur une description :',
  "- Les quantités données par l'utilisateur font autorité. Ne les corrige pas.",
  '- Une quantité absente est estimée sur la portion usuelle de cet aliment.',
  '  Dans ce cas, "confidence" ne dépasse pas "medium" et "notes" dit lesquelles',
  '  tu as estimées.',
  "- N'ajoute aucun aliment qui n'est pas dans la description, sauf une matière",
  '  grasse de cuisson que le mode de cuisson implique — et alors dis-le.',
].join('\n')

export const MEAL_PHOTO_USER_PROMPT = "Analyse ce repas. Rends le JSON demandé, rien d'autre."

/** Frames the user's own words as the thing to read. */
export function mealTextUserPrompt(description: string): string {
  return [
    'Repas décrit par la personne qui l\'a mangé :',
    description.trim(),
    "Rends le JSON demandé, rien d'autre.",
  ].join('\n')
}

/**
 * What the user knew before the model looked.
 *
 * Authoritative on *what* the food is — the person was at the table. Says
 * nothing about a previous reading, because at this point there has not been
 * one: that sentence belongs to `hintPrompt`, and only there.
 */
export function contextPrompt(text: string): string {
  return [
    "Précision donnée par l'utilisateur avant l'analyse :",
    text.trim(),
    'Elle fait autorité sur ce que sont les aliments. Les portions restent à estimer.',
  ].join('\n')
}

/**
 * Frames the correction the user typed after a wrong reading.
 *
 * Authoritative on *what* the food is: the person was at the table and the model
 * was not. Not authoritative on *how much* — the portion still has to be read off
 * the photo, and a correction naming the dish is not a licence to keep the
 * quantities from the reading it just replaced.
 */
export function hintPrompt(hint: string): string {
  return [
    "Correction de l'utilisateur, qui a le plat sous les yeux :",
    hint.trim(),
    'Elle fait autorité sur ce que sont les aliments. Reprends depuis le début avec',
    'cette information, et réestime les portions en conséquence.',
    "Ne conserve rien de ta lecture précédente qu'elle contredit.",
  ].join('\n')
}

/** Re-asks with the failure in hand; a second attempt usually lands. */
export function repairPrompt(previous: string): string {
  return [
    "Ta réponse précédente n'était pas un JSON exploitable :",
    previous.slice(0, 400),
    "Renvoie uniquement l'objet JSON au format demandé.",
  ].join('\n')
}
```

- [ ] **Step 4: Adapter l'import dans `src/lib/llm/meal.ts`**

`MEAL_SYSTEM_PROMPT` et `MEAL_USER_PROMPT` n'existent plus. Dans l'import :

```ts
import {
  hintPrompt,
  MEAL_PHOTO_SYSTEM_PROMPT,
  MEAL_PHOTO_USER_PROMPT,
  repairPrompt,
} from '@/lib/vision/prompt'
```

Et dans les corps, `MEAL_SYSTEM_PROMPT` → `MEAL_PHOTO_SYSTEM_PROMPT`, `MEAL_USER_PROMPT` → `MEAL_PHOTO_USER_PROMPT`. Deux occurrences en tout : une dans `messageContent`, une dans `analysePhotoWithProvider`.

- [ ] **Step 5: Lancer les tests**

```bash
npm test -- prompt
npm test -- vision
npm run typecheck
```
Attendu : tout vert. `providers.test.ts` reste inchangé — il n'importe aucune constante de prompt.

- [ ] **Step 6: Commit**

```bash
git add src/lib/vision/prompt.ts src/lib/vision/prompt.test.ts src/lib/llm/meal.ts
git commit -m "refactor: partager règles et schéma JSON entre les deux modalités"
```

---

### Task 3: Modèle texte réglable, sur la même clé

**Files:**
- Modify: `src/types/models.ts:251-258` (`VisionProviderSettings`)
- Modify: `src/lib/llm/client.ts` (`ProviderDefinition`, `PROVIDERS`, `resolveEndpoint`, `hasFallbackModel`, `postCompletion`, `testProvider`)
- Modify: `src/features/vision/VisionSettingsCard.tsx`
- Modify: `src/i18n/fr.ts` (bloc `vision`, ligne 446)
- Test: `src/lib/llm/client.test.ts` (créer)

**Interfaces:**
- Consumes: `Modality`, `resolveEndpoint`, `PROVIDERS` de Task 1.
- Produces: `resolveEndpoint(id, settings, modality?: Modality, useFallbackModel?: boolean)` — `modality` vaut `'vision'` par défaut ; `postCompletion(id, settings, messages, fetchImpl, useFallbackModel?, modality?)` ; `ProviderDefinition.defaultTextModel: string` et `.fallbackTextModel?: string` ; `VisionProviderSettings.textModel?: string`.

> **Pourquoi `modality` a une valeur par défaut :** `providers.test.ts` appelle `resolveEndpoint('groq', settings)` à deux arguments en cinq endroits. Un paramètre obligatoire casserait une suite que Task 1 s'est engagée à ne pas toucher.

- [ ] **Step 1: Écrire les tests qui échouent**

Créer `src/lib/llm/client.test.ts` :

```ts
import { describe, expect, it, vi } from 'vitest'
import { postCompletion, resolveEndpoint } from '@/lib/llm/client'

const KEY = { apiKey: 'gsk_test', enabled: true } as const

describe('resolveEndpoint, modalité texte', () => {
  it('sert le modèle texte par défaut de Groq', () => {
    expect(resolveEndpoint('groq', KEY, 'text')?.model).toBe('openai/gpt-oss-120b')
  })

  it('garde le modèle vision par défaut sans modalité précisée', () => {
    expect(resolveEndpoint('groq', KEY)?.model).toBe(resolveEndpoint('groq', KEY, 'vision')?.model)
  })

  it('lit textModel, pas model, en texte', () => {
    const settings = { ...KEY, model: 'un-modele-vision', textModel: 'un-modele-texte' }
    expect(resolveEndpoint('groq', settings, 'text')?.model).toBe('un-modele-texte')
    expect(resolveEndpoint('groq', settings, 'vision')?.model).toBe('un-modele-vision')
  })

  it('replie sur le modèle texte de secours quand on le demande', () => {
    expect(resolveEndpoint('groq', KEY, 'text', true)?.model).toBe('llama-3.3-70b-versatile')
  })

  it("ne replie jamais sur un modèle texte que l'utilisateur a saisi", () => {
    const settings = { ...KEY, textModel: 'le-mien' }
    expect(resolveEndpoint('groq', settings, 'text', true)?.model).toBe('le-mien')
  })

  it("refuse un provider sans défaut texte tant que rien n'est saisi", () => {
    expect(resolveEndpoint('openrouter', KEY, 'text')).toBeNull()
    expect(resolveEndpoint('openrouter', { ...KEY, textModel: 'x/y' }, 'text')?.model).toBe('x/y')
  })
})

describe('postCompletion, modalité texte', () => {
  it('envoie le modèle texte dans le corps de la requête', async () => {
    const fetchImpl = vi.fn(
      async () => new Response(JSON.stringify({ choices: [{ message: { content: 'ok' } }] })),
    )
    await postCompletion(
      'groq',
      { ...KEY, textModel: 'un-modele-texte' },
      [{ role: 'user', content: 'coucou' }],
      fetchImpl as unknown as typeof fetch,
      false,
      'text',
    )
    const body = JSON.parse(String((fetchImpl.mock.calls[0][1] as RequestInit).body))
    expect(body.model).toBe('un-modele-texte')
  })
})
```

- [ ] **Step 2: Lancer le test, vérifier qu'il échoue**

```bash
npm test -- llm/client
```
Attendu : ÉCHEC — `resolveEndpoint` n'accepte pas `'text'`, `openai/gpt-oss-120b` n'est nulle part.

- [ ] **Step 3: Ajouter `textModel` au modèle de données**

Dans `src/types/models.ts`, `VisionProviderSettings` devient :

```ts
export interface VisionProviderSettings {
  apiKey: string
  /** Overrides the provider default; required for `custom`. */
  model?: string
  /**
   * The model used to read a written meal, when it is not the one that reads a
   * photo. Optional and separate: the same key buys both, but a vision model is
   * a poor and expensive way to parse a sentence.
   */
  textModel?: string
  /** Only read for `custom`. */
  baseUrl?: string
  enabled: boolean
}
```

Champ optionnel : les installations existantes le lisent comme absent. Aucune migration Dexie, aucun bump de `schemaVersion` — ce réglage vit dans Zustand persist, pas dans la base.

- [ ] **Step 4: Brancher la modalité dans `src/lib/llm/client.ts`**

`ProviderDefinition` gagne deux champs :

```ts
  /** Empty means the user must name one; the provider is skipped until they do. */
  defaultModel: string
  /**
   * The text-only model. Held apart from `defaultModel` because a description
   * does not need vision, and paying for vision to read a sentence is waste.
   */
  defaultTextModel: string
  fallbackModel?: string
  fallbackTextModel?: string
```

`PROVIDERS` :

```ts
  groq: {
    id: 'groq',
    label: 'Groq',
    baseUrl: 'https://api.groq.com/openai/v1',
    defaultModel: 'qwen/qwen3.8-27b',
    fallbackModel: 'qwen/qwen3.6-27b',
    defaultTextModel: 'openai/gpt-oss-120b',
    fallbackTextModel: 'llama-3.3-70b-versatile',
    keyUrl: 'https://console.groq.com/keys',
    needsBaseUrl: false,
  },
  openrouter: {
    // …inchangé, plus :
    defaultTextModel: '',
  },
  custom: {
    // …inchangé, plus :
    defaultTextModel: '',
  },
```

`resolveEndpoint` :

```ts
export function resolveEndpoint(
  id: VisionProviderId,
  settings: VisionProviderSettings,
  modality: Modality = 'vision',
  useFallbackModel = false,
): { url: string; model: string } | null {
  const definition = PROVIDERS[id]
  const baseUrl = (definition.needsBaseUrl ? settings.baseUrl : definition.baseUrl)?.replace(
    /\/+$/,
    '',
  )
  const text = modality === 'text'
  const chosen = (text ? settings.textModel : settings.model)?.trim()
  const fallback = text ? definition.fallbackTextModel : definition.fallbackModel
  const preferred = text ? definition.defaultTextModel : definition.defaultModel
  // A model the user typed is never second-guessed: the fallback exists for the
  // built-in default going stale, not to override a deliberate choice.
  const model = chosen || (useFallbackModel ? fallback : preferred)
  if (!baseUrl || !model) return null
  return { url: `${baseUrl}/chat/completions`, model }
}

/** True when the built-in default failed and a backup is worth one retry. */
function hasFallbackModel(
  id: VisionProviderId,
  settings: VisionProviderSettings,
  modality: Modality = 'vision',
): boolean {
  const text = modality === 'text'
  const chosen = (text ? settings.textModel : settings.model)?.trim()
  return !chosen && Boolean(text ? PROVIDERS[id].fallbackTextModel : PROVIDERS[id].fallbackModel)
}
```

`postCompletion` prend la modalité **en dernier**, pour ne pas déplacer les arguments existants :

```ts
async function postCompletionInner(/* … */) {}

export async function postCompletion(
  id: VisionProviderId,
  settings: VisionProviderSettings,
  messages: unknown[],
  fetchImpl: typeof fetch,
  useFallbackModel = false,
  modality: Modality = 'vision',
): Promise<string> {
  const endpoint = resolveEndpoint(id, settings, modality, useFallbackModel)
  if (!endpoint) throw new LlmError('bad_response', 'Provider mal configuré', id)
  // …le reste du corps existant, inchangé
```

(Pas de `postCompletionInner` à créer : la ligne ci-dessus remplace les deux premières lignes du corps actuel. Le reste — timeout, en-têtes, statuts, extraction du contenu — ne bouge pas.)

`configuredProviders` teste aujourd'hui `resolveEndpoint(id, settings)` : un provider est retenu s'il sait faire de la vision. C'est le bon critère et il ne change pas — un provider sans modèle texte échouera à l'appel texte et la chaîne passera au suivant.

`testProvider` continue d'éprouver la modalité vision : ce qu'il vérifie — clé, endpoint, CORS, mode JSON — est commun aux deux.

- [ ] **Step 5: Lancer les tests**

```bash
npm test -- llm/client
npm test -- vision
npm run typecheck
```
Attendu : les deux verts. Si `providers.test.ts` casse, c'est que `modality` a été inséré ailleurs qu'en troisième position avec un défaut.

- [ ] **Step 6: Ajouter le champ dans les réglages**

Dans `src/i18n/fr.ts`, bloc `vision` (après `modelRequired`, ligne 454) :

```ts
    textModelLabel: 'Modèle texte',
    textModelHint: (fallback: string) => `Vide = ${fallback}. Sert aux repas décrits, pas aux photos.`,
    textModelRequired: 'À renseigner pour analyser un repas décrit avec ce service.',
```

Dans `src/features/vision/VisionSettingsCard.tsx`, juste après le `<Field>` du modèle vision :

```tsx
        <Field
          label={t.vision.textModelLabel}
          hint={
            definition.defaultTextModel
              ? t.vision.textModelHint(definition.defaultTextModel)
              : t.vision.textModelRequired
          }
        >
          {(id) => (
            <Input
              id={id}
              autoComplete="off"
              spellCheck={false}
              placeholder={definition.defaultTextModel}
              value={current?.textModel ?? ''}
              onChange={(event) => patch({ textModel: event.target.value })}
            />
          )}
        </Field>
```

`patch` accepte déjà un `Partial<VisionProviderSettings>` : rien à changer dans le store.

- [ ] **Step 7: Vérifier l'écran**

```bash
npm test
npm run lint
```
Attendu : tout vert, y compris `src/test/touchTargets.test.ts` (le `Input` porte déjà `min-h-touch`).

- [ ] **Step 8: Commit**

```bash
git add src/types/models.ts src/lib/llm src/features/vision/VisionSettingsCard.tsx src/i18n/fr.ts
git commit -m "feat: modèle texte réglable à part du modèle vision"
```

---

### Task 4: `analyseMealText`

**Files:**
- Modify: `src/lib/llm/meal.ts`
- Test: `src/lib/llm/meal.test.ts` (créer)

**Interfaces:**
- Consumes: `postCompletion`, `LlmError`, `ConfiguredProvider` (Task 1, Task 3) ; `MEAL_TEXT_SYSTEM_PROMPT`, `mealTextUserPrompt`, `repairPrompt` (Task 2) ; `parseAnalysis` (existant).
- Produces: `function analyseTextWithProvider(provider: ConfiguredProvider, description: string, fetchImpl?: typeof fetch): Promise<MealAnalysis>`, `function analyseMealText(providers: ConfiguredProvider[], description: string, fetchImpl?: typeof fetch): Promise<AnalyseOutcome>`.

- [ ] **Step 1: Écrire les tests qui échouent**

Créer `src/lib/llm/meal.test.ts` :

```ts
import { describe, expect, it, vi } from 'vitest'
import { analyseMealText } from '@/lib/llm/meal'
import { LlmError, type ConfiguredProvider } from '@/lib/llm/client'

const ANSWER = JSON.stringify({
  label: 'Poulet riz',
  items: [
    { name: 'Blanc de poulet', quantity: '200 g', kcal: 330, proteinG: 62, carbsG: 0, fatG: 7 },
    { name: 'Riz cuit', quantity: '150 g', kcal: 195, proteinG: 4, carbsG: 42, fatG: 1 },
  ],
  confidence: 'medium',
})

function reply(content: string, status = 200): Response {
  return new Response(JSON.stringify({ choices: [{ message: { content } }] }), { status })
}

function groq(overrides = {}): ConfiguredProvider {
  return { id: 'groq', settings: { apiKey: 'gsk_test', enabled: true, ...overrides } }
}

describe('analyseMealText', () => {
  it('lit un repas décrit et recalcule les totaux depuis les lignes', async () => {
    const fetchImpl = vi.fn(async () => reply(ANSWER))
    const outcome = await analyseMealText(
      [groq()],
      '200 g de poulet et 150 g de riz',
      fetchImpl as unknown as typeof fetch,
    )
    expect(outcome.providerId).toBe('groq')
    expect(outcome.analysis.items).toHaveLength(2)
    expect(outcome.analysis.kcal).toBe(525)
    expect(outcome.analysis.proteinG).toBe(66)
  })

  it('utilise le modèle texte et non le modèle vision', async () => {
    const fetchImpl = vi.fn(async () => reply(ANSWER))
    await analyseMealText(
      [groq({ model: 'vision-a-moi', textModel: 'texte-a-moi' })],
      'une pomme',
      fetchImpl as unknown as typeof fetch,
    )
    const body = JSON.parse(String((fetchImpl.mock.calls[0][1] as RequestInit).body))
    expect(body.model).toBe('texte-a-moi')
  })

  it("n'envoie aucune image", async () => {
    const fetchImpl = vi.fn(async () => reply(ANSWER))
    await analyseMealText([groq()], 'une pomme', fetchImpl as unknown as typeof fetch)
    const body = JSON.parse(String((fetchImpl.mock.calls[0][1] as RequestInit).body))
    expect(JSON.stringify(body)).not.toContain('image_url')
  })

  it('porte la description dans le message utilisateur', async () => {
    const fetchImpl = vi.fn(async () => reply(ANSWER))
    await analyseMealText([groq()], 'tajine de poulet', fetchImpl as unknown as typeof fetch)
    const body = JSON.parse(String((fetchImpl.mock.calls[0][1] as RequestInit).body))
    expect(JSON.stringify(body)).toContain('tajine de poulet')
  })

  it('répare une réponse enrobée de prose', async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(reply('Voici : pas du JSON du tout'))
      .mockResolvedValueOnce(reply(ANSWER))
    const outcome = await analyseMealText(
      [groq()],
      'une pomme',
      fetchImpl as unknown as typeof fetch,
    )
    expect(outcome.analysis.items).toHaveLength(2)
    expect(fetchImpl).toHaveBeenCalledTimes(2)
  })

  it('passe au provider suivant après un quota atteint', async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(new Response('rate limited', { status: 429 }))
      .mockResolvedValueOnce(reply(ANSWER))
    const outcome = await analyseMealText(
      [groq(), { id: 'openrouter', settings: { apiKey: 'k', enabled: true, textModel: 'a/b' } }],
      'une pomme',
      fetchImpl as unknown as typeof fetch,
    )
    expect(outcome.providerId).toBe('openrouter')
  })

  it('remonte une erreur typée quand aucun provider ne répond', async () => {
    const fetchImpl = vi.fn(async () => new Response('boom', { status: 500 }))
    await expect(
      analyseMealText([groq()], 'une pomme', fetchImpl as unknown as typeof fetch),
    ).rejects.toBeInstanceOf(LlmError)
  })

  it("refuse d'appeler quoi que ce soit sans provider configuré", async () => {
    await expect(analyseMealText([], 'une pomme')).rejects.toMatchObject({ kind: 'auth' })
  })
})
```

- [ ] **Step 2: Lancer le test, vérifier qu'il échoue**

```bash
npm test -- llm/meal
```
Attendu : ÉCHEC, `analyseMealText` n'est pas exportée.

- [ ] **Step 3: Implémenter dans `src/lib/llm/meal.ts`**

Ajouter à l'import de prompt : `MEAL_TEXT_SYSTEM_PROMPT`, `mealTextUserPrompt`. Puis, à la suite du chemin photo :

```ts
/**
 * One provider, reading a written meal, with a single repair attempt.
 *
 * Deliberately the same shape as the photo path: same system rules, same JSON
 * contract, same parser, same one retry. The only difference is that there is no
 * image to weigh, so no size ceiling to check.
 */
export async function analyseTextWithProvider(
  provider: ConfiguredProvider,
  description: string,
  fetchImpl: typeof fetch = fetch,
): Promise<MealAnalysis> {
  const messages: unknown[] = [
    { role: 'system', content: MEAL_TEXT_SYSTEM_PROMPT },
    { role: 'user', content: mealTextUserPrompt(description) },
  ]

  let useFallbackModel = false
  let first: string
  try {
    first = await postCompletion(
      provider.id,
      provider.settings,
      messages,
      fetchImpl,
      false,
      'text',
    )
  } catch (error) {
    const retryable =
      error instanceof LlmError &&
      error.kind === 'model' &&
      !provider.settings.textModel?.trim() &&
      Boolean(PROVIDERS[provider.id].fallbackTextModel)
    if (!retryable) throw error
    useFallbackModel = true
    first = await postCompletion(provider.id, provider.settings, messages, fetchImpl, true, 'text')
  }

  const parsed = parseAnalysis(first)
  if (parsed) return parsed

  const repaired = await postCompletion(
    provider.id,
    provider.settings,
    [
      ...messages,
      { role: 'assistant', content: first },
      { role: 'user', content: repairPrompt(first) },
    ],
    fetchImpl,
    useFallbackModel,
    'text',
  )
  const second = parseAnalysis(repaired)
  if (second) return second
  throw new LlmError('bad_response', 'Réponse illisible', provider.id)
}

/**
 * Walks the chain until one provider answers.
 *
 * Same policy as the photo chain: an auth failure does not stop the walk, and
 * the last error is what surfaces.
 */
export async function analyseMealText(
  providers: ConfiguredProvider[],
  description: string,
  fetchImpl: typeof fetch = fetch,
): Promise<AnalyseOutcome> {
  if (providers.length === 0) {
    throw new LlmError('auth', 'Aucun service configuré')
  }
  let last: unknown = null
  for (const provider of providers) {
    try {
      const analysis = await analyseTextWithProvider(provider, description, fetchImpl)
      return { analysis, providerId: provider.id }
    } catch (error) {
      last = error
    }
  }
  throw last instanceof LlmError ? last : new LlmError('network', 'Analyse impossible')
}
```

`PROVIDERS` doit être ajouté à l'import depuis `@/lib/llm/client`.

- [ ] **Step 4: Lancer les tests**

```bash
npm test -- llm
npm run typecheck
npm run lint
```
Attendu : vert.

- [ ] **Step 5: Commit**

```bash
git add src/lib/llm
git commit -m "feat: analyser un repas décrit en texte"
```

---

### Task 5: Décrire un repas depuis l'écran Nutrition

**Files:**
- Modify: `src/types/models.ts:184` (`MealSource`)
- Modify: `src/db/repositories/mealRepository.ts`
- Modify: `src/features/nutrition/useMeals.ts`
- Modify: `src/screens/NutritionScreen.tsx`
- Modify: `src/features/meals/MealEditorSheet.tsx`
- Modify: `src/features/nutrition/DayJournal.tsx:113-118`
- Modify: `src/i18n/fr.ts` (bloc `meals`, ligne 351 ; bloc `nutrition`)
- Create: `src/features/meals/DescribeMealSheet.tsx`
- Test: `src/features/meals/DescribeMealSheet.test.tsx`, `src/db/repositories/mealRepository.test.ts` (existant, ajouts)

**Interfaces:**
- Consumes: `analyseMealText` (Task 4), `applyAnalysis`, `markAnalysing`, `markFailed`, `configuredProviders` (existants).
- Produces: `createTextMeal(description: string, options?: { date?: IsoDate; slot?: MealSlot }, database?: RecompDb): Promise<MealEntry>` ; `MealsState.describeMeal(description: string): Promise<void>` ; `<DescribeMealSheet open onClose onSubmit={(description: string) => void} pending={boolean} />`.

- [ ] **Step 1: Écrire les tests qui échouent**

Ajouter à `src/db/repositories/mealRepository.test.ts`. **Ce fichier ouvre une base Dexie jetable par test** (`let db: RecompDb` + `beforeEach`) et passe `db` en dernier argument de chaque appel : l'omettre écrit dans la base partagée et rend les tests dépendants les uns des autres. Ajouter `createTextMeal` à l'import existant en tête de fichier.

```ts
describe('createTextMeal', () => {
  it('écrit un repas en attente qui porte sa description', async () => {
    const meal = await createTextMeal('200 g de poulet', {}, db)
    expect(meal.status).toBe('pending')
    expect(meal.source).toBe('ai_text')
    expect(meal.hint).toBe('200 g de poulet')
    expect(meal.label).toBe('200 g de poulet')
    expect(meal.items).toEqual([])
  })

  it('coupe un label trop long sans perdre la description', async () => {
    const long = 'a'.repeat(200)
    const meal = await createTextMeal(long, {}, db)
    expect(meal.label.length).toBeLessThanOrEqual(80)
    expect(meal.hint).toBe(long)
  })

  it('apparaît dans la file des repas à analyser', async () => {
    const meal = await createTextMeal('une pomme', {}, db)
    const queue = await pendingMeals(db)
    expect(queue.map((row) => row.id)).toContain(meal.id)
  })
})

describe('editMeal sur un repas texte', () => {
  it('passe ai_text à corrected quand les lignes changent', async () => {
    const meal = await createTextMeal('une pomme', {}, db)
    await applyAnalysis(
      meal.id,
      {
        label: 'Pomme',
        items: [{ name: 'Pomme', quantity: '1', kcal: 80, proteinG: 0, carbsG: 21, fatG: 0 }],
        kcal: 80,
        proteinG: 0,
        carbsG: 21,
        fatG: 0,
        confidence: 'medium',
      },
      'groq',
      TARGET,
      db,
    )
    const edited = await editMeal(
      meal.id,
      { items: [{ name: 'Pomme', quantity: '2', kcal: 160, proteinG: 0, carbsG: 42, fatG: 0 }] },
      TARGET,
      db,
    )
    expect(edited?.source).toBe('corrected')
  })
})
```

Créer `src/features/meals/DescribeMealSheet.test.tsx` :

```tsx
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DescribeMealSheet } from '@/features/meals/DescribeMealSheet'

function setup(pending = false) {
  const onSubmit = vi.fn()
  render(<DescribeMealSheet open pending={pending} onClose={vi.fn()} onSubmit={onSubmit} />)
  return { onSubmit, user: userEvent.setup() }
}

describe('DescribeMealSheet', () => {
  it('refuse de soumettre une description vide', () => {
    setup()
    expect(screen.getByRole('button', { name: 'Analyser' })).toBeDisabled()
  })

  it('transmet la description saisie', async () => {
    const { onSubmit, user } = setup()
    await user.type(screen.getByRole('textbox'), '200 g de poulet')
    await user.click(screen.getByRole('button', { name: 'Analyser' }))
    expect(onSubmit).toHaveBeenCalledWith('200 g de poulet')
  })

  it('coupe les espaces autour', async () => {
    const { onSubmit, user } = setup()
    await user.type(screen.getByRole('textbox'), '  une pomme  ')
    await user.click(screen.getByRole('button', { name: 'Analyser' }))
    expect(onSubmit).toHaveBeenCalledWith('une pomme')
  })

  it("désactive le bouton pendant l'analyse", () => {
    setup(true)
    expect(screen.getByRole('button', { name: 'Analyse en cours…' })).toBeDisabled()
  })
})
```

- [ ] **Step 2: Lancer les tests, vérifier qu'ils échouent**

```bash
npm test -- mealRepository DescribeMealSheet
```
Attendu : ÉCHEC — `createTextMeal` et `DescribeMealSheet` n'existent pas.

- [ ] **Step 3: Ouvrir `MealSource`**

`src/types/models.ts` :

```ts
/**
 * Where a meal's numbers come from.
 *
 * `barcode` is not `manual`: a scanned product carries the manufacturer's own
 * figures, which is a different claim to accuracy than a number someone typed.
 * `ai_text` is not `ai`: one read a photo, the other read a sentence, and only
 * the first can be re-run against an image.
 */
export type MealSource = 'ai' | 'ai_text' | 'barcode' | 'manual' | 'corrected'
```

- [ ] **Step 4: Ajouter `createTextMeal` au dépôt**

Dans `src/db/repositories/mealRepository.ts`, après `createPendingMeal` :

```ts
/**
 * A meal described in words, queued for analysis.
 *
 * Written before the call like a photographed one, and for the same reason: the
 * retry queue must be able to pick it up after a closed tab or a dead network.
 * The description lives in `hint`, the field that already means « what the user
 * told the model », so a retry starts from it rather than from nothing.
 */
export async function createTextMeal(
  description: string,
  options: { date?: IsoDate; slot?: MealSlot } = {},
  database: RecompDb = db,
): Promise<MealEntry> {
  const now = nowIso()
  const date = options.date ?? toLogicalDate()
  const text = description.trim()
  const meal: MealEntry = {
    id: createId(),
    date,
    timestamp: now,
    slot: options.slot ?? slotForHour(new Date().getHours()),
    // Shown in the journal while the analysis runs, so the row says what it is
    // instead of « repas » for as long as the call takes.
    label: text.slice(0, 80),
    items: [],
    kcal: 0,
    proteinG: 0,
    carbsG: 0,
    fatG: 0,
    confidence: 'low',
    source: 'ai_text',
    status: 'pending',
    hint: text,
    createdAt: now,
    updatedAt: now,
  }
  await database.meals.add(meal)
  return meal
}
```

Dans `editMeal`, la ligne `source:` devient :

```ts
    source:
      itemsChanged && (meal.source === 'ai' || meal.source === 'ai_text')
        ? 'corrected'
        : meal.source,
```

- [ ] **Step 5: Brancher la file d'analyse sur les deux modalités**

Dans `src/features/nutrition/useMeals.ts`, l'import passe à :

```ts
import { analyseMeal, analyseMealText, configuredProviders, VisionError } from '@/lib/vision/providers'
```

`providers.ts` doit donc ré-exporter `analyseMealText` — ajouter la ligne au bloc d'export de Task 1 :

```ts
export {
  analyseMealPhoto as analyseMeal,
  analyseMealText,
  analysePhotoWithProvider as analyseWithProvider,
  type AnalyseInput,
  type AnalyseOutcome,
} from '@/lib/llm/meal'
```

Dans `analyse`, le bloc qui lit la photo devient sensible à la source. Remplacer, dans le corps de `analyse`, depuis `const photo = await getMealPhoto(mealId)` jusqu'au `try`, par :

```ts
    const meal = await getMeal(mealId)
    if (!meal) return
    const isText = meal.source === 'ai_text'

    const photo = isText ? null : await getMealPhoto(mealId)
    if (!isText && !photo) {
      await markFailed(mealId, t.meals.photoGone)
      return
    }
    if (isText && !meal.hint) {
      await markFailed(mealId, t.meals.descriptionGone)
      return
    }

    inFlight.add(mealId)
    setAnalysing((current) => (current.includes(mealId) ? current : [...current, mealId]))
    await markAnalysing(mealId, hint)
    // A retry with no new correction keeps the last one: the reading it produced
    // is still better than the one that made the user type it.
    const effectiveHint = hint?.trim() || meal.hint
    // Read here rather than inside the call: the photo branch is already guarded
    // above, and this keeps the call free of a non-null assertion.
    const dataUrl = photo ? bytesToDataUrl(photo.bytes, photo.mimeType) : ''
    try {
      const outcome = isText
        ? await analyseMealText(providersNow, effectiveHint ?? '')
        : await analyseMeal(providersNow, { dataUrl, hint: effectiveHint })
```

Le reste du `try`/`catch`/`finally` ne change pas.

> **Pas de `photo!`.** ESLint tourne avec `--max-warnings 0` et `@typescript-eslint/recommended` classe `no-non-null-assertion` en avertissement : une assertion `!` fait échouer `npm run lint`. Le `dataUrl` calculé au-dessus est là pour ça.

> Sur un repas texte, une « correction » **est** la nouvelle description : c'est le même champ, relu par le même modèle. Aucun cas particulier à écrire.

Ajouter à l'objet retourné par le hook, à côté de `addManual` :

```ts
    describeMeal: useCallback(
      async (description: string) => {
        const meal = await createTextMeal(description)
        haptic()
        await analyse(meal.id)
      },
      [analyse],
    ),
```

et à `MealsState` :

```ts
  /** Queues a meal described in words, then analyses it. */
  describeMeal: (description: string) => Promise<void>
```

`createTextMeal` s'ajoute à l'import du dépôt.

- [ ] **Step 6: Écrire `DescribeMealSheet`**

Créer `src/features/meals/DescribeMealSheet.tsx` :

```tsx
import { useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/input'
import { Sheet } from '@/components/ui/sheet'
import { t } from '@/i18n/fr'

interface DescribeMealSheetProps {
  open: boolean
  onClose: () => void
  onSubmit: (description: string) => void
  /** True while the analysis is in flight. */
  pending: boolean
}

/**
 * A meal told rather than photographed.
 *
 * The one thing this screen has to get right is that the person is not filling a
 * form: they are saying what they ate. So it is one free-text box, and the
 * prompt behind it — not the field — carries the demand for quantities.
 */
export function DescribeMealSheet({ open, onClose, onSubmit, pending }: DescribeMealSheetProps) {
  const [text, setText] = useState('')

  useEffect(() => {
    if (open) setText('')
  }, [open])

  return (
    <Sheet open={open} onClose={onClose} title={t.meals.describeTitle}>
      <div className="flex flex-col gap-3">
        <p className="text-sm text-muted-foreground">{t.meals.describeHint}</p>
        <Textarea
          aria-label={t.meals.describeTitle}
          value={text}
          placeholder={t.meals.describePlaceholder}
          className="min-h-[120px]"
          onChange={(event) => setText(event.target.value)}
        />
        <Button
          size="lg"
          block
          disabled={!text.trim() || pending}
          onClick={() => onSubmit(text.trim())}
        >
          <Sparkles size={16} aria-hidden />
          {pending ? t.meals.analysing : t.meals.describeSubmit}
        </Button>
      </div>
    </Sheet>
  )
}
```

- [ ] **Step 7: Ajouter les textes**

`src/i18n/fr.ts`, bloc `meals` :

```ts
    describeTitle: 'Décrire un repas',
    describeHint:
      'Dis ce que tu as mangé, avec les quantités si tu les connais. Ce que tu ne précises pas sera estimé — et l’estimation le dira.',
    describePlaceholder: '200 g de poulet, un bol de riz, une cuillère d’huile',
    describeSubmit: 'Analyser',
    descriptionGone: 'description perdue',
    textBadge: 'décrit',
```

bloc `nutrition` :

```ts
    describeMeal: 'Décrire',
```

- [ ] **Step 8: Brancher l'écran**

Dans `src/screens/NutritionScreen.tsx`, remplacer la grille `grid-cols-2` par :

```tsx
        <div className="grid grid-cols-2 gap-2">
          <Link
            to="/nutrition/catalogues"
            className={buttonVariants({ variant: 'outline', size: 'lg' })}
          >
            {t.nutrition.whatToEat}
          </Link>
          <Button
            variant="secondary"
            size="lg"
            disabled={!meals.canAnalyse || capturing}
            onClick={() => fileInput.current?.click()}
          >
            <Camera size={18} aria-hidden />
            {capturing ? t.meals.capturing : t.nutrition.aMeal}
          </Button>
          <Button
            variant="secondary"
            size="lg"
            disabled={!meals.canAnalyse}
            onClick={() => setDescribeOpen(true)}
          >
            <Sparkles size={18} aria-hidden />
            {t.nutrition.describeMeal}
          </Button>
        </div>
```

(La quatrième case reste vide jusqu'à Task 8, qui y pose « Code-barres ».)

Ajouter les états et la feuille :

```tsx
  const [describeOpen, setDescribeOpen] = useState(false)
  const [describing, setDescribing] = useState(false)
```

```tsx
      <DescribeMealSheet
        open={describeOpen}
        pending={describing}
        onClose={() => setDescribeOpen(false)}
        onSubmit={(description) => {
          setDescribing(true)
          void meals
            .describeMeal(description)
            .catch(() => showToast(t.meals.unknownError))
            .finally(() => {
              setDescribing(false)
              setDescribeOpen(false)
            })
        }}
      />
```

Imports à ajouter : `Sparkles` depuis `lucide-react`, `DescribeMealSheet`.

- [ ] **Step 9: Afficher la source dans le journal et l'éditeur**

`src/features/nutrition/DayJournal.tsx`, le calcul de `badge` :

```tsx
        const badge =
          meal.source === 'corrected'
            ? t.meals.correctedBadge
            : meal.source === 'manual'
              ? t.meals.manualBadge
              : meal.source === 'ai_text'
                ? t.meals.textBadge
                : null
```

`src/features/meals/MealEditorSheet.tsx` : la condition qui montre la confiance devient

```tsx
        {meal?.status === 'done' && (meal.source === 'ai' || meal.source === 'ai_text') ? (
```

et le bloc de correction, qui exige aujourd'hui une photo, accepte un repas texte. Remplacer `{meal.photoId ? ( … ) : ( <p>{t.meals.hintNoPhoto}</p> )}` par :

```tsx
            {meal.photoId || meal.source === 'ai_text' ? (
              <>
                <Textarea
                  aria-label={t.meals.hintTitle}
                  value={hint}
                  placeholder={t.meals.hintPlaceholder}
                  onChange={(event) => setHint(event.target.value)}
                />
                <Button
                  variant="secondary"
                  block
                  className="mt-2"
                  disabled={!hint.trim()}
                  onClick={() => onRetry(meal.id, hint.trim())}
                >
                  <RefreshCw size={16} aria-hidden />
                  {t.meals.hintSubmit}
                </Button>
              </>
            ) : (
              <p className="text-xs text-muted-foreground">{t.meals.hintNoPhoto}</p>
            )}
```

- [ ] **Step 10: Lancer la suite**

```bash
npm test
npm run typecheck
npm run lint
```
Attendu : vert. `journal.test.ts` et `SettingsScreen.test.tsx` ne connaissent pas les nouvelles valeurs de `MealSource` et ne doivent pas casser ; si l'un casse, c'est un `switch` non exhaustif à compléter.

- [ ] **Step 11: Commit**

```bash
git add src/types/models.ts src/db/repositories/mealRepository.ts src/features src/screens/NutritionScreen.tsx src/i18n/fr.ts
git commit -m "feat: décrire un repas en texte plutôt que le photographier"
```

---

### Task 6: Une précision facultative avant que la photo parte

**Files:**
- Modify: `src/features/nutrition/useMeals.ts`
- Modify: `src/lib/llm/meal.ts` (choix du prompt selon l'antériorité)
- Modify: `src/screens/NutritionScreen.tsx`
- Modify: `src/i18n/fr.ts` (bloc `meals`)
- Create: `src/features/meals/CapturePreviewSheet.tsx`
- Test: `src/features/meals/CapturePreviewSheet.test.tsx`

**Interfaces:**
- Consumes: `contextPrompt` (Task 2), `encodePhoto`/`EncodedImage` (`@/lib/image`), `createPendingMeal` (existant).
- Produces: `interface StagedPhoto { encoded: EncodedImage; previewUrl: string }` ; `MealsState.stageCapture(file: File): Promise<StagedPhoto>` ; `MealsState.confirmCapture(staged: StagedPhoto, context?: string): Promise<void>` ; `MealsState.discardCapture(staged: StagedPhoto): void` ; `AnalyseInput` gagne `isCorrection?: boolean` ; `<CapturePreviewSheet open previewUrl onCancel onConfirm={(context: string) => void} pending />`.
- `MealsState.capture` **disparaît** : plus aucun appelant après cette tâche.

- [ ] **Step 1: Écrire le test qui échoue**

Créer `src/features/meals/CapturePreviewSheet.test.tsx` :

```tsx
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CapturePreviewSheet } from '@/features/meals/CapturePreviewSheet'

function setup(pending = false) {
  const onConfirm = vi.fn()
  const onCancel = vi.fn()
  render(
    <CapturePreviewSheet
      open
      pending={pending}
      previewUrl="blob:fake"
      onCancel={onCancel}
      onConfirm={onConfirm}
    />,
  )
  return { onConfirm, onCancel, user: userEvent.setup() }
}

describe('CapturePreviewSheet', () => {
  it('analyse sans précision', async () => {
    const { onConfirm, user } = setup()
    await user.click(screen.getByRole('button', { name: 'Analyser' }))
    expect(onConfirm).toHaveBeenCalledWith('')
  })

  it('analyse avec la précision saisie', async () => {
    const { onConfirm, user } = setup()
    await user.type(screen.getByRole('textbox'), 'le riz est complet')
    await user.click(screen.getByRole('button', { name: 'Analyser' }))
    expect(onConfirm).toHaveBeenCalledWith('le riz est complet')
  })

  it("montre l'aperçu de la photo qui va partir", () => {
    setup()
    expect(screen.getByRole('img')).toHaveAttribute('src', 'blob:fake')
  })

  it('annule sans analyser', async () => {
    const { onCancel, onConfirm, user } = setup()
    await user.click(screen.getByRole('button', { name: 'Annuler' }))
    expect(onCancel).toHaveBeenCalled()
    expect(onConfirm).not.toHaveBeenCalled()
  })

  it("désactive l'analyse pendant qu'elle tourne", () => {
    setup(true)
    expect(screen.getByRole('button', { name: 'Analyse en cours…' })).toBeDisabled()
  })
})
```

- [ ] **Step 2: Lancer le test, vérifier qu'il échoue**

```bash
npm test -- CapturePreviewSheet
```
Attendu : ÉCHEC, le module n'existe pas.

- [ ] **Step 3: Distinguer contexte et correction dans `src/lib/llm/meal.ts`**

`AnalyseInput` :

```ts
export interface AnalyseInput {
  /** `data:image/webp;base64,…` — the bytes travel in the request, never hosted. */
  dataUrl: string
  /** What the user said about the plate, e.g. « le riz est complet ». */
  hint?: string
  /**
   * True when `hint` answers a reading that was wrong, false when it is what the
   * user knew before anyone looked.
   *
   * The two are the same sentence and a different instruction: a correction
   * overrides a previous answer, a context has none to override. Telling a model
   * to discard a reading that never happened is how it starts inventing one.
   */
  isCorrection?: boolean
}
```

`messageContent` :

```ts
function messageContent(input: AnalyseInput) {
  const said = input.hint?.trim()
  const framed = said
    ? input.isCorrection
      ? hintPrompt(said)
      : contextPrompt(said)
    : null
  const text = framed ? `${MEAL_PHOTO_USER_PROMPT}\n\n${framed}` : MEAL_PHOTO_USER_PROMPT
  return [
    { type: 'text', text },
    { type: 'image_url', image_url: { url: input.dataUrl } },
  ]
}
```

Ajouter `contextPrompt` à l'import de prompt.

- [ ] **Step 4: Couper la capture en deux temps dans `src/features/nutrition/useMeals.ts`**

Remplacer `capture` par :

```ts
export interface StagedPhoto {
  encoded: EncodedImage
  /** Object URL for the preview. Revoked by `confirmCapture` or `discardCapture`. */
  previewUrl: string
}
```

```ts
  /**
   * Encodes the photo and stops.
   *
   * Nothing is written yet: the sheet that follows can be cancelled, and a meal
   * the user backed out of has no business being in the journal.
   */
  const stageCapture = useCallback(async (file: File): Promise<StagedPhoto> => {
    const encoded = await encodePhoto(file, MEAL_MAX_EDGE_PX, MEAL_WEBP_QUALITY)
    const previewUrl = URL.createObjectURL(new Blob([encoded.bytes], { type: encoded.mimeType }))
    return { encoded, previewUrl }
  }, [])

  const confirmCapture = useCallback(
    async (staged: StagedPhoto, context?: string) => {
      URL.revokeObjectURL(staged.previewUrl)
      const meal = await createPendingMeal({
        bytes: staged.encoded.bytes,
        mimeType: staged.encoded.mimeType,
        byteSize: staged.encoded.byteSize,
      })
      haptic()
      await analyse(meal.id, context)
    },
    [analyse],
  )

  const discardCapture = useCallback((staged: StagedPhoto) => {
    URL.revokeObjectURL(staged.previewUrl)
  }, [])
```

`MealsState` perd `capture` et gagne les trois. Import : `type EncodedImage` depuis `@/lib/image`.

Dans `analyse`, l'appel photo transmet l'antériorité :

```ts
      const outcome = isText
        ? await analyseMealText(providersNow, effectiveHint ?? '')
        : await analyseMeal(providersNow, {
            dataUrl,
            hint: effectiveHint,
            // A meal that has already been read is being corrected; one that has
            // not is being introduced.
            isCorrection: meal.status === 'done' || meal.status === 'failed',
          })
```

- [ ] **Step 5: Écrire `CapturePreviewSheet`**

Créer `src/features/meals/CapturePreviewSheet.tsx` :

```tsx
import { useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/input'
import { Sheet } from '@/components/ui/sheet'
import { t } from '@/i18n/fr'

interface CapturePreviewSheetProps {
  open: boolean
  /** Object URL of the encoded photo, owned by the caller. */
  previewUrl: string
  onCancel: () => void
  onConfirm: (context: string) => void
  pending: boolean
}

/**
 * The half-second between taking the photo and sending it.
 *
 * It exists for one sentence: the person is still in front of the plate and
 * knows things the picture does not — that the rice is wholegrain, that the
 * sauce is light. Said here, it costs one call. Said afterwards in the
 * correction box, it costs two.
 */
export function CapturePreviewSheet({
  open,
  previewUrl,
  onCancel,
  onConfirm,
  pending,
}: CapturePreviewSheetProps) {
  const [context, setContext] = useState('')

  useEffect(() => {
    if (open) setContext('')
  }, [open])

  return (
    <Sheet open={open} onClose={onCancel} title={t.meals.previewTitle}>
      <div className="flex flex-col gap-3">
        <img
          src={previewUrl}
          alt={t.meals.previewAlt}
          className="h-48 w-full rounded-lg object-cover"
        />
        <p className="text-sm text-muted-foreground">{t.meals.previewHint}</p>
        <Textarea
          aria-label={t.meals.previewFieldLabel}
          value={context}
          placeholder={t.meals.previewPlaceholder}
          onChange={(event) => setContext(event.target.value)}
        />
        <Button size="lg" block disabled={pending} onClick={() => onConfirm(context.trim())}>
          <Sparkles size={16} aria-hidden />
          {pending ? t.meals.analysing : t.meals.previewSubmit}
        </Button>
        <Button variant="outline" block disabled={pending} onClick={onCancel}>
          {t.common.cancel}
        </Button>
      </div>
    </Sheet>
  )
}
```

`t.common.cancel` vaut « Annuler » (`src/i18n/fr.ts:561`) — rien à ajouter pour ce bouton.

- [ ] **Step 6: Ajouter les textes**

`src/i18n/fr.ts`, bloc `meals` :

```ts
    previewTitle: 'Avant d’analyser',
    previewAlt: 'Photo du repas à analyser',
    previewHint:
      'Ajoute ce que la photo ne dit pas — une cuisson, un ingrédient caché, une marque. Facultatif.',
    previewFieldLabel: 'Précisions (facultatif)',
    previewPlaceholder: 'riz complet, cuit sans huile',
    previewSubmit: 'Analyser',
```

- [ ] **Step 7: Brancher l'écran**

Dans `src/screens/NutritionScreen.tsx`, remplacer `onFile` et l'état `capturing` :

```tsx
  const [staged, setStaged] = useState<StagedPhoto | null>(null)
  const [capturing, setCapturing] = useState(false)
  const [analysingCapture, setAnalysingCapture] = useState(false)

  const onFile = async (file: File | undefined) => {
    if (!file) return
    setCapturing(true)
    try {
      setStaged(await meals.stageCapture(file))
    } catch {
      showToast(t.photos.failed)
    } finally {
      setCapturing(false)
    }
  }
```

et poser la feuille :

```tsx
      {staged ? (
        <CapturePreviewSheet
          open
          previewUrl={staged.previewUrl}
          pending={analysingCapture}
          onCancel={() => {
            meals.discardCapture(staged)
            setStaged(null)
          }}
          onConfirm={(context) => {
            setAnalysingCapture(true)
            void meals
              .confirmCapture(staged, context || undefined)
              .catch(() => showToast(t.meals.unknownError))
              .finally(() => {
                setAnalysingCapture(false)
                setStaged(null)
              })
          }}
        />
      ) : null}
```

Imports : `CapturePreviewSheet`, `type StagedPhoto` depuis `@/features/nutrition/useMeals`.

- [ ] **Step 8: Lancer la suite**

```bash
npm test
npm run typecheck
npm run lint
```
Attendu : vert. `npm run typecheck` signalera tout appelant restant de `meals.capture` — il ne doit plus y en avoir.

- [ ] **Step 9: Commit**

```bash
git add src/features src/screens/NutritionScreen.tsx src/lib/llm/meal.ts src/i18n/fr.ts
git commit -m "feat: donner une précision facultative avant l'analyse de la photo"
```

---

### Task 7: OpenFoodFacts, sans écran

Toute la logique tordue, testée sans DOM ni réseau. Aucun composant dans cette tâche.

**Files:**
- Create: `src/lib/off/product.ts`, `src/lib/off/product.test.ts`
- Create: `src/lib/off/client.ts`, `src/lib/off/client.test.ts`
- Create: `src/lib/off/barcode.ts`, `src/lib/off/barcode.test.ts`

**Interfaces:**
- Consumes: `MealItem` (`@/types/models`).
- Produces:
  - `interface OffProduct { code: string; name: string; brand?: string; servingGrams: number; per100g: { kcal: number; proteinG: number; carbsG: number; fatG: number }; missingMacros: string[] }`
  - `type OffErrorKind = 'not_found' | 'no_nutriments' | 'network' | 'server' | 'bad_response'`
  - `class OffError extends Error { readonly kind: OffErrorKind }`
  - `function parseProduct(raw: unknown): OffProduct` (lance `OffError`)
  - `function toMealItem(product: OffProduct, grams: number): MealItem`
  - `function fetchProduct(barcode: string, fetchImpl?: typeof fetch): Promise<OffProduct>`
  - `function isValidEan(digits: string): boolean`
  - `function isBarcodeScanSupported(): boolean`
  - `function detectBarcode(source: CanvasImageSource): Promise<string | null>`

- [ ] **Step 1: Écrire `src/lib/off/product.test.ts`**

```ts
import { describe, expect, it } from 'vitest'
import { OffError, parseProduct, toMealItem } from '@/lib/off/product'

function raw(overrides: Record<string, unknown> = {}) {
  return {
    code: '3017620422003',
    product_name: 'Nutella',
    brands: 'Ferrero',
    nutriments: {
      'energy-kcal_100g': 539,
      proteins_100g: 6.3,
      carbohydrates_100g: 57.5,
      fat_100g: 30.9,
    },
    ...overrides,
  }
}

describe('parseProduct', () => {
  it('lit les macros pour 100 g', () => {
    const product = parseProduct(raw())
    expect(product.per100g).toEqual({ kcal: 539, proteinG: 6.3, carbsG: 57.5, fatG: 30.9 })
    expect(product.name).toBe('Nutella')
    expect(product.brand).toBe('Ferrero')
    expect(product.missingMacros).toEqual([])
  })

  it('convertit depuis les kilojoules quand les kcal manquent', () => {
    const product = parseProduct(
      raw({ nutriments: { energy_100g: 2252, proteins_100g: 6.3, carbohydrates_100g: 57.5, fat_100g: 30.9 } }),
    )
    expect(product.per100g.kcal).toBe(538)
  })

  it('refuse un produit sans aucune énergie', () => {
    expect(() =>
      parseProduct(raw({ nutriments: { proteins_100g: 6.3, carbohydrates_100g: 57.5, fat_100g: 30.9 } })),
    ).toThrowError(expect.objectContaining({ kind: 'no_nutriments' }))
  })

  it('refuse un produit dont les trois macros manquent', () => {
    expect(() => parseProduct(raw({ nutriments: { 'energy-kcal_100g': 539 } }))).toThrowError(
      expect.objectContaining({ kind: 'no_nutriments' }),
    )
  })

  it('compte une macro absente à zéro et le signale', () => {
    const product = parseProduct(
      raw({ nutriments: { 'energy-kcal_100g': 539, proteins_100g: 6.3, fat_100g: 30.9 } }),
    )
    expect(product.per100g.carbsG).toBe(0)
    expect(product.missingMacros).toEqual(['carbsG'])
  })

  it('préfère le nom français', () => {
    expect(parseProduct(raw({ product_name_fr: 'Pâte à tartiner' })).name).toBe('Pâte à tartiner')
  })

  it('retombe sur le code quand aucun nom n’est donné', () => {
    const product = parseProduct(raw({ product_name: '', product_name_fr: '' }))
    expect(product.name).toBe('3017620422003')
  })

  it('lit une portion numérique', () => {
    expect(parseProduct(raw({ serving_quantity: 15 })).servingGrams).toBe(15)
  })

  it('extrait une portion écrite « 30 g »', () => {
    expect(parseProduct(raw({ serving_size: '30 g' })).servingGrams).toBe(30)
  })

  it('retombe sur 100 g quand la portion est vide ou illisible', () => {
    expect(parseProduct(raw({ serving_size: '' })).servingGrams).toBe(100)
    expect(parseProduct(raw({ serving_size: 'une poignée' })).servingGrams).toBe(100)
  })

  it('refuse une charge utile qui n’est pas un produit', () => {
    expect(() => parseProduct(null)).toThrowError(OffError)
    expect(() => parseProduct({ code: '123' })).toThrowError(
      expect.objectContaining({ kind: 'no_nutriments' }),
    )
  })
})

describe('toMealItem', () => {
  const product = parseProduct(raw({ serving_quantity: 15 }))

  it('met les macros à l’échelle de la quantité', () => {
    expect(toMealItem(product, 30)).toEqual({
      name: 'Nutella (Ferrero)',
      quantity: '30 g',
      kcal: 162,
      proteinG: 2,
      carbsG: 17,
      fatG: 9,
    })
  })

  it('rend les valeurs pour 100 g telles quelles', () => {
    const item = toMealItem(product, 100)
    expect(item.kcal).toBe(539)
    expect(item.carbsG).toBe(58)
  })

  it('arrondit sans jamais descendre sous zéro', () => {
    const item = toMealItem(product, 0)
    expect(item.kcal).toBe(0)
    expect(item.proteinG).toBe(0)
  })

  it('omet la marque quand il n’y en a pas', () => {
    const noBrand = parseProduct(raw({ brands: '' }))
    expect(toMealItem(noBrand, 100).name).toBe('Nutella')
  })
})
```

- [ ] **Step 2: Lancer, vérifier l'échec**

```bash
npm test -- off/product
```
Attendu : ÉCHEC, module absent.

- [ ] **Step 3: Écrire `src/lib/off/product.ts`**

```ts
/**
 * Turning an OpenFoodFacts record into something the journal can hold.
 *
 * The API is a community database: fields are optional, units vary, and a
 * product can exist with a name and nothing else. Everything tolerant lives
 * here, in pure functions, so the network layer stays a network layer and the
 * screen never has to ask what `serving_size: ""` means.
 */
import type { MealItem } from '@/types/models'

export type OffErrorKind = 'not_found' | 'no_nutriments' | 'network' | 'server' | 'bad_response'

export class OffError extends Error {
  constructor(
    readonly kind: OffErrorKind,
    message: string,
  ) {
    super(message)
    this.name = 'OffError'
  }
}

export interface OffProduct {
  code: string
  name: string
  brand?: string
  /** Grams for one serving; 100 when the record does not say. */
  servingGrams: number
  per100g: { kcal: number; proteinG: number; carbsG: number; fatG: number }
  /**
   * Macros the record was missing, counted as zero.
   *
   * Surfaced rather than swallowed: a product sheet reading « 0 g de glucides »
   * is a claim, and the user is entitled to know it was an absence.
   */
  missingMacros: string[]
}

/** kJ per kcal, the factor the food industry rounds with. */
const KJ_PER_KCAL = 4.184

const DEFAULT_SERVING_G = 100

function asNumber(value: unknown): number | null {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null
  if (typeof value !== 'string') return null
  const match = value.replace(',', '.').match(/-?\d+(\.\d+)?/)
  if (!match) return null
  const parsed = Number(match[0])
  return Number.isFinite(parsed) ? parsed : null
}

function asText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

/** Grams for one serving, from whichever of the two fields carries it. */
function servingGrams(record: Record<string, unknown>): number {
  const quantity = asNumber(record.serving_quantity)
  if (quantity !== null && quantity > 0) return Math.round(quantity)
  const size = asNumber(record.serving_size)
  if (size !== null && size > 0) return Math.round(size)
  return DEFAULT_SERVING_G
}

export function parseProduct(raw: unknown): OffProduct {
  if (!raw || typeof raw !== 'object') {
    throw new OffError('bad_response', 'Réponse illisible')
  }
  const record = raw as Record<string, unknown>
  const nutriments = (record.nutriments ?? {}) as Record<string, unknown>

  const kcalDirect = asNumber(nutriments['energy-kcal_100g'])
  const kj = asNumber(nutriments.energy_100g)
  const kcal = kcalDirect !== null ? Math.round(kcalDirect) : kj !== null ? Math.round(kj / KJ_PER_KCAL) : null

  const macros = {
    proteinG: asNumber(nutriments.proteins_100g),
    carbsG: asNumber(nutriments.carbohydrates_100g),
    fatG: asNumber(nutriments.fat_100g),
  }
  const missingMacros = Object.entries(macros)
    .filter(([, value]) => value === null)
    .map(([key]) => key)

  // No energy, or nothing but energy: whatever this record is, it is not a
  // nutrition table, and a sheet full of zeros would be a lie with a button on it.
  if (kcal === null || missingMacros.length === 3) {
    throw new OffError('no_nutriments', 'Valeurs nutritionnelles absentes')
  }

  const code = asText(record.code)
  return {
    code,
    name: asText(record.product_name_fr) || asText(record.product_name) || code,
    brand: asText(record.brands).split(',')[0]?.trim() || undefined,
    servingGrams: servingGrams(record),
    per100g: {
      kcal,
      proteinG: macros.proteinG ?? 0,
      carbsG: macros.carbsG ?? 0,
      fatG: macros.fatG ?? 0,
    },
    missingMacros,
  }
}

/** Scales the per-100 g figures to what the user says they ate. */
export function toMealItem(product: OffProduct, grams: number): MealItem {
  const ratio = Math.max(0, grams) / 100
  const scale = (value: number) => Math.round(value * ratio)
  return {
    name: product.brand ? `${product.name} (${product.brand})` : product.name,
    quantity: `${Math.round(Math.max(0, grams))} g`,
    kcal: scale(product.per100g.kcal),
    proteinG: scale(product.per100g.proteinG),
    carbsG: scale(product.per100g.carbsG),
    fatG: scale(product.per100g.fatG),
  }
}
```

- [ ] **Step 4: Lancer, vérifier le vert**

```bash
npm test -- off/product
```
Attendu : PASS. Contrôle d'arithmétique : `539 × 0,3 = 161,7 → 162` ; `2252 / 4,184 = 538,2 → 538`.

- [ ] **Step 5: Écrire `src/lib/off/client.test.ts`**

```ts
import { describe, expect, it, vi } from 'vitest'
import { fetchProduct } from '@/lib/off/client'

const BODY = {
  code: '3017620422003',
  status: 1,
  product: {
    code: '3017620422003',
    product_name: 'Nutella',
    brands: 'Ferrero',
    nutriments: {
      'energy-kcal_100g': 539,
      proteins_100g: 6.3,
      carbohydrates_100g: 57.5,
      fat_100g: 30.9,
    },
  },
}

function ok(payload: unknown): Response {
  return new Response(JSON.stringify(payload), { status: 200 })
}

describe('fetchProduct', () => {
  it('rend un produit analysé', async () => {
    const fetchImpl = vi.fn(async () => ok(BODY))
    const product = await fetchProduct('3017620422003', fetchImpl as unknown as typeof fetch)
    expect(product.name).toBe('Nutella')
  })

  it("interroge l'endpoint v2 en s'identifiant", async () => {
    const fetchImpl = vi.fn(async () => ok(BODY))
    await fetchProduct('3017620422003', fetchImpl as unknown as typeof fetch)
    const url = String(fetchImpl.mock.calls[0][0])
    expect(url).toContain('https://world.openfoodfacts.org/api/v2/product/3017620422003.json')
    expect(url).toContain('app_name=RecompOS')
    expect(url).toContain('fields=')
  })

  it("n'essaie pas d'écrire un User-Agent, que le navigateur interdit", async () => {
    const fetchImpl = vi.fn(async () => ok(BODY))
    await fetchProduct('3017620422003', fetchImpl as unknown as typeof fetch)
    const init = (fetchImpl.mock.calls[0][1] ?? {}) as RequestInit
    expect(JSON.stringify(init.headers ?? {})).not.toMatch(/user-agent/i)
  })

  it('traite status 0 comme un produit inconnu, malgré le HTTP 200', async () => {
    const fetchImpl = vi.fn(async () => ok({ code: '0000', status: 0, status_verbose: 'no code' }))
    await expect(
      fetchProduct('0000000000000', fetchImpl as unknown as typeof fetch),
    ).rejects.toMatchObject({ kind: 'not_found' })
  })

  it('remonte une erreur serveur sur un 429', async () => {
    const fetchImpl = vi.fn(async () => new Response('slow down', { status: 429 }))
    await expect(
      fetchProduct('3017620422003', fetchImpl as unknown as typeof fetch),
    ).rejects.toMatchObject({ kind: 'server' })
  })

  it('remonte une panne réseau', async () => {
    const fetchImpl = vi.fn(async () => {
      throw new TypeError('failed to fetch')
    })
    await expect(
      fetchProduct('3017620422003', fetchImpl as unknown as typeof fetch),
    ).rejects.toMatchObject({ kind: 'network' })
  })

  it('remonte un corps illisible', async () => {
    const fetchImpl = vi.fn(async () => new Response('pas du json', { status: 200 }))
    await expect(
      fetchProduct('3017620422003', fetchImpl as unknown as typeof fetch),
    ).rejects.toMatchObject({ kind: 'bad_response' })
  })

  it('propage no_nutriments depuis le parseur', async () => {
    const fetchImpl = vi.fn(async () =>
      ok({ status: 1, product: { code: '1', product_name: 'Vide', nutriments: {} } }),
    )
    await expect(fetchProduct('1', fetchImpl as unknown as typeof fetch)).rejects.toMatchObject({
      kind: 'no_nutriments',
    })
  })
})
```

- [ ] **Step 6: Écrire `src/lib/off/client.ts`**

```ts
/**
 * Reading OpenFoodFacts from the page.
 *
 * Verified on 28/08/2026: the v2 endpoint answers `access-control-allow-origin: *`
 * and needs no key for reads, so this is an outgoing call like the model
 * providers — not a backend (PRD décision n°5). The documented `User-Agent`
 * identification is impossible from a browser, which forbids writing that
 * header, so the app names itself in the query string instead.
 */
import { OffError, parseProduct, type OffProduct } from '@/lib/off/product'

const BASE_URL = 'https://world.openfoodfacts.org/api/v2/product'

/** Asking for everything costs seconds on a phone; these are what the sheet reads. */
const FIELDS = [
  'code',
  'product_name',
  'product_name_fr',
  'brands',
  'quantity',
  'serving_size',
  'serving_quantity',
  'nutriments',
].join(',')

const REQUEST_TIMEOUT_MS = 10_000

export async function fetchProduct(
  barcode: string,
  fetchImpl: typeof fetch = fetch,
): Promise<OffProduct> {
  const url =
    `${BASE_URL}/${encodeURIComponent(barcode)}.json` +
    `?fields=${FIELDS}&app_name=RecompOS&app_version=${encodeURIComponent(__APP_VERSION__)}`

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  let response: Response
  try {
    response = await fetchImpl(url, { signal: controller.signal })
  } catch {
    throw new OffError('network', "Pas de réponse d'OpenFoodFacts")
  } finally {
    clearTimeout(timeout)
  }

  if (!response.ok) {
    throw new OffError('server', `Erreur ${response.status}`)
  }

  const payload = (await response.json().catch(() => null)) as {
    status?: number
    product?: unknown
  } | null
  if (!payload) throw new OffError('bad_response', 'Réponse illisible')

  // A code nobody has entered answers 200 with `status: 0`. Reading only the HTTP
  // status here would hand a missing product to the parser as if it were one.
  if (payload.status === 0 || !payload.product) {
    throw new OffError('not_found', "Produit inconnu d'OpenFoodFacts")
  }

  return parseProduct(payload.product)
}
```

`__APP_VERSION__` est déjà déclaré globalement (`vite.config.ts` le `define`, `src/vite-env.d.ts` le type). Vérifier sa présence dans `src/vite-env.d.ts` ; s'il n'y est pas, ajouter `declare const __APP_VERSION__: string`.

- [ ] **Step 7: Écrire `src/lib/off/barcode.test.ts`**

```ts
import { describe, expect, it } from 'vitest'
import { isValidEan } from '@/lib/off/barcode'

describe('isValidEan', () => {
  it('accepte un EAN-13 valide', () => {
    expect(isValidEan('3017620422003')).toBe(true)
  })

  it('accepte un EAN-8 valide', () => {
    expect(isValidEan('96385074')).toBe(true)
  })

  it('accepte un UPC-A valide, sur 12 chiffres', () => {
    expect(isValidEan('036000291452')).toBe(true)
  })

  it('refuse une somme de contrôle fausse', () => {
    expect(isValidEan('3017620422004')).toBe(false)
  })

  it('refuse une longueur inattendue', () => {
    expect(isValidEan('12345')).toBe(false)
    expect(isValidEan('')).toBe(false)
  })

  it('refuse ce qui n’est pas une suite de chiffres', () => {
    expect(isValidEan('30176204220a3')).toBe(false)
    expect(isValidEan('301 762 042 200 3')).toBe(false)
  })
})
```

- [ ] **Step 8: Écrire `src/lib/off/barcode.ts`**

```ts
/**
 * Reading a barcode, with the browser's own detector.
 *
 * `BarcodeDetector` ships in Chrome and in Safari 17+, and is absent elsewhere.
 * That is the whole reason the sheet above keeps a numeric field: a scanner
 * library would cost more bundle than every chart in the app put together, to
 * serve the browsers that are already the minority here.
 */

const SUPPORTED_LENGTHS = [8, 12, 13, 14]

/**
 * The trailing check digit, as defined for EAN/UPC.
 *
 * Worth having for the typed path: a mistyped digit is far more likely than a
 * misread scan, and catching it here saves a request and a wrong « produit
 * inconnu » that reads like OpenFoodFacts' fault.
 */
export function isValidEan(digits: string): boolean {
  if (!/^\d+$/.test(digits)) return false
  if (!SUPPORTED_LENGTHS.includes(digits.length)) return false

  const figures = digits.split('').map(Number)
  const check = figures.pop() as number
  // Weights run 3,1,3,1… from the rightmost digit before the check digit.
  const sum = figures
    .reverse()
    .reduce((total, digit, index) => total + digit * (index % 2 === 0 ? 3 : 1), 0)
  return (10 - (sum % 10)) % 10 === check
}

interface DetectedBarcode {
  rawValue: string
}

interface BarcodeDetectorLike {
  detect(source: CanvasImageSource): Promise<DetectedBarcode[]>
}

type BarcodeDetectorConstructor = new (options?: { formats?: string[] }) => BarcodeDetectorLike

function constructor(): BarcodeDetectorConstructor | null {
  const found = (globalThis as { BarcodeDetector?: BarcodeDetectorConstructor }).BarcodeDetector
  return typeof found === 'function' ? found : null
}

export function isBarcodeScanSupported(): boolean {
  return constructor() !== null
}

/** One frame, one look. Returns null when the frame holds no readable code. */
export async function detectBarcode(source: CanvasImageSource): Promise<string | null> {
  const Detector = constructor()
  if (!Detector) return null
  const detector = new Detector({ formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e'] })
  const results = await detector.detect(source).catch(() => [])
  const value = results[0]?.rawValue
  return value && isValidEan(value) ? value : null
}
```

- [ ] **Step 9: Lancer la suite**

```bash
npm test -- off
npm run typecheck
npm run lint
```
Attendu : les trois fichiers verts.

- [ ] **Step 10: Commit**

```bash
git add src/lib/off
git commit -m "feat: client OpenFoodFacts et lecture de code-barres"
```

---

### Task 8: Scanner un produit, depuis l'écran ou depuis un repas ouvert

**Files:**
- Create: `src/features/meals/BarcodeScanSheet.tsx`, `src/features/meals/BarcodeScanSheet.test.tsx`
- Create: `src/features/meals/ProductSheet.tsx`, `src/features/meals/ProductSheet.test.tsx`
- Create: `src/features/meals/useBarcode.ts`
- Modify: `src/db/repositories/mealRepository.ts` (`createBarcodeMeal`)
- Modify: `src/features/nutrition/useMeals.ts` (`addProduct`)
- Modify: `src/screens/NutritionScreen.tsx` (quatrième bouton)
- Modify: `src/features/meals/MealEditorSheet.tsx` (« Ajouter un produit »)
- Modify: `src/features/nutrition/DayJournal.tsx` (badge)
- Modify: `src/i18n/fr.ts`

**Interfaces:**
- Consumes: `fetchProduct`, `parseProduct`, `toMealItem`, `OffError`, `isValidEan`, `isBarcodeScanSupported`, `detectBarcode` (Task 7) ; `createManualMeal` (existant).
- Produces:
  - `createBarcodeMeal(item: MealItem, targetGrams: number, options?: { date?: IsoDate; slot?: MealSlot }, database?: RecompDb): Promise<MealEntry>`
  - `MealsState.addProduct(item: MealItem): Promise<void>`
  - `<BarcodeScanSheet open onClose onDetected={(barcode: string) => void} />`
  - `<ProductSheet open product={OffProduct} onClose onAdd={(item: MealItem) => void} />`
  - `useBarcode(): { open: boolean; product: OffProduct | null; error: string | null; loading: boolean; start(): void; close(): void; submit(barcode: string): Promise<void> }`

- [ ] **Step 1: Écrire les tests qui échouent**

Créer `src/features/meals/ProductSheet.test.tsx` :

```tsx
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProductSheet } from '@/features/meals/ProductSheet'
import type { OffProduct } from '@/lib/off/product'

const PRODUCT: OffProduct = {
  code: '3017620422003',
  name: 'Nutella',
  brand: 'Ferrero',
  servingGrams: 15,
  per100g: { kcal: 539, proteinG: 6.3, carbsG: 57.5, fatG: 30.9 },
  missingMacros: [],
}

function setup(product: OffProduct = PRODUCT) {
  const onAdd = vi.fn()
  render(<ProductSheet open product={product} onClose={vi.fn()} onAdd={onAdd} />)
  return { onAdd, user: userEvent.setup() }
}

describe('ProductSheet', () => {
  it('pré-remplit la quantité avec la portion du produit', () => {
    setup()
    expect(screen.getByLabelText('Quantité (g)')).toHaveValue('15')
  })

  it('affiche les macros de cette quantité', () => {
    setup()
    expect(screen.getByText('81 kcal')).toBeInTheDocument()
  })

  it('recalcule les macros quand la quantité change', async () => {
    const { user } = setup()
    const field = screen.getByLabelText('Quantité (g)')
    await user.clear(field)
    await user.type(field, '30')
    expect(screen.getByText('162 kcal')).toBeInTheDocument()
  })

  it('rend un MealItem à la quantité choisie', async () => {
    const { onAdd, user } = setup()
    const field = screen.getByLabelText('Quantité (g)')
    await user.clear(field)
    await user.type(field, '30')
    await user.click(screen.getByRole('button', { name: 'Ajouter' }))
    expect(onAdd).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Nutella (Ferrero)', quantity: '30 g', kcal: 162 }),
    )
  })

  it("refuse d'ajouter une quantité nulle", async () => {
    const { user } = setup()
    const field = screen.getByLabelText('Quantité (g)')
    await user.clear(field)
    expect(screen.getByRole('button', { name: 'Ajouter' })).toBeDisabled()
  })

  it('signale une macro que la fiche ne donnait pas', () => {
    setup({ ...PRODUCT, missingMacros: ['carbsG'] })
    expect(screen.getByText(/glucides/i)).toBeInTheDocument()
  })
})
```

Créer `src/features/meals/BarcodeScanSheet.test.tsx` :

```tsx
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BarcodeScanSheet } from '@/features/meals/BarcodeScanSheet'

function setup() {
  const onDetected = vi.fn()
  render(<BarcodeScanSheet open onClose={vi.fn()} onDetected={onDetected} />)
  return { onDetected, user: userEvent.setup() }
}

// jsdom ships neither BarcodeDetector nor getUserMedia, which is exactly the
// browser this fallback exists for.
describe('BarcodeScanSheet, sans caméra utilisable', () => {
  it('ouvre directement la saisie des chiffres', () => {
    setup()
    expect(screen.getByLabelText('Code-barres')).toBeInTheDocument()
  })

  it('refuse un code dont la somme de contrôle est fausse', async () => {
    const { onDetected, user } = setup()
    await user.type(screen.getByLabelText('Code-barres'), '3017620422004')
    await user.click(screen.getByRole('button', { name: 'Chercher' }))
    expect(onDetected).not.toHaveBeenCalled()
    expect(screen.getByText(/code-barres invalide/i)).toBeInTheDocument()
  })

  it('transmet un code valide', async () => {
    const { onDetected, user } = setup()
    await user.type(screen.getByLabelText('Code-barres'), '3017620422003')
    await user.click(screen.getByRole('button', { name: 'Chercher' }))
    expect(onDetected).toHaveBeenCalledWith('3017620422003')
  })
})
```

- [ ] **Step 2: Lancer, vérifier l'échec**

```bash
npm test -- ProductSheet BarcodeScanSheet
```
Attendu : ÉCHEC, les deux modules sont absents.

- [ ] **Step 3: Écrire `src/features/meals/ProductSheet.tsx`**

```tsx
import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Sheet } from '@/components/ui/sheet'
import { toMealItem, type OffProduct } from '@/lib/off/product'
import { t } from '@/i18n/fr'
import type { MealItem } from '@/types/models'

interface ProductSheetProps {
  open: boolean
  product: OffProduct
  onClose: () => void
  onAdd: (item: MealItem) => void
}

/**
 * The one question a scan cannot answer: how much of it.
 *
 * The barcode gives exact figures per 100 g, and the portion is the only guess
 * left in the chain — so it is the only thing this sheet asks, pre-filled with
 * the manufacturer's serving when there is one.
 */
export function ProductSheet({ open, product, onClose, onAdd }: ProductSheetProps) {
  const [grams, setGrams] = useState(String(product.servingGrams))

  useEffect(() => {
    if (open) setGrams(String(product.servingGrams))
  }, [open, product])

  const parsed = Number(grams.replace(',', '.'))
  const valid = Number.isFinite(parsed) && parsed > 0
  const item = toMealItem(product, valid ? parsed : 0)

  return (
    <Sheet open={open} onClose={onClose} title={t.barcode.productTitle}>
      <div className="flex flex-col gap-3">
        <div>
          <p className="text-base font-semibold">{product.name}</p>
          {product.brand ? (
            <p className="text-sm text-muted-foreground">{product.brand}</p>
          ) : null}
        </div>

        <Field label={t.barcode.gramsLabel}>
          {(id) => (
            <Input
              id={id}
              inputMode="numeric"
              className="tnum"
              value={grams}
              onChange={(event) => setGrams(event.target.value)}
            />
          )}
        </Field>

        <div className="rounded-lg border border-border p-3">
          <p className="tnum text-lg font-semibold">{t.meals.kcal(item.kcal)}</p>
          <p className="tnum text-xs text-muted-foreground">
            {t.meals.macros(item.proteinG, item.carbsG, item.fatG)}
          </p>
        </div>

        {product.missingMacros.length > 0 ? (
          <p className="text-xs text-muted-foreground">
            {t.barcode.missingMacros(product.missingMacros.map((key) => t.barcode.macroName[key as 'proteinG' | 'carbsG' | 'fatG']))}
          </p>
        ) : null}

        <Button size="lg" block disabled={!valid} onClick={() => onAdd(item)}>
          <Plus size={16} aria-hidden />
          {t.barcode.add}
        </Button>
      </div>
    </Sheet>
  )
}
```

- [ ] **Step 4: Écrire `src/features/meals/BarcodeScanSheet.tsx`**

```tsx
import { useEffect, useRef, useState } from 'react'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Sheet } from '@/components/ui/sheet'
import { detectBarcode, isBarcodeScanSupported, isValidEan } from '@/lib/off/barcode'
import { t } from '@/i18n/fr'

interface BarcodeScanSheetProps {
  open: boolean
  onClose: () => void
  onDetected: (barcode: string) => void
}

const FRAME_INTERVAL_MS = 400

/**
 * The camera, and the field that exists because the camera often is not there.
 *
 * `BarcodeDetector` is missing on most non-Chromium browsers and `getUserMedia`
 * fails on a refused permission or an insecure origin. All three land in the
 * same place — the numeric field — because a scanner that cannot scan should
 * still let someone read the digits off the box.
 */
export function BarcodeScanSheet({ open, onClose, onDetected }: BarcodeScanSheetProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [scanning, setScanning] = useState(false)
  const [typed, setTyped] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setTyped('')
    setError(null)
    if (!isBarcodeScanSupported() || !navigator.mediaDevices?.getUserMedia) return

    let stream: MediaStream | null = null
    let timer: number | null = null
    let stopped = false

    const start = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        })
      } catch {
        // Refused or unavailable: the typed field below is already on screen.
        return
      }
      if (stopped) {
        stream.getTracks().forEach((track) => track.stop())
        return
      }
      const video = videoRef.current
      if (!video) return
      video.srcObject = stream
      await video.play().catch(() => undefined)
      setScanning(true)

      timer = window.setInterval(() => {
        if (!videoRef.current) return
        void detectBarcode(videoRef.current).then((code) => {
          if (code && !stopped) {
            stopped = true
            onDetected(code)
          }
        })
      }, FRAME_INTERVAL_MS)
    }

    void start()
    return () => {
      stopped = true
      if (timer !== null) window.clearInterval(timer)
      stream?.getTracks().forEach((track) => track.stop())
      setScanning(false)
    }
  }, [open, onDetected])

  const submitTyped = () => {
    const digits = typed.trim()
    if (!isValidEan(digits)) {
      setError(t.barcode.invalid)
      return
    }
    setError(null)
    onDetected(digits)
  }

  return (
    <Sheet open={open} onClose={onClose} title={t.barcode.scanTitle}>
      <div className="flex flex-col gap-3">
        {scanning ? (
          <video
            ref={videoRef}
            className="h-56 w-full rounded-lg bg-muted object-cover"
            muted
            playsInline
            aria-label={t.barcode.cameraLabel}
          />
        ) : (
          <video ref={videoRef} className="hidden" muted playsInline />
        )}

        <p className="text-sm text-muted-foreground">
          {scanning ? t.barcode.scanHint : t.barcode.typeHint}
        </p>

        <Field label={t.barcode.digitsLabel}>
          {(id) => (
            <Input
              id={id}
              inputMode="numeric"
              autoComplete="off"
              className="tnum"
              placeholder="3017620422003"
              value={typed}
              onChange={(event) => {
                setTyped(event.target.value)
                setError(null)
              }}
            />
          )}
        </Field>

        {error ? (
          <p className="text-sm text-muted-foreground" role="status">
            {error}
          </p>
        ) : null}

        <Button size="lg" block disabled={!typed.trim()} onClick={submitTyped}>
          <Search size={16} aria-hidden />
          {t.barcode.search}
        </Button>
      </div>
    </Sheet>
  )
}
```

- [ ] **Step 5: Écrire `src/features/meals/useBarcode.ts`**

```ts
import { useCallback, useState } from 'react'
import { fetchProduct } from '@/lib/off/client'
import { OffError, type OffProduct } from '@/lib/off/product'
import { t } from '@/i18n/fr'

export interface BarcodeState {
  /** True while the scan sheet is up. */
  open: boolean
  product: OffProduct | null
  error: string | null
  loading: boolean
  start: () => void
  close: () => void
  submit: (barcode: string) => Promise<void>
}

/**
 * Scan, lookup, product — and nothing written until the user says how much.
 *
 * The one deliberate difference with the photo path: a failed scan writes
 * nothing at all. A photo is a meal that happened and must survive a dead
 * network; a scan is redone in a second, and a queue of failed lookups in the
 * journal would be noise.
 */
export function useBarcode(): BarcodeState {
  const [open, setOpen] = useState(false)
  const [product, setProduct] = useState<OffProduct | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  return {
    open,
    product,
    error,
    loading,
    start: useCallback(() => {
      setProduct(null)
      setError(null)
      setOpen(true)
    }, []),
    close: useCallback(() => {
      setOpen(false)
      setProduct(null)
      setError(null)
    }, []),
    submit: useCallback(async (barcode: string) => {
      setLoading(true)
      setError(null)
      try {
        setProduct(await fetchProduct(barcode))
        setOpen(false)
      } catch (caught) {
        setError(
          caught instanceof OffError ? t.barcode.errorKind[caught.kind] : t.meals.unknownError,
        )
      } finally {
        setLoading(false)
      }
    }, []),
  }
}
```

- [ ] **Step 6: Ajouter `createBarcodeMeal` et `addProduct`**

`src/db/repositories/mealRepository.ts`, après `createManualMeal` :

```ts
/**
 * A meal built from a scanned product.
 *
 * Not `createManualMeal` with another label: the figures come from the
 * manufacturer's own table, which is a stronger claim than a typed guess, and
 * `source` is what carries that difference into the journal and into any later
 * question about where a number came from.
 */
export async function createBarcodeMeal(
  item: MealItem,
  targetGrams: number,
  options: { date?: IsoDate; slot?: MealSlot } = {},
  database: RecompDb = db,
): Promise<MealEntry> {
  const now = nowIso()
  const totals = totalsFromItems([item])
  const meal: MealEntry = {
    id: createId(),
    date: options.date ?? toLogicalDate(),
    timestamp: now,
    slot: options.slot ?? slotForHour(new Date().getHours()),
    label: item.name,
    items: [item],
    ...totals,
    confidence: 'high',
    source: 'barcode',
    status: 'done',
    createdAt: now,
    updatedAt: now,
  }
  await database.meals.add(meal)
  return syncProteinLog(meal, targetGrams, database)
}
```

`src/features/nutrition/useMeals.ts`, à côté de `addManual` :

```ts
    addProduct: useCallback(
      async (item: MealItem) => {
        await createBarcodeMeal(item, targetGrams)
        haptic()
      },
      [targetGrams],
    ),
```

et dans `MealsState` :

```ts
  /** Writes a scanned product as a one-line meal. */
  addProduct: (item: MealItem) => Promise<void>
```

- [ ] **Step 7: Ajouter les textes**

`src/i18n/fr.ts`, nouveau bloc de premier niveau, à côté de `meals` :

```ts
  barcode: {
    scanTitle: 'Scanner un produit',
    scanHint: 'Vise le code-barres. La lecture se fait sur l’appareil.',
    typeHint: 'La caméra n’est pas disponible ici. Tape les chiffres sous le code-barres.',
    cameraLabel: 'Aperçu de la caméra',
    digitsLabel: 'Code-barres',
    search: 'Chercher',
    invalid: 'Code-barres invalide — vérifie les chiffres.',
    productTitle: 'Ajouter ce produit',
    gramsLabel: 'Quantité (g)',
    add: 'Ajouter',
    addProduct: 'Ajouter un produit',
    macroName: { proteinG: 'protéines', carbsG: 'glucides', fatG: 'lipides' },
    missingMacros: (names: string[]) =>
      `La fiche ne donne pas : ${names.join(', ')}. Comptées à 0 — corrige-les si tu les connais.`,
    badge: 'code-barres',
    errorKind: {
      not_found: 'Produit inconnu d’OpenFoodFacts.',
      no_nutriments: 'Ce produit n’a pas de valeurs nutritionnelles renseignées.',
      network: 'Pas de réponse d’OpenFoodFacts.',
      server: 'OpenFoodFacts a renvoyé une erreur.',
      bad_response: 'Réponse illisible d’OpenFoodFacts.',
    },
  },
```

bloc `nutrition` :

```ts
    scanProduct: 'Code-barres',
```

- [ ] **Step 8: Brancher les deux points d'entrée**

`src/screens/NutritionScreen.tsx` — quatrième bouton dans la grille :

```tsx
          <Button variant="secondary" size="lg" onClick={barcode.start}>
            <ScanBarcode size={18} aria-hidden />
            {t.nutrition.scanProduct}
          </Button>
```

et, après les autres feuilles :

```tsx
      <BarcodeScanSheet
        open={barcode.open}
        onClose={barcode.close}
        onDetected={(code) => void barcode.submit(code)}
      />
      {barcode.product ? (
        <ProductSheet
          open
          product={barcode.product}
          onClose={barcode.close}
          onAdd={(item) => {
            void meals.addProduct(item).then(() => showToast(t.meals.productAdded))
            barcode.close()
          }}
        />
      ) : null}
```

avec `const barcode = useBarcode()` près des autres hooks, et un effet qui montre l'erreur :

```tsx
  useEffect(() => {
    if (barcode.error) showToast(barcode.error)
  }, [barcode.error, showToast])
```

Imports : `ScanBarcode` depuis `lucide-react`, `useBarcode`, `BarcodeScanSheet`, `ProductSheet`, `useEffect`.

Ajouter `productAdded: 'Produit ajouté'` au bloc `meals` de `src/i18n/fr.ts`.

`src/features/meals/MealEditorSheet.tsx` — le même couple, en mode « ajoute une ligne ». Ajouter en tête du composant :

```tsx
  const barcode = useBarcode()
```

un bouton sous « Ajouter un aliment » :

```tsx
        <Button variant="secondary" block onClick={barcode.start}>
          <ScanBarcode size={16} aria-hidden />
          {t.barcode.addProduct}
        </Button>
```

et les feuilles, en fin de composant, **dernières enfants** du `<div>` intérieur, avant la fermeture de `<Sheet>`. `Sheet` est `fixed inset-0 z-50` sans portail : une feuille imbriquée sort bien du `overflow-y-auto` du parent, mais à z-index égal c'est l'ordre du DOM qui décide — la placer en dernier est ce qui la met au-dessus. Le vérifier à l'étape 11.

```tsx
        <BarcodeScanSheet
          open={barcode.open}
          onClose={barcode.close}
          onDetected={(code) => void barcode.submit(code)}
        />
        {barcode.product ? (
          <ProductSheet
            open
            product={barcode.product}
            onClose={barcode.close}
            onAdd={(item) => {
              // Straight into the local list: the user saves the meal as they
              // would after any other correction.
              setItems((current) => [...current.filter((row) => row.name.trim()), item])
              barcode.close()
            }}
          />
        ) : null}
```

- [ ] **Step 9: Afficher le badge**

`src/features/nutrition/DayJournal.tsx`, ajouter une branche au calcul de `badge` :

```tsx
                : meal.source === 'barcode'
                  ? t.barcode.badge
                  : null
```

- [ ] **Step 10: Lancer toute la suite**

```bash
npm test
npm run typecheck
npm run lint
```
Attendu : vert, y compris `src/test/touchTargets.test.ts`.

- [ ] **Step 11: Vérifier dans un vrai navigateur**

```bash
npm run dev
```

Trois vérifications qu'aucun test ne couvre :
1. Sur Chrome desktop, « Code-barres » ouvre la caméra et lit un code tenu devant l'objectif.
2. Refuser la permission caméra montre le champ numérique, sans erreur rouge.
3. `3017620422003` tapé à la main rend la fiche Nutella avec 15 g pré-remplis.

- [ ] **Step 12: Commit**

```bash
git add src/features src/screens src/db src/i18n/fr.ts
git commit -m "feat: ajouter un produit par son code-barres"
```

---

### Task 9: Amender le PRD

Le PRD décrit ce que l'app fait. Trois de ses affirmations sont maintenant fausses.

**Files:**
- Modify: `docs/recompos-pwa-prd.md` — tableau §2 (ligne 33), §6.6, §14 (ligne 867), ligne 10 (`Remplace`)

**Interfaces:** aucune.

- [ ] **Step 1: Lever l'exclusion du §14**

Ligne 867, remplacer la puce actuelle par :

```markdown
- ~~Suivi calorique complet~~ — **levé le 27/08/2026, voir décision n°15 et §6.6.**
  ~~Scan de code-barres~~ — **levé le 28/08/2026, voir décision n°19 et §6.8.** Reste
  exclu : la base alimentaire embarquée. OpenFoodFacts est interrogé à la demande, rien
  n'est stocké ni maintenu ici — c'est un appel sortant, comme les services de vision.
```

- [ ] **Step 2: Ajouter les décisions au tableau du §2**

À la suite de la décision n°18 :

```markdown
| 19 | Sources d'un repas | **Trois entrées : photo, description en texte, code-barres OpenFoodFacts.** Ajoutée le 28/08/2026 | La photo n'est plus la seule porte. Le texte passe par un modèle réglé à part du modèle vision, sur la même clé ; le code-barres n'appelle aucun modèle et ne coûte rien |
| 20 | Contexte d'analyse | **Une précision facultative est demandée avant l'envoi de la photo**, pas seulement après une lecture ratée | Une information que l'utilisateur avait avant la photo coûtait jusqu'ici un second appel. Le prompt distingue une précision d'une correction |
```

- [ ] **Step 3: Ajouter le §6.8**

Après le §6.7, une section décrivant les trois sources, leur exactitude respective et ce que `MealSource` enregistre. Points à couvrir, chacun en un paragraphe :

- Ce que chaque source garantit : le code-barres porte la table du fabricant, la photo et le texte portent une estimation, et `source` est ce qui rend la différence lisible plus tard.
- Pourquoi la photo et le texte sont écrits en base avant l'appel, et pourquoi le scan ne l'est pas.
- Le prompt partagé : mêmes règles, même schéma JSON, même parseur pour les deux modalités.
- Les limites d'OpenFoodFacts : base communautaire, fiches incomplètes, produit refusé plutôt que présenté à zéro.

- [ ] **Step 4: Mettre à jour l'en-tête**

Ligne 10, ajouter la version courante en tête de la liste `Remplace`, en suivant la forme des entrées existantes.

- [ ] **Step 5: Commit**

```bash
git add docs/recompos-pwa-prd.md
git commit -m "docs: PRD — trois sources de repas, exclusion du code-barres levée"
```

---

## Vérification finale

- [ ] `npm test` — toute la suite verte
- [ ] `npm run typecheck` — aucune erreur
- [ ] `npm run lint` — aucun avertissement
- [ ] `npm run build` — le bundle sort
- [ ] `git log --oneline` montre neuf commits, un par tâche
- [ ] Aucune dépendance ajoutée : `git diff main -- package.json` ne montre rien dans `dependencies`

## Contrôle du plan contre la spec

| Exigence de la spec | Tâche |
|---|---|
| §2-A `BarcodeDetector`, repli saisie | 7, 8 |
| §2-B produit → repas ou ligne du repas ouvert | 8 |
| §2-C modèle texte séparé, même clé, `openai/gpt-oss-120b` | 3 |
| §2-D feuille d'aperçu avant analyse | 6 |
| §2-E prompt et schéma partagés | 2 |
| §2-F produit sans macros refusé | 7 |
| §3 `app_name`, `status:0`, kJ, portions | 7 |
| §4.1 séparation transport / lecture | 1 |
| §4.3 contexte ≠ correction, aucun champ ajouté | 2, 6 |
| §4.4 `lib/off/` en trois fichiers purs | 7 |
| §4.5 quatre boutons, deux points d'entrée produit | 5, 8 |
| §4.6 repas écrit avant l'appel côté photo et texte | 5, 6 |
| §4.7 `MealSource`, `textModel`, réglages | 3, 5, 8 |
| §5 tableau des erreurs | 7, 8 |
| §6 plan de tests | 2, 3, 4, 5, 6, 7, 8 |
| §7 ordre d'implémentation | 1 → 9 |
| PRD amendé | 9 |
