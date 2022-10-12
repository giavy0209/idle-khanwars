import { useEffect, useRef, useState } from "react";
import { secondToTime } from "utils";

export default function useCountDown(endAt: string | null) {
  const interval = useRef<any>()
  const [countDown, setCountDown] = useState('')
  useEffect(() => {
    if(endAt) {
      interval.current = setInterval(() => {
        const seconds = (new Date(endAt).getTime() - Date.now()) / 1000
        setCountDown(secondToTime(seconds))
      }, 1000)
    }else {
      clearInterval(interval.current)
    }
    return () => {
      clearInterval(interval.current)
    }
  }, [endAt])
  return countDown
}