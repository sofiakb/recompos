import { Outlet } from 'react-router-dom'
import { BottomNav } from '@/components/shared/BottomNav'
import { QuickActionFab } from '@/components/shared/QuickActionFab'
import { Toast } from '@/components/shared/Toast'

export function AppLayout() {
  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col">
      {/* Bottom padding clears the nav bar and the FAB above it. */}
      <main className="flex-1 pb-[calc(5.5rem+env(safe-area-inset-bottom))]">
        <Outlet />
      </main>
      <QuickActionFab />
      <BottomNav />
      <Toast />
    </div>
  )
}
