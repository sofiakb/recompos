/** Default content shipped with a fresh install (PRD annexe A). */
import type { Exercise, FloorHabitDefinition, TakeoutOption, ZeroCookItem } from '@/types/models'

type HabitSeed = Omit<FloorHabitDefinition, 'id' | 'createdAt' | 'updatedAt'>

export const DEFAULT_HABITS: HabitSeed[] = [
  {
    title: '5 pompes',
    targetRepsOrAction: '5 pompes',
    category: 'workout',
    kind: 'floor',
    completionMode: 'toggle',
    order: 0,
  },
  {
    // A real food portion rather than a shaker: the floor should move the protein
    // total, and picking the source logs its grams (PRD §6.3).
    title: '1 portion de protéines zéro-cuisson',
    targetRepsOrAction: 'au choix dans le catalogue',
    category: 'nutrition',
    kind: 'floor',
    completionMode: 'protein_portion',
    order: 1,
  },
  {
    title: '10 squats à vide',
    triggerAnchor: 'Pendant que le café coule',
    targetRepsOrAction: '10 squats',
    category: 'workout',
    kind: 'stack',
    completionMode: 'toggle',
    order: 2,
  },
  {
    title: '1 série de pompes max',
    triggerAnchor: "Avant d'ouvrir le laptop",
    targetRepsOrAction: 'pompes max',
    category: 'workout',
    kind: 'stack',
    completionMode: 'toggle',
    order: 3,
  },
  {
    title: '2 min de gainage',
    triggerAnchor: 'Douche du soir',
    targetRepsOrAction: '2 min',
    category: 'mobility',
    kind: 'stack',
    completionMode: 'toggle',
    order: 4,
  },
]

export const DEFAULT_EXERCISES: Exercise[] = [
  {
    id: 'incline-pushup',
    name: 'Pompes inclinées',
    pattern: 'push',
    defaultRepRange: [8, 15],
    progressionChain: ['pushup', 'decline-pushup', 'archer-pushup'],
    isCustom: false,
  },
  {
    id: 'pushup',
    name: 'Pompes',
    pattern: 'push',
    defaultRepRange: [8, 15],
    progressionChain: ['decline-pushup', 'archer-pushup'],
    isCustom: false,
  },
  {
    id: 'decline-pushup',
    name: 'Pompes surélevées',
    pattern: 'push',
    defaultRepRange: [8, 15],
    progressionChain: ['archer-pushup'],
    isCustom: false,
  },
  {
    id: 'archer-pushup',
    name: 'Pompes archer',
    pattern: 'push',
    defaultRepRange: [5, 12],
    isCustom: false,
  },
  {
    id: 'band-row',
    name: 'Rowing élastique',
    pattern: 'pull',
    defaultRepRange: [10, 15],
    isCustom: false,
  },
  {
    id: 'door-pullup',
    name: 'Tractions à la porte',
    pattern: 'pull',
    defaultRepRange: [5, 12],
    progressionChain: ['weighted-pullup'],
    isCustom: false,
  },
  {
    id: 'weighted-pullup',
    name: 'Tractions lestées',
    pattern: 'pull',
    defaultRepRange: [5, 10],
    isCustom: false,
  },
  {
    id: 'bulgarian-split-squat',
    name: 'Fentes bulgares',
    pattern: 'legs',
    defaultRepRange: [8, 12],
    progressionChain: ['weighted-bulgarian-split-squat'],
    isCustom: false,
  },
  {
    id: 'weighted-bulgarian-split-squat',
    name: 'Fentes bulgares lestées',
    pattern: 'legs',
    defaultRepRange: [8, 12],
    isCustom: false,
  },
  {
    id: 'goblet-squat',
    name: 'Goblet squat',
    pattern: 'legs',
    defaultRepRange: [10, 15],
    isCustom: false,
  },
  {
    id: 'plank',
    name: 'Gainage',
    pattern: 'core',
    defaultRepRange: [30, 120],
    progressionChain: ['long-lever-plank'],
    isCustom: false,
  },
  {
    id: 'long-lever-plank',
    name: 'Gainage bras tendus',
    pattern: 'core',
    defaultRepRange: [20, 90],
    isCustom: false,
  },
]

export const DEFAULT_TAKEOUT: TakeoutOption[] = [
  {
    id: 'jp',
    cuisine: 'Japonais',
    pick: 'Yakitori (poulet, bœuf), sashimi, edamame',
    avoid: 'Tempura, bowls sauce sucrée, California rolls',
    estimatedProteinGrams: 45,
    isCustom: false,
  },
  {
    id: 'shawarma',
    cuisine: 'Shawarma / libanais',
    pick: 'Assiette poulet grillé, viande en supplément, salade',
    avoid: 'Frites, sauce blanche à volonté, galette',
    estimatedProteinGrams: 55,
    isCustom: false,
  },
  {
    id: 'rotisserie',
    cuisine: 'Rôtisserie',
    pick: 'Demi-poulet rôti, haricots verts',
    avoid: 'Gratin, pommes de terre à la graisse',
    estimatedProteinGrams: 60,
    isCustom: false,
  },
  {
    id: 'burger',
    cuisine: 'Burger',
    pick: 'Double steak, un seul pain, sans sauce, eau ou soda zéro',
    avoid: 'Menu frites, milkshake, bacon-fromage-sauce',
    estimatedProteinGrams: 50,
    isCustom: false,
  },
  {
    id: 'poke',
    cuisine: 'Poke',
    pick: 'Base salade, double protéine, sauce à part',
    avoid: 'Base riz sucré, mayo épicée, toppings frits',
    estimatedProteinGrams: 40,
    isCustom: false,
  },
  {
    id: 'italian',
    cuisine: 'Italien',
    pick: 'Poulet ou poisson grillé, salade de mozzarella',
    avoid: "Pizza, pâtes crème, pain à l'ail",
    estimatedProteinGrams: 40,
    isCustom: false,
  },
]

export const DEFAULT_ZERO_COOK: ZeroCookItem[] = [
  {
    id: 'skyr',
    name: 'Skyr nature',
    proteinPerServingGrams: 17,
    servingLabel: '1 pot 150 g',
    inStock: true,
    isCustom: false,
  },
  {
    id: 'tuna',
    name: 'Thon en boîte au naturel',
    proteinPerServingGrams: 26,
    servingLabel: '1 boîte 130 g',
    inStock: true,
    isCustom: false,
  },
  {
    id: 'cottage',
    name: 'Cottage cheese',
    proteinPerServingGrams: 12,
    servingLabel: '100 g',
    inStock: true,
    isCustom: false,
  },
  {
    id: 'eggs',
    name: 'Œufs durs prêts à consommer',
    proteinPerServingGrams: 13,
    servingLabel: '2 œufs',
    inStock: true,
    isCustom: false,
  },
  {
    id: 'chicken-slices',
    name: 'Blanc de poulet en tranches',
    proteinPerServingGrams: 20,
    servingLabel: '100 g',
    inStock: true,
    isCustom: false,
  },
  {
    id: 'whey',
    name: 'Whey',
    proteinPerServingGrams: 24,
    servingLabel: '1 dose 30 g',
    inStock: true,
    isCustom: false,
  },
  {
    id: 'fromage-blanc',
    name: 'Fromage blanc 0 %',
    proteinPerServingGrams: 8,
    servingLabel: '100 g',
    inStock: true,
    isCustom: false,
  },
]

/** Used only until a first weigh-in makes the computed target available. */
export const FALLBACK_PROTEIN_TARGET_GRAMS = 150
