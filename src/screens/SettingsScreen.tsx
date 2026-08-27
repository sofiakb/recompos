import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SettingsPage } from '@/screens/settings/SettingsPage'
import { selectHabits, useSettingsStore } from '@/stores/settingsStore'
import { formatCalendarDate, toLogicalDate } from '@/lib/date'
import { SCHEMA_VERSION } from '@/types/models'
import { t } from '@/i18n/fr'

interface Rubric {
  to: string
  title: string
  subtitle: string
}

function RubricRow({ to, title, subtitle }: Rubric) {
  return (
    <li>
      <Link
        to={to}
        className="flex min-h-[68px] items-center gap-3 border-b border-border py-3 transition-colors hover:bg-accent"
      >
        <span className="min-w-0 flex-1">
          <span className="block text-base font-medium">{title}</span>
          <span className="block truncate text-xs text-muted-foreground">{subtitle}</span>
        </span>
        <ChevronRight size={18} className="shrink-0 text-muted-foreground" aria-hidden />
      </Link>
    </li>
  )
}

/**
 * Six rubrics, each its own sub-page. The screen used to stack eleven unrelated
 * cards on one scroll, which made every setting equally hard to find; the split
 * is the handoff de refonte's (docs/design).
 */
export function SettingsScreen() {
  const settings = useSettingsStore((state) => state.settings)
  const habits = useSettingsStore((state) => state.habits)

  const floor = selectHabits(habits, 'floor')
  const stack = selectHabits(habits, 'stack')

  const rubrics: Rubric[] = [
    {
      to: '/settings/objectifs',
      title: t.settings.sections.goals.title,
      subtitle: t.settings.sections.goals.subtitle,
    },
    {
      to: '/settings/habitudes',
      title: t.settings.sections.habits.title,
      // The only live subtitle: it says what the floor currently costs a day.
      subtitle: t.settings.habitsCount(floor.length, stack.length),
    },
    {
      to: '/settings/seances',
      title: t.settings.sections.workouts.title,
      subtitle: t.settings.sections.workouts.subtitle,
    },
    {
      to: '/settings/analyse-photo',
      title: t.settings.sections.vision.title,
      subtitle: t.settings.sections.vision.subtitle,
    },
    {
      to: '/settings/donnees',
      title: t.settings.sections.data.title,
      subtitle: t.settings.sections.data.subtitle,
    },
    {
      to: '/settings/application',
      title: t.settings.sections.app.title,
      subtitle: t.settings.sections.app.subtitle,
    },
  ]

  return (
    <SettingsPage title={t.settings.title} backTo="/">
      <ul className="flex flex-col">
        {rubrics.map((rubric) => (
          <RubricRow key={rubric.to} {...rubric} />
        ))}
      </ul>

      <p className="tnum px-1 pt-2 text-xs text-muted-foreground">
        {t.settings.version} {SCHEMA_VERSION}.0 · {t.settings.installedOn.toLowerCase()}{' '}
        {formatCalendarDate(toLogicalDate(new Date(settings.installedAt)))}
      </p>
      <p className="px-1 text-xs text-muted-foreground">{t.settings.dataNotice}</p>
    </SettingsPage>
  )
}
