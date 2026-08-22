import { useCallback, useState } from 'react'
import { db } from '@/db/dexie'
import {
  applyImport,
  buildExport,
  exportFileName,
  parseBundle,
  parsePhotoBundle,
  type ImportSummary,
  type SerializedPhoto,
} from '@/lib/backup'
import { useSettingsStore } from '@/stores/settingsStore'
import { t } from '@/i18n/fr'
import type { ExportBundle } from '@/types/models'

function download(text: string, fileName: string): void {
  const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }))
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName
  anchor.click()
  URL.revokeObjectURL(url)
}

export interface PendingImport {
  bundle: ExportBundle
  photos: SerializedPhoto[]
}

export interface BackupState {
  /** Parsed and validated, waiting for an explicit confirmation before writing. */
  pending: PendingImport | null
  error: string | null
  exportNow: () => Promise<string[]>
  loadFiles: (files: FileList | File[]) => Promise<void>
  confirmImport: () => Promise<ImportSummary | null>
  cancelImport: () => void
}

export function useBackup(): BackupState {
  const [pending, setPending] = useState<PendingImport | null>(null)
  const [error, setError] = useState<string | null>(null)

  const exportNow = useCallback(async () => {
    const { settings, habits } = useSettingsStore.getState()
    const { bundle, photoBundle } = await buildExport(settings, habits, db)
    const names = [exportFileName(bundle.exportedAt)]
    download(JSON.stringify(bundle), names[0])
    if (photoBundle) {
      const photoName = exportFileName(bundle.exportedAt, 'photos')
      download(JSON.stringify(photoBundle), photoName)
      names.push(photoName)
    }
    return names
  }, [])

  /**
   * Accepts the data file, the photo companion, or both at once.
   *
   * Nothing is written here: the result is parked in `pending` until the user
   * confirms, because an import replaces everything they have.
   */
  const loadFiles = useCallback(async (files: FileList | File[]) => {
    setError(null)
    setPending(null)

    let bundle: ExportBundle | null = null
    const photos: SerializedPhoto[] = []
    let failure: string | null = null

    for (const file of Array.from(files)) {
      const text = await file.text()
      const parsed = parseBundle(text)
      if (parsed.ok) {
        bundle = parsed.bundle
        continue
      }
      const photoOnly = parsePhotoBundle(text)
      if (photoOnly) {
        photos.push(...photoOnly)
        continue
      }
      failure =
        parsed.reason === 'not_json'
          ? t.backup.errorNotJson
          : parsed.reason === 'future_version'
            ? t.backup.errorFutureVersion
            : t.backup.errorNotBundle
    }

    if (!bundle) {
      setError(failure ?? t.backup.errorNotBundle)
      return
    }
    setPending({ bundle, photos })
  }, [])

  const confirmImport = useCallback(async () => {
    if (!pending) return null
    const summary = await applyImport(pending.bundle, db, pending.photos)
    // Settings and habits live in localStorage, not Dexie, so they are restored
    // here rather than inside the transaction.
    useSettingsStore.setState({ settings: pending.bundle.settings, habits: pending.bundle.habits })
    setPending(null)
    return summary
  }, [pending])

  const cancelImport = useCallback(() => {
    setPending(null)
    setError(null)
  }, [])

  return { pending, error, exportNow, loadFiles, confirmImport, cancelImport }
}
