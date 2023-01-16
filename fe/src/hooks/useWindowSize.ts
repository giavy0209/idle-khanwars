import { useState, useEffect } from 'react'
export default function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 })
  useEffect(() => {

    const handleSize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      document.body.style.width = width + 'px'
      document.body.style.height = height + 'px'
      setSize({ width, height })
    }
    handleSize()
    window.addEventListener('resize', handleSize)
    return () => {
      window.removeEventListener('resize', handleSize)
    }
  }, [])
  return size
}