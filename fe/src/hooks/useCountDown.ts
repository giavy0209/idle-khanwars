import { useEffect, useRef, useState } from "react";
import { secondToTime } from "utils";

export default function useCountDown(endAt: string | null, render: false): number
export default function useCountDown(endAt: string | null, render?: true): string
export default function useCountDown(endAt: string | null, render: boolean = true) {
  const interval = useRef<any>()
  const [countDown, setCountDown] = useState<number | string>('')
  useEffect(() => {
    if (endAt) {
      interval.current = setInterval(() => {
        const seconds = (new Date(endAt).getTime() - Date.now()) / 1000
        if (render) {
          setCountDown(secondToTime(seconds))
        } else {
          setCountDown(seconds)
        }
      }, 1000)
    } else {
      clearInterval(interval.current)
    }
    return () => {
      clearInterval(interval.current)
    }
  }, [endAt, render])
  return countDown
}