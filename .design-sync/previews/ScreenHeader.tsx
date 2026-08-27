import { ScreenHeader } from 'recompos'

export function TitleOnly() {
  return (
    <div className="w-full">
      <ScreenHeader title="Aujourd’hui" />
    </div>
  )
}

export function WithSubtitle() {
  return (
    <div className="w-full">
      <ScreenHeader title="Tendances" subtitle="30 derniers jours" />
    </div>
  )
}

export function WithSettings() {
  return (
    <div className="w-full">
      <ScreenHeader title="Aujourd’hui" subtitle="Jeudi 27 août" showSettings />
    </div>
  )
}
