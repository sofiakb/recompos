import { Outlet } from 'react-router-dom'
import { BottomNav } from '@/components/shared/BottomNav'
import { QuickActionFab } from '@/components/shared/QuickActionFab'
import { Toast } from '@/components/shared/Toast'

export function AppLayout() {
  return (
    <div className="relative mx-auto flex min-h-full max-w-md flex-col">
      {/* The one light source of the app — see `.app-glow` in index.css. */}
      <div className="app-glow" aria-hidden />
      {/*
        Bottom padding clears the nav capsule *and* the FAB floating above it.
        The capsule sits 12px off the bottom edge and stands 56px tall, which
        pushes the FAB to 5.5rem; the last row of a scroll has to clear that.
      */}
      <main className="relative flex-1 pb-[calc(9.5rem+env(safe-area-inset-bottom))]">
        <Outlet />
      </main>
      <QuickActionFab />
      <BottomNav />
      <Toast />
    </div>
  )
}
