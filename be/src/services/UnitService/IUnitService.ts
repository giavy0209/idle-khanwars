export interface Move {
  unit: string
  value: number
  type: 'TO_TOWER' | 'TO_DEFENSE'
}