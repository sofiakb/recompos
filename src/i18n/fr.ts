/**
 * Every user-facing string lives here (PRD §7).
 *
 * V1 ships French only, but no component holds a literal, so adding English is
 * mechanical: duplicate this file and pick one at the root.
 */
export const fr = {
  app: {
    name: 'RecompOS',
    tagline: 'Le système, pas la motivation.',
  },
  nav: {
    today: "Aujourd'hui",
    workouts: 'Séances',
    nutrition: 'Nutrition',
    trends: 'Tendances',
    settings: 'Réglages',
  },
  today: {
    dayMilestone: (n: number) => `Jour ${n}`,
    floorTitle: 'Plancher du jour',
    floorSubtitle: 'Non négociable, et volontairement ridicule.',
    floorDone: 'Plancher validé',
    floorDoneHint: 'La journée compte. Tout le reste est du bonus.',
    validateAll: 'Tout valider',
    stackTitle: 'Habitudes empilées',
    stackSubtitle: 'Accrochées à un moment qui existe déjà.',
    proteinTitle: 'Protéines',
    proteinOf: (current: number, target: number) => `${current} g sur ${target} g`,
    weighInDue: 'Pesée de la semaine',
    weighInDueHint: "Quand tu veux. L'app ne regarde que la tendance, jamais le chiffre du jour.",
    startWorkout: 'Séance 20 min',
    comingInLot: 'Arrive bientôt.',
  },
  nutrition: {
    pickPortion: 'Quelle source de protéines ?',
    pickPortionHint: 'Le choix est ajouté au total du jour.',
    targetFromWeight: (weightKg: number, perKg: number) =>
      `Calculé sur ${weightKg} kg × ${String(perKg).replace('.', ',')} g/kg`,
    targetManual: 'Cible ajustée à la main',
    targetNoWeight: 'Cible provisoire — ajoute ton poids pour la calculer',
    addedGrams: (grams: number) => `+${grams} g ajoutés`,
    ofTarget: (target: number) => `sur ${target} g`,
    remaining: (grams: number) => `encore ${grams} g`,
    targetReached: 'Cible atteinte',
    custom: 'Montant libre',
    addGrams: (grams: number) => `Ajouter ${grams} g`,
    deleteDigit: 'Effacer un chiffre',
    todayTitle: 'Aujourd’hui',
    noLogYet: 'Rien de logué pour le moment.',
    editLog: (grams: number) => `Entrée de ${grams} g`,
    sourceLabel: 'Type de source',
    removeLog: 'Supprimer cette entrée',
    undo: 'Annuler',
    zeroCookTitle: 'Zéro-cuisson',
    zeroCookHint: 'Ce qu’il y a dans le frigo, et ce que ça rapporte.',
    inStock: (name: string) => `${name} en stock`,
    logItem: (name: string, grams: number) => `Ajouter ${name}, ${grams} g`,
    takeoutTitle: 'Livraison',
    takeoutHint: 'Quoi commander quand tu ne cuisines pas. Grammes estimés.',
    allCuisines: 'Tout',
    noTakeout: 'Aucune entrée pour cette cuisine.',
    source: {
      shake: 'Shaker',
      zero_cook: 'Zéro-cuisson',
      takeout: 'Livraison',
      meal: 'Repas',
    },
  },
  weight: {
    title: 'Poids',
    smoothedHint: 'Moyenne des dernières pesées, pas le chiffre du jour.',
    emptyHint: 'Une pesée suffit pour calculer ta cible de protéines.',
    logCta: 'Enregistrer une pesée',
    logTitle: 'Ton poids',
    logHint: 'À jeun de préférence, mais la régularité compte plus que le moment.',
    lastEntry: (date: string, kg: number) => `Dernière pesée : ${date}, ${kg} kg`,
    saved: (kg: number) => `${kg} kg enregistrés`,
    history: 'Historique',
    empty: 'Aucune pesée enregistrée.',
  },
  consistency: {
    rolling7: '7 jours',
    rolling30: '30 jours',
    band: {
      restart: 'à relancer',
      onTrack: 'en route',
      solid: 'solide',
    },
  },
  quickAction: {
    open: 'Action rapide',
    title: 'Action rapide',
    validateFloor: 'Valider le plancher',
    addProtein: '+30 g de protéines',
    addSet: '+1 série',
    close: 'Fermer',
  },
  onboarding: {
    skip: 'Passer',
    next: 'Suivant',
    start: 'Commencer',
    back: 'Retour',
    step: (current: number, total: number) => `${current} / ${total}`,
    welcome: {
      title: 'Pas de deadline. Pas de série à ne pas casser.',
      body: "Une semaine ratée ne remet rien à zéro. L'app mesure un pourcentage glissant, pas une performance.",
    },
    weight: {
      title: 'Ton poids',
      body: "Il sert à calculer ta cible de protéines, et rien d'autre. L'app suit la tendance, jamais le chiffre du jour.",
    },
    protein: {
      title: 'Ta cible de protéines',
      body: 'Modifiable à tout moment dans les réglages.',
      unit: 'g par jour',
    },
    floor: {
      title: 'Ton plancher quotidien',
      body: "Garde-le assez petit pour être fait un mauvais jour. C'est tout l'intérêt.",
    },
  },
  settings: {
    title: 'Réglages',
    proteinTarget: 'Cible de protéines',
    proteinAuto: 'Calculée sur ton poids',
    proteinManual: 'Ajustée à la main',
    proteinAutoValue: (grams: number) => `Le calcul donnerait ${grams} g`,
    proteinBackToAuto: 'Revenir au calcul automatique',
    proteinEditHint: 'Modifier la cible la fige : une nouvelle pesée ne la changera plus.',
    weight: 'Poids',
    habits: 'Habitudes',
    habitsCount: (floor: number, stack: number) =>
      `${floor} au plancher, ${stack} empilée${stack > 1 ? 's' : ''}`,
    restTimer: 'Timer de repos par défaut',
    haptics: 'Retour haptique',
    sound: 'Sons',
    storage: 'Stockage',
    storageUsage: (used: string, quota: string) => `${used} utilisés sur ${quota}`,
    storageUnknown: 'Non communiqué par le navigateur',
    storagePersisted: 'Stockage persistant accordé',
    storageBestEffort: 'Stockage non garanti — pense à exporter',
    export: 'Exporter mes données',
    import: 'Importer une sauvegarde',
    about: 'À propos',
    version: 'Version',
    installedOn: 'Installée le',
    dataNotice:
      'Tout reste sur cet appareil. Aucun compte, aucun serveur, aucune donnée envoyée nulle part.',
  },
  empty: {
    workouts: 'Aucune séance pour le moment.',
    workoutsHint:
      'Le circuit 20 min, les micro-séries et la surcharge progressive arrivent ensuite.',
    trends: 'Pas encore assez de données pour une courbe.',
    trendsHint: 'Force, tour de taille et photos arrivent avec le module Tendances.',
  },
  pwa: {
    updateAvailable: 'Nouvelle version disponible',
    reload: 'Recharger',
    dismiss: 'Plus tard',
    offlineReady: 'Prête à fonctionner hors ligne',
  },
  common: {
    save: 'Enregistrer',
    cancel: 'Annuler',
    undo: 'Annuler',
    done: 'Terminé',
    loading: 'Chargement…',
  },
} as const

export type Dictionary = typeof fr

/** Single accessor so swapping the active dictionary later touches one line. */
export const t = fr
