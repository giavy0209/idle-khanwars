interface IRenderDate {
  date: string | Date,
  format?: string
}
export default function renderDate({ date, format = 'dd/MM/yyyy - hh:mm:ss' }: IRenderDate): string {
  date = new Date(date)
  const d = date.getDate() || 1
  const M = date.getMonth() + 1 || 1
  const y = date.getFullYear() || 1991
  const h = date.getHours()
  const m = date.getMinutes()
  const s = date.getSeconds()
  return format.replace('dd', d.toString()).replace('MM', M.toString()).replace('yyyy', y.toString()).replace('hh', h.toString()).replace('mm', m.toString()).replace('ss', s.toString())
}