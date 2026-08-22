import { Outlet } from 'react-router-dom'
import { BottomNav } from '@/components/shared/BottomNav'
import { QuickActionFab } from '@/components/shared/QuickActionFab'
import { Toast } from '@/components/shared/Toast'

export function AppLayout() {
  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col">
      {/*
        Bottom padding clears the nav bar *and* the FAB floating above it: the FAB
        is 56px tall at 4.5rem from the bottom, so anything under 8rem of the end
        of a scroll would sit behind it.
      */}
      <main className="flex-1 pb-[calc(8.5rem+env(safe-area-inset-bottom))]">
        <Outlet />
      </main>
      <QuickActionFab />
      <BottomNav />
      <Toast />
    </div>
  )
}
