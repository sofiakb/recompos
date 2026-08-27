import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BackupCard } from '@/features/backup/BackupCard'
import { SettingsPage } from '@/screens/settings/SettingsPage'
import { formatBytes } from '@/lib/format'
import { t } from '@/i18n/fr'

interface StorageInfo {
  usage: number
  quota: number
  persisted: boolean
}

function useStorageInfo(): StorageInfo | null {
  const [info, setInfo] = useState<StorageInfo | null>(null)
  useEffect(() => {
    let cancelled = false
    async function read() {
      if (!navigator.storage?.estimate) return
      const estimate = await navigator.storage.estimate()
      const persisted = (await navigator.storage.persisted?.()) ?? false
      if (cancelled) return
      setInfo({ usage: estimate.usage ?? 0, quota: estimate.quota ?? 0, persisted })
    }
    void read()
    return () => {
      cancelled = true
    }
  }, [])
  return info
}

export function DataSettingsScreen() {
  const storage = useStorageInfo()

  return (
    <SettingsPage title={t.settings.sections.data.title} backTo="/settings">
      <Card>
        <CardHeader>
          <CardTitle>{t.settings.storage}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <p className="tnum text-sm text-muted-foreground">
            {storage && storage.quota > 0
              ? t.settings.storageUsage(formatBytes(storage.usage), formatBytes(storage.quota))
              : t.settings.storageUnknown}
          </p>
          <p className="text-xs text-muted-foreground">
            {storage?.persisted ? t.settings.storagePersisted : t.settings.storageBestEffort}
          </p>
        </CardContent>
      </Card>

      <BackupCard />
    </SettingsPage>
  )
}
