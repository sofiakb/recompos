import { useRef } from 'react'
import { Download, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Sheet } from '@/components/ui/sheet'
import { useBackup } from '@/features/backup/useBackup'
import { useUiStore } from '@/stores/uiStore'
import { formatLongDate } from '@/lib/date'
import { t } from '@/i18n/fr'

/** Export and import, with the replacement spelled out before it happens. */
export function BackupCard() {
  const backup = useBackup()
  const showToast = useUiStore((state) => state.showToast)
  const fileInput = useRef<HTMLInputElement>(null)

  const onExport = async () => {
    const names = await backup.exportNow()
    showToast(
      names.length > 1
        ? `${t.backup.exportedTo(names[0])} — ${t.backup.exportedWithPhotos}`
        : t.backup.exportedTo(names[0]),
    )
  }

  const onConfirm = async () => {
    const summary = await backup.confirmImport()
    if (summary) showToast(t.backup.imported(summary.dailyLogs, summary.sets))
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{t.backup.exportTitle}</CardTitle>
          <CardDescription>{t.backup.exportHint}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Button variant="outline" block onClick={onExport}>
            <Download size={18} aria-hidden />
            {t.settings.export}
          </Button>

          <input
            ref={fileInput}
            type="file"
            accept="application/json,.json"
            multiple
            className="sr-only"
            onChange={(event) => {
              const { files } = event.target
              if (files && files.length > 0) void backup.loadFiles(files)
              event.target.value = ''
            }}
          />
          <Button variant="outline" block onClick={() => fileInput.current?.click()}>
            <Upload size={18} aria-hidden />
            {t.settings.import}
          </Button>
          <p className="text-xs text-muted-foreground">{t.backup.importHint}</p>
          {backup.error ? <p className="text-xs text-destructive">{backup.error}</p> : null}
        </CardContent>
      </Card>

      <Sheet
        open={backup.pending !== null}
        onClose={backup.cancelImport}
        title={t.backup.confirmTitle}
      >
        <p className="mb-4 text-sm text-muted-foreground">
          {backup.pending
            ? t.backup.confirmBody(formatLongDate(backup.pending.bundle.exportedAt.slice(0, 10)))
            : ''}
        </p>
        <div className="flex flex-col gap-2">
          <Button variant="destructive" size="lg" block onClick={onConfirm}>
            {t.backup.confirmCta}
          </Button>
          <Button variant="outline" block onClick={backup.cancelImport}>
            {t.common.cancel}
          </Button>
        </div>
      </Sheet>
    </>
  )
}
