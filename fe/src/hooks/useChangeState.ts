import { useEffect, useRef, useState } from 'react'
export default function useChangeState(run: boolean, timing: number = 1000) {
  const interval = useRef<any>(null)
  const [dummyState, setDummyState] = useState({})
  useEffect(() => {
    if (run) {
      interval.current = setInterval(() => {
        setDummyState({})
      }, timing)
    } else {
      clearInterval(interval.current)
    }
    return () => {
      clearInterval(interval.current)
    }
  }, [run, timing])
  return dummyState
}