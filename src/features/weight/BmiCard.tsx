import { Link } from 'react-router-dom'
import { bmi, bmiBand, bmiPercent, healthyWeight, type BmiBand } from '@/lib/bmi'
import { formatDecimal } from '@/lib/format'
import { t } from '@/i18n/fr'

interface BmiCardProps {
  /** The last weigh-in — the same figure shown above. */
  weightKg: number
  heightCm: number | null
}

/**
 * The four bands of the rail, laid out on a 15–35 scale.
 *
 * Widths rather than positions, so the segments sit flush and the joins land
 * exactly on 18.5, 25 and 30 — which is where the graduations below point.
 */
const BANDS = [
  { band: 'underweight', width: '17.5%', className: 'rounded-l-full bg-muted-foreground/35' },
  { band: 'normal', width: '32.5%', className: 'bg-primary' },
  { band: 'overweight', width: '25%', className: 'bg-muted-foreground/35' },
  { band: 'obese', width: '25%', className: 'rounded-r-full bg-muted-foreground/35' },
] satisfies Array<{ band: BmiBand; width: string; className: string }>

/** Sat on their real boundaries, not spread evenly: see the note in the rail. */
const GRADUATIONS = [
  { at: '17.5%', label: '18,5' },
  { at: '50%', label: '25' },
  { at: '75%', label: '30' },
]

/**
 * The BMI, read off the last weigh-in.
 *
 * Height is recalled on the card because it is typed somewhere else entirely
 * (Réglages › Objectifs) and a BMI without its height cannot be checked. Without
 * a height there is no number at all: an index computed on a guessed height is
 * worse than none, so the card shrinks to the link that fixes it.
 */
export function BmiCard({ weightKg, heightCm }: Readonly<BmiCardProps>) {
  if (heightCm === null) {
    return (
      <div className="flex min-h-touch items-center justify-between gap-3 rounded-lg bg-muted/50 px-3.5 py-3">
        <p className="text-[13px] text-muted-foreground">{t.trends.bmi}</p>
        <Link to="/settings/objectifs" className="text-[13px] font-medium underline">
          {t.trends.bmiNoHeight}
        </Link>
      </div>
    )
  }

  const value = bmi(weightKg, heightCm)
  const band = t.trends.bmiBand[bmiBand(value)]
  const shown = formatDecimal(value)
  // The band, read on the scale rather than on the index: « de 56,0 à 75,7 kg »
  // is actionable in a way that « entre 18,5 et 25 » is not.
  const healthy = healthyWeight(weightKg, heightCm)

  return (
    <div className="flex flex-col gap-2 rounded-lg bg-muted/50 px-3.5 py-3">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[13px] text-muted-foreground">{t.trends.bmi}</p>
        <p className="tnum text-[13px] text-muted-foreground">
          {t.trends.bmiOnHeight(heightCm / 100)}
        </p>
      </div>
      <p className="tnum">
        <span className="text-[22px] font-semibold">{shown}</span>
        {/* No alert colour: the band is an observation, not a verdict — the same
            rule the protein ring follows when it caps instead of turning red. */}
        <span className="ml-2 text-[13px] text-muted-foreground">{band}</span>
      </p>
      <div className="relative pt-0.5">
        <div
          className="flex h-1.5 gap-0.5"
          role="img"
          aria-label={t.trends.bmiScaleLabel(shown, band)}
        >
          {BANDS.map((segment) => (
            <span
              key={segment.band}
              className={segment.className}
              style={{ width: segment.width }}
            />
          ))}
        </div>
        {/* Centred on its value like the graduations below, so the cursor and the
            number it sits between are measured the same way. */}
        <span
          className="absolute top-0 h-2.5 w-0.5 -translate-x-1/2 rounded-full bg-foreground"
          style={{ left: `${bmiPercent(value)}%` }}
        />
        <div className="tnum relative mt-1 h-3.5 text-[11px] text-muted-foreground">
          {GRADUATIONS.map((tick) => (
            <span key={tick.at} className="absolute -translate-x-1/2" style={{ left: tick.at }}>
              {tick.label}
            </span>
          ))}
        </div>
      </div>

      {/* No colour and no verb: the distance is an observation, like the band
          above it. The app has no target weight and does not acquire one here. */}
      <p className="tnum text-[13px] text-muted-foreground">
        {healthy.toGoKg === null
          ? t.trends.healthyRange(healthy.minKg, healthy.maxKg)
          : t.trends.healthyRangeAway(healthy.minKg, healthy.maxKg, healthy.toGoKg)}
      </p>
    </div>
  )
}
