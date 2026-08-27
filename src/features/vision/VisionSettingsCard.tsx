import { useState } from 'react'
import { ExternalLink, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Segmented } from '@/components/ui/segmented'
import { ToggleRow } from '@/components/ui/toggle-row'
import { useSettingsStore } from '@/stores/settingsStore'
import { useUiStore } from '@/stores/uiStore'
import { PROVIDERS, VISION_PROVIDER_ORDER, testProvider } from '@/lib/vision/providers'
import { t } from '@/i18n/fr'
import type { VisionProviderId } from '@/types/models'

type TestState = { status: 'idle' } | { status: 'testing' } | { status: 'done'; message: string }

const OPTIONS = VISION_PROVIDER_ORDER.map((id) => ({ value: id, label: PROVIDERS[id].label }))

/**
 * Where the key lives (PRD §6.6).
 *
 * A single-user app on static hosting cannot hold a secret: anything built into
 * the bundle is readable by whoever opens the page. So the key is typed here and
 * kept in local settings, and the « tester » button exists because the one thing
 * that cannot be verified anywhere but a real browser is whether the provider
 * accepts a cross-origin call from this origin at all.
 */
export function VisionSettingsCard() {
  const providers = useSettingsStore((state) => state.settings.visionProviders)
  const setVisionProvider = useSettingsStore((state) => state.setVisionProvider)
  const clearVisionProvider = useSettingsStore((state) => state.clearVisionProvider)
  const showToast = useUiStore((state) => state.showToast)

  const [selected, setSelected] = useState<VisionProviderId>('groq')
  const [test, setTest] = useState<TestState>({ status: 'idle' })

  const definition = PROVIDERS[selected]
  const current = providers?.[selected]
  const hasKey = Boolean(current?.apiKey.trim())

  const patch = (next: Parameters<typeof setVisionProvider>[1]) => {
    setTest({ status: 'idle' })
    setVisionProvider(selected, next)
  }

  const runTest = async () => {
    if (!current) return
    setTest({ status: 'testing' })
    const result = await testProvider(selected, current)
    setTest({
      status: 'done',
      message: result.ok
        ? t.vision.testOk(result.model)
        : t.vision.testFailed(t.vision.errorKind[result.kind]),
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.vision.title}</CardTitle>
        <CardDescription>{t.vision.hint}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Segmented
          label={t.vision.providerLabel}
          value={selected}
          options={OPTIONS}
          onChange={(value) => {
            setSelected(value as VisionProviderId)
            setTest({ status: 'idle' })
          }}
        />

        <Field label={t.vision.keyLabel}>
          {(id) => (
            <Input
              id={id}
              type="password"
              autoComplete="off"
              spellCheck={false}
              placeholder={t.vision.keyPlaceholder}
              value={current?.apiKey ?? ''}
              onChange={(event) => patch({ apiKey: event.target.value })}
            />
          )}
        </Field>

        {definition.needsBaseUrl ? (
          <Field label={t.vision.baseUrlLabel}>
            {(id) => (
              <Input
                id={id}
                type="url"
                inputMode="url"
                autoComplete="off"
                spellCheck={false}
                placeholder={t.vision.baseUrlPlaceholder}
                value={current?.baseUrl ?? ''}
                onChange={(event) => patch({ baseUrl: event.target.value })}
              />
            )}
          </Field>
        ) : null}

        <Field
          label={t.vision.modelLabel}
          hint={
            definition.defaultModel
              ? t.vision.modelHint(definition.defaultModel)
              : t.vision.modelRequired
          }
        >
          {(id) => (
            <Input
              id={id}
              autoComplete="off"
              spellCheck={false}
              placeholder={definition.defaultModel}
              value={current?.model ?? ''}
              onChange={(event) => patch({ model: event.target.value })}
            />
          )}
        </Field>

        {hasKey ? (
          <ToggleRow
            label={t.vision.enabled}
            description={t.vision.enabledHint}
            checked={current?.enabled ?? true}
            onChange={(enabled) => patch({ enabled })}
          />
        ) : null}

        <div className="flex flex-col gap-2">
          <Button block disabled={!hasKey || test.status === 'testing'} onClick={runTest}>
            {test.status === 'testing' ? t.vision.testing : t.vision.test}
          </Button>
          {test.status === 'done' ? (
            <p className="text-sm text-muted-foreground" role="status">
              {test.message}
            </p>
          ) : null}
          <p className="text-xs text-muted-foreground">{t.vision.corsHelp}</p>
        </div>

        <div className="flex flex-col gap-2">
          {definition.keyUrl ? (
            <a
              href={definition.keyUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="flex min-h-touch items-center gap-2 text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              <ExternalLink size={16} aria-hidden />
              {t.vision.getKey}
            </a>
          ) : null}
          {hasKey ? (
            <Button
              variant="outline"
              block
              onClick={() => {
                clearVisionProvider(selected)
                setTest({ status: 'idle' })
                showToast(t.vision.removed)
              }}
            >
              <Trash2 size={16} aria-hidden />
              {t.vision.remove}
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}
