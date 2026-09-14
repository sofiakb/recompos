import { Outlet } from 'react-router-dom'
import { BottomNav } from '@/components/shared/BottomNav'
import { QuickActionFab } from '@/components/shared/QuickActionFab'
import { Toast } from '@/components/shared/Toast'
import { ViewportProbe } from '@/components/shared/ViewportProbe'

export function AppLayout() {
  return (
    <div className="relative mx-auto flex h-full max-w-md flex-col">
      {/* The one light source of the app — see `.app-glow` in index.css. */}
      <div className="app-glow" aria-hidden />
      {/*
        Bottom padding clears the nav capsule *and* the FAB floating above it.
        `--nav-clearance` is the first line free of the capsule (see index.css);
        the FAB sits there and is 56px tall, so a scroll ends above both.
      */}
      <main
        id="app-scroll"
        className="relative flex-1 overflow-y-auto overflow-x-hidden overscroll-y-contain pb-[calc(var(--nav-clearance)+5rem)]"
      >
        <Outlet />
      </main>
      <QuickActionFab />
      <BottomNav />
      <Toast />
      <ViewportProbe />
    </div>
  )
}
