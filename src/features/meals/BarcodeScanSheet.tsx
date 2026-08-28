import { Sheet } from '@/components/ui/sheet'
import { BarcodeScanner } from '@/features/meals/BarcodeScanner'
import { t } from '@/i18n/fr'

interface BarcodeScanSheetProps {
  open: boolean
  onClose: () => void
  onDetected: (barcode: string) => void
}

/**
 * The scanner in a sheet of its own, for the meal editor.
 *
 * Nutrition scans from a tab inside the add sheet and uses `BarcodeScanner`
 * directly; the editor has nowhere to put a viewfinder, so it opens one.
 */
export function BarcodeScanSheet({ open, onClose, onDetected }: Readonly<BarcodeScanSheetProps>) {
  return (
    <Sheet open={open} onClose={onClose} title={t.barcode.scanTitle}>
      <BarcodeScanner active={open} onDetected={onDetected} />
    </Sheet>
  )
}
