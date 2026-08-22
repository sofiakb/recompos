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
    startWorkout: 'Séance 20 min',
    comingInLot: 'Arrive au prochain lot.',
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
    workoutsHint: 'Le tracker 20 min et les micro-séries arrivent au lot 3.',
    nutrition: 'Le compteur de protéines arrive au lot 2.',
    nutritionHint: 'La cheat sheet livraison et le catalogue zéro-cuisson suivront.',
    trends: 'Pas encore assez de données pour une courbe.',
    trendsHint: 'Force, tour de taille et photos arrivent au lot 4.',
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
