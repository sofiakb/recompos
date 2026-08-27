import type { RouteObject } from 'react-router-dom'
import { AppLayout } from '@/app/AppLayout'
import { NutritionScreen } from '@/screens/NutritionScreen'
import { SettingsScreen } from '@/screens/SettingsScreen'
import { AppSettingsScreen } from '@/screens/settings/AppSettingsScreen'
import { DataSettingsScreen } from '@/screens/settings/DataSettingsScreen'
import { GoalsSettingsScreen } from '@/screens/settings/GoalsSettingsScreen'
import { HabitsSettingsScreen } from '@/screens/settings/HabitsSettingsScreen'
import { VisionSettingsScreen } from '@/screens/settings/VisionSettingsScreen'
import { WorkoutsSettingsScreen } from '@/screens/settings/WorkoutsSettingsScreen'
import { TodayScreen } from '@/screens/TodayScreen'
import { TrendsScreen } from '@/screens/TrendsScreen'
import { WorkoutsScreen } from '@/screens/WorkoutsScreen'

/**
 * The route table, kept apart from the provider so a test can read it: a rubric
 * row pointing at a path no route declares renders a blank screen, which
 * nothing else would catch.
 *
 * The settings rubrics use French paths, unlike the four tabs: they are only
 * ever reached by tapping a row, never typed, and `/settings/objectifs` says
 * what it opens.
 */
export const appRoutes: RouteObject[] = [
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <TodayScreen /> },
      { path: 'workouts', element: <WorkoutsScreen /> },
      { path: 'nutrition', element: <NutritionScreen /> },
      { path: 'trends', element: <TrendsScreen /> },
      { path: 'settings', element: <SettingsScreen /> },
      { path: 'settings/objectifs', element: <GoalsSettingsScreen /> },
      { path: 'settings/habitudes', element: <HabitsSettingsScreen /> },
      { path: 'settings/seances', element: <WorkoutsSettingsScreen /> },
      { path: 'settings/analyse-photo', element: <VisionSettingsScreen /> },
      { path: 'settings/donnees', element: <DataSettingsScreen /> },
      { path: 'settings/application', element: <AppSettingsScreen /> },
    ],
  },
]
