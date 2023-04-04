import { useEffect, useState } from "react";

export default function useMousePosition() {
  const [mouseEvent, setMouseEvent] = useState<MouseEvent | null>(null)
  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      setMouseEvent(e)
    }
    window.addEventListener('mousemove', handleMouse)
    return () => {
      window.removeEventListener('mousemove', handleMouse)
    }
  }, [])
  return mouseEvent
}