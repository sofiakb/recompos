import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BarcodeScanSheet } from '@/features/meals/BarcodeScanSheet'

function setup() {
  const onDetected = vi.fn()
  render(<BarcodeScanSheet open onClose={vi.fn()} onDetected={onDetected} />)
  return { onDetected, user: userEvent.setup() }
}

// jsdom ships neither BarcodeDetector nor getUserMedia, which is exactly the
// browser this fallback exists for.
describe('BarcodeScanSheet, sans caméra utilisable', () => {
  it('ouvre directement la saisie des chiffres', () => {
    setup()
    expect(screen.getByLabelText('Code-barres')).toBeInTheDocument()
  })

  it('refuse un code dont la somme de contrôle est fausse', async () => {
    const { onDetected, user } = setup()
    await user.type(screen.getByLabelText('Code-barres'), '3017620422004')
    await user.click(screen.getByRole('button', { name: 'Chercher' }))
    expect(onDetected).not.toHaveBeenCalled()
    expect(screen.getByText(/code-barres invalide/i)).toBeInTheDocument()
  })

  it('transmet un code valide', async () => {
    const { onDetected, user } = setup()
    await user.type(screen.getByLabelText('Code-barres'), '3017620422003')
    await user.click(screen.getByRole('button', { name: 'Chercher' }))
    expect(onDetected).toHaveBeenCalledWith('3017620422003')
  })
})
