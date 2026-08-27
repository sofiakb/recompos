import { Textarea } from 'recompos'

export function Default() {
  return (
    <div className="w-full">
      <Textarea placeholder="Note de séance" rows={3} />
    </div>
  )
}

export function Filled() {
  return (
    <div className="w-full">
      <Textarea
        rows={4}
        defaultValue={
          'Squat 4x5 à 110 kg, barre qui remonte bien.\nSoulevé de terre reporté : bas du dos raide.'
        }
      />
    </div>
  )
}

export function Disabled() {
  return (
    <div className="w-full">
      <Textarea rows={3} defaultValue="Analysée par la vision, non modifiable." disabled />
    </div>
  )
}
