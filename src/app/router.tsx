import { createHashRouter, RouterProvider } from 'react-router-dom'
import { appRoutes } from '@/app/routes'

/**
 * Hash routing: GitHub Pages returns 404 on deep links to a client route, and
 * the hash sidesteps that without a 404.html trick (PRD §4).
 */
const router = createHashRouter(appRoutes)

export function AppRouter() {
  return <RouterProvider router={router} />
}
