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
    "Repas décrit par la personne qui l'a mangé :",
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
