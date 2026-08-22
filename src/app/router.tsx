import { createHashRouter, RouterProvider } from 'react-router-dom'
import { AppLayout } from '@/app/AppLayout'
import { NutritionScreen } from '@/screens/NutritionScreen'
import { SettingsScreen } from '@/screens/SettingsScreen'
import { TodayScreen } from '@/screens/TodayScreen'
import { TrendsScreen } from '@/screens/TrendsScreen'
import { WorkoutsScreen } from '@/screens/WorkoutsScreen'

/**
 * Hash routing: GitHub Pages returns 404 on deep links to a client route, and
 * the hash sidesteps that without a 404.html trick (PRD §4).
 */
const router = createHashRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <TodayScreen /> },
      { path: 'workouts', element: <WorkoutsScreen /> },
      { path: 'nutrition', element: <NutritionScreen /> },
      { path: 'trends', element: <TrendsScreen /> },
      { path: 'settings', element: <SettingsScreen /> },
    ],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
