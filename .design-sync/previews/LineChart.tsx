import { Card, CardContent, CardDescription, CardHeader, CardTitle, LineChart } from 'recompos'

const weight = [
  { label: '1 juin', value: 80.2 },
  { label: '5 juin', value: 79.8 },
  { label: '9 juin', value: 79.9 },
  { label: '13 juin', value: 79.3 },
  { label: '17 juin', value: 79.1 },
  { label: '21 juin', value: 78.6 },
  { label: '25 juin', value: 78.7 },
  { label: '29 juin', value: 78.4 },
]

export function WeightSeries() {
  return (
    <div className="w-full">
      <LineChart
        ariaLabel="Poids sur 30 jours"
        points={weight}
        formatValue={(v) => `${v.toFixed(1)} kg`}
      />
    </div>
  )
}

export function WithOverlay() {
  return (
    <div className="w-full">
      <LineChart
        ariaLabel="Poids et moyenne glissante"
        points={weight}
        overlay={[80.2, 80.0, 79.97, 79.8, 79.62, 79.34, 79.18, 78.98]}
        formatValue={(v) => `${v.toFixed(1)} kg`}
      />
    </div>
  )
}

export function WithGaps() {
  return (
    <div className="w-full">
      <LineChart
        ariaLabel="Poids avec jours manquants"
        points={[
          { label: '1 juin', value: 80.2 },
          { label: '5 juin', value: 79.8 },
          { label: '9 juin', value: null },
          { label: '13 juin', value: null },
          { label: '17 juin', value: 79.1 },
          { label: '21 juin', value: 78.6 },
        ]}
        formatValue={(v) => `${v.toFixed(1)} kg`}
      />
    </div>
  )
}

export function InCard() {
  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <CardTitle>Historique du poids</CardTitle>
          <CardDescription>Moyenne lissée sur sept jours.</CardDescription>
        </CardHeader>
        <CardContent>
          <LineChart ariaLabel="Historique du poids" points={weight} />
        </CardContent>
      </Card>
    </div>
  )
}
