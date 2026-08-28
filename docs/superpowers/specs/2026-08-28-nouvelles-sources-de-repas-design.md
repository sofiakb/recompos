# Trois nouvelles façons d'inscrire un repas

| | |
|---|---|
| Date | 28/08/2026 |
| Statut | Design validé, prêt pour le plan d'implémentation |
| Portée | Code-barres OpenFoodFacts, analyse de repas par texte, contexte optionnel avant l'analyse photo |
| Amende | PRD §2 (décisions), §6.6 (suivi calorique), §14 (hors périmètre) |

---

## 1. Le problème

La photo est aujourd'hui la seule source d'un repas chiffré, et elle échoue à trois
endroits précis :

- **Le produit emballé.** Un yaourt et sa barquette portent leurs macros imprimées au
  dos. Les faire deviner à un modèle de vision, c'est remplacer un chiffre exact par une
  estimation.
- **Le repas non photographié.** Un repas déjà mangé, un repas pris ailleurs, une envie
  de le noter de mémoire le soir : il ne reste que la grille manuelle, quatre nombres par
  ligne à retrouver soi-même.
- **Le plat que la photo ne dit pas.** L'utilisateur sait que le riz est complet et que la
  sauce est allégée. Il ne peut le dire qu'après coup, dans la feuille de correction, ce
  qui coûte un second appel au modèle pour une information qu'il avait avant le premier.

## 2. Ce qui est décidé

| # | Sujet | Décision |
|---|---|---|
| A | Lecture du code-barres | `BarcodeDetector` natif du navigateur, repli sur la saisie des chiffres. Aucune bibliothèque ajoutée au bundle. |
| B | Destination d'un produit scanné | Une feuille de quantité, puis soit une ligne ajoutée au repas ouvert, soit un nouveau repas. |
| C | Modèle texte | Réglé séparément du modèle vision, mais sur la même clé API. Défaut `openai/gpt-oss-120b`, repli `llama-3.3-70b-versatile`. |
| D | Contexte photo | Une feuille d'aperçu après la prise, champ facultatif, avant l'analyse. |
| E | Prompt et schéma | Un seul prompt système et un seul schéma JSON, partagés par les deux modalités. Seul le paragraphe qui décrit l'entrée diffère. |
| F | Produit sans macros | Refusé avec un message, jamais présenté comme une fiche à zéro. |

Ces trois features lèvent l'exclusion du §14 du PRD (« Reste exclu : base alimentaire
embarquée et scan de code-barres »). L'exclusion visait une **table nutritionnelle à
maintenir** : OpenFoodFacts est une base tierce interrogée à la demande, rien n'est
embarqué ni maintenu ici. Le §14 doit être amendé dans ce sens, et non simplement
supprimé.

La décision n°5 (zéro backend) tient : OpenFoodFacts est un appel sortant depuis la page,
exactement comme les services de vision. La décision n°16 (clé saisie par l'utilisateur)
tient aussi — OpenFoodFacts n'en demande aucune en lecture.

## 3. Ce qui a été vérifié en amont

Requête réelle passée le 28/08/2026 sur `world.openfoodfacts.org` :

- `GET /api/v2/product/{ean}.json?fields=…` répond `200` avec
  `access-control-allow-origin: *`. Un appel navigateur passe sans proxy.
- Aucune authentification en lecture. La documentation demande un `User-Agent` nommé,
  en-tête que le navigateur interdit d'écrire : on s'identifie donc par
  `?app_name=RecompOS&app_version={version}`, la voie prévue pour les applications web.
- Limite documentée : 15 requêtes/minute/IP sur les lectures produit. Un scan est une
  requête ; l'usage réel n'en approche pas.
- Un code inconnu répond `200` avec `{"status":0}`, **pas** un `404`. Le client doit
  regarder le corps, pas seulement le code HTTP.
- Les macros vivent dans `nutriments` : `energy-kcal_100g`, `proteins_100g`,
  `carbohydrates_100g`, `fat_100g`. `energy-kcal_100g` manque sur les produits saisis en
  kilojoules seuls ; `energy_100g` (kJ) est alors présent. `serving_size` peut être une
  chaîne vide, et `serving_quantity` absent.

Modèles Groq confirmés sur la documentation à la même date : `openai/gpt-oss-120b`,
`llama-3.3-70b-versatile`, `llama-3.1-8b-instant`, `openai/gpt-oss-20b`.

## 4. Architecture

### 4.1 Séparer le transport de la lecture

`src/lib/vision/providers.ts` mêle aujourd'hui deux responsabilités : parler le dialecte
OpenAI (endpoint, clé, timeout, mode JSON, erreurs typées, réparation) et lire une
assiette. La seconde modalité n'a besoin que de la première. Dupliquer serait la garantie
que les deux chemins divergent au premier correctif.

```
src/lib/llm/
  client.ts      transport : PROVIDERS, resolveEndpoint, postCompletion,
                 configuredProviders, testProvider, LlmError
  meal.ts        analyseMealPhoto() et analyseMealText(), au-dessus du transport
src/lib/vision/
  prompt.ts      prompt système partagé + les deux amorces de modalité
  schema.ts      MEAL_JSON_SCHEMA, parseAnalysis (inchangé pour l'essentiel)
  providers.ts   ré-exporte analyseMealPhoto sous le nom analyseMeal, VisionError,
                 fitsInRequest — pour ne pas casser les appelants ni leurs tests
```

`VisionError` est renommé `LlmError` et ré-exporté sous son ancien nom. Le champ
`kind` ne change pas : les libellés d'erreur de `t.vision.errorKind` restent valables.

`resolveEndpoint` prend un argument de modalité :

```ts
type Modality = 'vision' | 'text'
resolveEndpoint(id, settings, modality, useFallbackModel?)
```

En `vision` il lit `settings.model` puis `definition.defaultModel` ; en `text`,
`settings.textModel` puis `definition.defaultTextModel`. Le repli sur le modèle de
secours reste conditionné au fait que l'utilisateur n'ait rien saisi lui-même — un
modèle choisi à la main n'est jamais contourné.

### 4.2 Un seul prompt, deux entrées

Le prompt système actuel porte tout ce que l'application sait faire sur l'exactitude :
raisonner la portion avant de la chiffrer, ne pas inventer une déclinaison, doser la
confiance, cohérence 4/4/9. Rien là-dedans n'est propre à la photo. Il devient la base
commune, et chaque modalité n'ajoute qu'un paragraphe :

```ts
// prompt.ts
const MEAL_RULES = […]                     // les règles, sans mention de l'entrée
export const MEAL_JSON_SHAPE = […]         // rendu à partir de MEAL_JSON_SCHEMA
export const MEAL_PHOTO_SYSTEM_PROMPT      // MEAL_RULES + « on te donne une photo »
export const MEAL_TEXT_SYSTEM_PROMPT       // MEAL_RULES + « on te donne une description »
```

Les règles d'échelle visuelle (« assiette ~26 cm, couverts, verre, main ») sont
spécifiques à la photo et vont dans l'amorce photo. L'amorce texte les remplace par leur
équivalent : les portions données par l'utilisateur font foi ; celles qu'il ne donne pas
sont estimées sur la portion usuelle, et le fait de les avoir estimées descend
`confidence` et se dit dans `notes`.

Le format de sortie n'est écrit qu'une fois. `MEAL_JSON_SCHEMA` est une constante qui sert
à deux choses : produire le bloc de format inséré dans le prompt, et documenter ce que
`parseAnalysis` accepte. Une seule source pour le contrat, donc pas de dérive entre ce
qu'on demande et ce qu'on valide. `parseAnalysis` reste le seul point d'entrée des deux
modalités — un modèle texte ment de la même façon qu'un modèle vision.

`response_format: { type: 'json_object' }` reste conditionné à `mentionsJson`, inchangé.

### 4.3 Contexte et correction ne sont pas la même phrase

`hintPrompt` dit aujourd'hui « Ne conserve rien de ta lecture précédente qu'elle
contredit ». Devant une première lecture, cette phrase désigne un antécédent qui n'existe
pas.

Une seconde fonction, `contextPrompt(text)`, présente le même texte comme ce qu'il est :
une information dont l'utilisateur dispose avant l'analyse, autoritaire sur la nature des
aliments, sans effet sur la lecture des portions.

**Aucun nouveau champ n'est stocké.** `MealEntry.hint` reste unique ; le choix se fait à
l'appel selon qu'une analyse a déjà eu lieu pour ce repas (`status === 'done' | 'failed'`
→ correction, sinon → contexte).

### 4.4 OpenFoodFacts

```
src/lib/off/
  client.ts    fetchProduct(barcode, fetchImpl?) : Promise<OffProduct>
  product.ts   parseProduct(json), toMealItem(product, grams)   — pur
  barcode.ts   isBarcodeScanSupported(), scanFrom(video), isValidEan(digits)
```

`client.ts` reprend les conventions de `llm/client.ts` : `AbortController` avec timeout,
erreurs typées, jamais d'exception nue.

```ts
type OffErrorKind = 'not_found' | 'no_nutriments' | 'network' | 'server' | 'bad_response'
class OffError extends Error { constructor(readonly kind: OffErrorKind, message: string) }
```

`parseProduct` est pur et porte toute la logique tordue :

| Cas | Comportement |
|---|---|
| `energy-kcal_100g` présent | Utilisé tel quel. |
| Absent, `energy_100g` présent | Converti depuis les kJ (÷ 4,184), arrondi. |
| Les deux absents | `no_nutriments` — le produit est refusé. |
| Une macro absente sur trois | Comptée à 0, et le fait est signalé dans la feuille produit. |
| Les trois macros absentes | `no_nutriments`. |
| `serving_quantity` numérique | Quantité pré-remplie. |
| `serving_size` du type « 30 g » | Nombre extrait. |
| Ni l'un ni l'autre, ou non exploitable | 100 g. |
| `product_name_fr` présent | Préféré à `product_name`. |
| Aucun nom | `code` affiché, et le champ nom reste éditable. |

`toMealItem(product, grams)` produit un `MealItem` : `name` = nom (+ marque), `quantity` =
`« 120 g »`, macros mises à l'échelle depuis les valeurs pour 100 g puis arrondies. Une
seule fonction, testable sans réseau ni DOM.

`barcode.ts` enveloppe `BarcodeDetector` (formats `ean_13`, `ean_8`, `upc_a`, `upc_e`) et
expose `isValidEan` — la somme de contrôle — pour que la saisie manuelle refuse un chiffre
mal recopié avant de dépenser une requête.

### 4.5 Écrans

| Fichier | Rôle |
|---|---|
| `features/meals/BarcodeScanSheet.tsx` | `getUserMedia` + boucle de détection. Repli sur un champ numérique si l'API manque, si la permission est refusée, ou sur demande (« saisir les chiffres »). |
| `features/meals/ProductSheet.tsx` | Fiche produit, champ quantité en grammes, aperçu des macros recalculées en direct, bouton « Ajouter ». |
| `features/meals/DescribeMealSheet.tsx` | Zone de texte, bouton « Analyser », état d'attente. |
| `features/meals/CapturePreviewSheet.tsx` | Aperçu de la photo, champ « précisions (optionnel) », bouton « Analyser ». |
| `features/meals/useBarcode.ts` | Enchaîne scan → produit → `MealItem`, porte les erreurs. |

Écran Nutrition : la grille de deux boutons passe à quatre — « Que manger », « Un repas »
(photo), « Décrire », « Code-barres ». « Un repas » et « Décrire » restent désactivés
tant qu'aucune clé n'est saisie. « Code-barres » n'en demande aucune et reste actif :
c'est le seul chemin qui chiffre un repas sans modèle.

`MealEditorSheet` gagne un bouton « Ajouter un produit » qui ouvre la même paire de
feuilles. Le callback est le même dans les deux cas :

```ts
onProduct: (item: MealItem) => void
```

Depuis l'écran : crée un repas d'une ligne. Depuis l'éditeur : ajoute la ligne à l'état
local `items`, que l'utilisateur enregistre comme n'importe quelle autre correction.

### 4.6 Flux

**Code-barres**
```
Bouton → BarcodeScanSheet → EAN validé → fetchProduct → parseProduct
  → ProductSheet (quantité) → toMealItem → onProduct
      depuis l'écran   : createBarcodeMeal(item)
      depuis l'éditeur : setItems([...items, item])
```

**Texte**
```
Bouton → DescribeMealSheet → createTextMeal(description)
  → repas écrit en base, status 'pending', source 'ai_text'
  → analyseMealText(chaîne, { text })
  → applyAnalysis  (le même que la photo)
```
Le repas est écrit **avant** l'appel, comme la photo : la file de reprise du hook
`useMeals` le récupère si le réseau manque, et la description est conservée pour cela.

**Photo avec contexte**
```
capture(file) devient deux temps :
  stageCapture(file)         encode, renvoie { bytes, mimeType, byteSize, previewUrl }
  confirmCapture(staged, context?)  createPendingMeal + analyse(id, context)
CapturePreviewSheet vit entre les deux.
```
Annuler la feuille jette l'encodage et révoque l'URL d'aperçu ; rien n'est écrit en base.

### 4.7 Données et réglages

`MealSource` passe de `'ai' | 'manual' | 'corrected'` à
`'ai' | 'ai_text' | 'barcode' | 'manual' | 'corrected'`.

Sans ces deux variantes, un produit scanné se déclare saisi à la main — il ment sur son
exactitude — et l'éditeur ne peut pas savoir qu'un repas texte est ré-analysable. Points
touchés : `MealEditorSheet` (la condition `source !== 'manual'` qui affiche la
correction ; un repas texte propose de corriger **sa description**, pas de relancer une
photo qui n'existe pas), `mealRepository` (`editMeal` fait passer `'ai_text'` à
`'corrected'` comme `'ai'` ; un `'barcode'` corrigé devient `'corrected'` aussi),
`journal.ts` et les badges de `DayJournal`. Aucune migration Dexie : le champ existe
déjà, seules des valeurs nouvelles y apparaissent, et les anciennes lignes restent
lisibles.

`applyAnalysis` accepte `analysedBy` pour les deux modalités — `VisionProviderId` couvre
déjà les mêmes identifiants.

`VisionProviderSettings` gagne `textModel?: string`. `ProviderDefinition` gagne
`defaultTextModel` et `fallbackTextModel`. Pour Groq : `openai/gpt-oss-120b` par défaut,
`llama-3.3-70b-versatile` en secours. OpenRouter et l'endpoint personnalisé n'ont pas de
défaut, comme pour la vision. Champ optionnel, `persist` de Zustand le lit comme absent
sur les installations existantes : pas de migration.

`VisionSettingsCard` reçoit un second champ « Modèle texte », sous le champ existant. Le
bouton de test conserve son rôle actuel — il éprouve la clé et le CORS, ce qui est commun
aux deux modalités.

## 5. Erreurs

| Situation | Ce que voit l'utilisateur |
|---|---|
| `BarcodeDetector` absent (Safari ancien, contexte non sécurisé) | La feuille s'ouvre directement sur le champ numérique, sans message d'échec. |
| Caméra refusée | Même repli, avec une ligne expliquant que la caméra est refusée. |
| Code inconnu d'OpenFoodFacts | « Produit inconnu d'OpenFoodFacts. » + bouton « Saisir à la main » qui ouvre l'éditeur vide. |
| Produit sans valeurs nutritionnelles | « Ce produit n'a pas de valeurs nutritionnelles renseignées. » + même bouton. Pas de fiche à zéro. |
| Réseau absent | « Pas de réponse d'OpenFoodFacts. » Le scan est rejouable ; rien n'est écrit. |
| Modèle texte en échec | Le repas reste en base avec `status: 'failed'` et son message, comme une photo. Rejouable. |
| Description vide | Le bouton « Analyser » est désactivé. |

Le code-barres est le seul chemin qui n'écrit rien avant de réussir : contrairement à une
photo, un scan raté se refait en une seconde et ne mérite pas une ligne en attente dans le
journal.

## 6. Tests

L'implémentation suit le TDD. Le poids des tests porte sur les fonctions pures, où vivent
les cas tordus.

**`lib/off/product.test.ts`** — kcal directes ; conversion depuis les kJ ; kcal et kJ
absentes → `no_nutriments` ; une macro manquante sur trois → 0 et signalé ; trois macros
manquantes → refus ; `serving_quantity` numérique ; `serving_size` « 30 g » ;
`serving_size` vide → 100 g ; `product_name_fr` préféré ; aucun nom → code ; mise à
l'échelle et arrondi de `toMealItem` à 30 g, 100 g, 250 g.

**`lib/off/client.test.ts`** (fetch mocké) — réponse valide ; `{"status":0}` →
`not_found` ; 429 → `server` ; échec réseau → `network` ; corps illisible →
`bad_response` ; `app_name` présent dans l'URL ; `fields` limite la réponse demandée.

**`lib/off/barcode.test.ts`** — `isValidEan` sur EAN-13 et EAN-8 valides, sur une somme de
contrôle fausse, sur une longueur fausse, sur des non-chiffres.

**`lib/llm/meal.test.ts`** (fetch mocké) — `analyseMealText` renvoie une `MealAnalysis`
valide ; réparation après une réponse enrobée ; passage au provider suivant après un 429 ;
le corps envoyé porte bien `textModel` et non `model` ; repli sur `fallbackTextModel`
quand le défaut est inconnu, mais jamais sur un modèle saisi par l'utilisateur.

**`lib/vision/prompt.test.ts`** — le prompt photo et le prompt texte contiennent le même
bloc de règles et le même bloc de format ; `contextPrompt` ne contient pas la phrase de
désaveu d'une lecture précédente, `hintPrompt` si.

**Tests d'écran** — `ProductSheet` recalcule les macros quand la quantité change ;
`CapturePreviewSheet` analyse sans texte comme avec ; `MealEditorSheet` ajoute une ligne
produit sans perdre les lignes déjà saisies.

**Non-régression** — la suite existante de `vision/providers.test.ts` et
`vision/schema.test.ts` passe sans modification autre que l'import. C'est la preuve que
l'extraction du transport n'a rien changé au chemin photo.

## 7. Ordre d'implémentation

1. Extraire `lib/llm/client.ts` de `vision/providers.ts`, ré-exporter, suite verte.
2. Factoriser les prompts et le schéma partagés, suite verte.
3. `analyseMealText` + `textModel` dans les réglages et l'écran de réglages.
4. `DescribeMealSheet` + `createTextMeal` + variante `ai_text` de `MealSource`.
5. `stageCapture` / `confirmCapture` + `CapturePreviewSheet` + `contextPrompt`.
6. `lib/off/` en entier, sans écran.
7. `BarcodeScanSheet`, `ProductSheet`, les deux points d'entrée, variante `barcode`.
8. Amender le PRD : §2 (décision n°19), §6.6, §14.

Les étapes 1 et 2 ne changent aucun comportement : elles sont validées par une suite qui
reste verte, pas par une nouvelle fonctionnalité.

## 8. Hors périmètre

- Recherche OpenFoodFacts par nom de produit. Le code-barres est exact ; une recherche
  textuelle rendrait une liste à départager, c'est un autre écran et un autre problème.
- Cache local des produits scannés. À 15 requêtes/minute et quelques scans par jour, un
  cache résoudrait un problème que personne n'a.
- Contribution à OpenFoodFacts (photo, correction d'une fiche). Écriture, donc
  authentification.
- Modèle texte distinct par provider au-delà du nom du modèle : une seule clé par
  provider, comme aujourd'hui.
- Lecture de l'étiquette nutritionnelle par le modèle de vision. Le code-barres couvre le
  produit emballé ; l'étiquette photographiée est une troisième source à arbitrer.
