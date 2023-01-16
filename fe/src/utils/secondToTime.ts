export default function secondsToTime(seconds: number, reduce?: number) {
  if (reduce) {
    seconds = seconds * (1 - reduce / 100)
  }
  if (!seconds || seconds < 0) return `00:00:00`
  seconds = Math.floor(seconds)
  let s = seconds.toString()
  if (s.length < 2) s = `0${s}`
  if (seconds < 60) return `00:00:${s}`

  const mins = Math.floor(seconds / 60)
  let m = mins.toString()
  if (m.length < 2) m = `0${m}`

  s = Math.floor(seconds % 60).toString()
  if (s.length < 2) s = `0${s}`

  if (mins < 60) return `00:${m}:${s}`

  const hours = (mins / 60)


  let h = Math.floor(hours).toString();
  if (h.length < 2) h = `0${h}`

  m = (mins % 60).toString()
  if (m.length < 2) m = `0${m}`

  return `${h}:${m}:${s}`


}