import { Segmented } from 'recompos'

export function ThreeOptions() {
  return (
    <div className="w-full">
      <Segmented
        label="Période"
        value="30j"
        options={[
          { value: '7j', label: '7 j' },
          { value: '30j', label: '30 j' },
          { value: '90j', label: '90 j' },
        ]}
        onChange={() => {}}
      />
    </div>
  )
}

export function TwoOptions() {
  return (
    <div className="w-full">
      <Segmented
        label="Unité"
        value="kg"
        options={[
          { value: 'kg', label: 'Kilogrammes' },
          { value: 'lb', label: 'Livres' },
        ]}
        onChange={() => {}}
      />
    </div>
  )
}

export function FirstSelected() {
  return (
    <div className="w-full">
      <Segmented
        label="Objectif"
        value="seche"
        options={[
          { value: 'seche', label: 'Sèche' },
          { value: 'maintien', label: 'Maintien' },
          { value: 'prise', label: 'Prise' },
        ]}
        onChange={() => {}}
      />
    </div>
  )
}
