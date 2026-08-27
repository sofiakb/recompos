import { Card, CardHeader, CardTitle, CardDescription, CardContent, Progress } from 'recompos'

export function Basic() {
  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <CardTitle>Protéines du jour</CardTitle>
          <CardDescription>Objectif calculé à partir de ton poids cible.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="tnum text-3xl font-semibold">
            128 <span className="text-base font-normal text-muted-foreground">/ 165 g</span>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export function WithProgress() {
  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <CardTitle>Séries de la semaine</CardTitle>
          <CardDescription>12 séries sur les 20 prévues.</CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={12} max={20} label="Volume hebdomadaire" />
        </CardContent>
      </Card>
    </div>
  )
}

export function TitleOnly() {
  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <CardTitle>Cible calorique</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="tnum text-2xl font-semibold">2 140 kcal</p>
        </CardContent>
      </Card>
    </div>
  )
}
