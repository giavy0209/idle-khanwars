import { useAppSelector } from 'hooks'
import { ICastle } from 'interfaces'
import { FC, useMemo, CSSProperties, useCallback, Dispatch, SetStateAction, memo, useRef, useEffect, MouseEvent, useState } from 'react'
import { selectCastles, selectMapCastles } from 'store/selectors'
import mapIcon from 'assets/images/icon/map.webp'
interface IView {
  coordinate: {
    start: { x: number, y: number },
    end: { x: number, y: number }
  }
  selectedGrid: { x: number, y: number, castle?: ICastle } | null
  setSelectedGrid: Dispatch<SetStateAction<IView['selectedGrid']>>
  grid: number
}

const CANVAS_WIDTH = 1000
const CANVAS_HEIGHT = 1000
const STROKE_WIDTH = 10
const icon = new Image()
icon.src = mapIcon
const View: FC<IView> = ({ coordinate, grid, selectedGrid, setSelectedGrid }) => {
  const canvas = useRef<HTMLCanvasElement>(null)
  const mapCastles = useAppSelector(selectMapCastles)
  const castles = useAppSelector(selectCastles)
  const [canvasPosition, setCanvasPosition] = useState<{ x: number, y: number } | null>(null)
  const { x, y, gridSizeX, gridSizeY } = useMemo(() => {
    const x: number[] = []
    const y: number[] = []
    for (let index = coordinate.start.x; index <= coordinate.end.x; index++) {
      x.push(index)
    }
    for (let index = coordinate.start.y; index <= coordinate.end.y; index++) {
      y.push(index)
    }
    return {
      x,
      y,
      gridSizeX: CANVAS_WIDTH / x.length,
      gridSizeY: CANVAS_HEIGHT / y.length
    }
  }, [coordinate])

  const selectGrid = useCallback((x: number, y: number, castle?: ICastle) => {
    if (selectedGrid?.x === x && selectedGrid.y === y) {
      return setSelectedGrid(null)
    }
    setSelectedGrid({ x, y, castle })
  }, [selectedGrid, setSelectedGrid])

  const ishaveCastle = useCallback((x: number, y: number) => {
    const castle = mapCastles.find(({ coordinate }) => (coordinate.x === x && coordinate.y === y))
    const isMy = castles.find(({ coordinate }) => (coordinate?.x === x && coordinate?.y === y))

    return { castle, isMy }
  }, [mapCastles, castles])

  useEffect(() => {
    const ctx = canvas.current?.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    ctx.beginPath()

    ctx.strokeStyle = '#000'
    ctx.lineWidth = STROKE_WIDTH
    for (let index = 0; index <= x.length; index++) {
      ctx.moveTo(gridSizeX * index, 0)
      ctx.lineTo(gridSizeX * index, CANVAS_HEIGHT)
    }
    for (let index = 0; index <= y.length; index++) {
      ctx.moveTo(0, gridSizeY * index)
      ctx.lineTo(CANVAS_WIDTH, gridSizeY * index)
    }
    ctx.stroke()
    ctx.closePath()
    x.forEach((_x, indexX) => {
      y.forEach((_y, indexY) => {
        const { castle, isMy } = ishaveCastle(_x, _y)
        if (!castle) return
        ctx.beginPath()
        const startX = indexX * gridSizeX + STROKE_WIDTH
        const startY = indexY * gridSizeY + STROKE_WIDTH
        const rectSizeX = gridSizeX - STROKE_WIDTH * 2
        const rectSizeY = gridSizeY - STROKE_WIDTH * 2

        ctx.drawImage(
          icon,
          0,
          140,
          50,
          50,
          startX,
          startY,
          rectSizeX,
          rectSizeY
        )
        ctx.closePath()
      })
    })
    if (canvasPosition) {

      x.forEach((_x, indexX) => {
        y.forEach((_y, indexY) => {
          const fromX = indexX * gridSizeX
          const toX = (indexX + 1) * gridSizeX
          const fromY = indexY * gridSizeY
          const toY = (indexY + 1) * gridSizeY
          if (
            (canvasPosition.x > fromX &&
              canvasPosition.x < toX &&
              canvasPosition.y > fromY &&
              canvasPosition.y < toY)
          ) {
            console.log({
              fromX,
              fromY,
              ...canvasPosition
            });

            ctx.beginPath()
            ctx.strokeStyle = '#ff0000'
            ctx.rect(
              fromX,
              fromY,
              gridSizeX,
              gridSizeY
            )
            ctx.stroke()
            ctx.closePath()
            const { castle } = ishaveCastle(_x, _y)
            setSelectedGrid({ x: _x, y: _y, castle })
          }
        })
      })
    }
  }, [x, y, gridSizeX, gridSizeY, canvasPosition, castles, ishaveCastle])

  const handleClickCanvas = useCallback((e: MouseEvent<HTMLCanvasElement>) => {
    if (!canvas.current) return
    const { clientX, clientY } = e
    const { width, height, top, left } = canvas.current.getBoundingClientRect()
    const windowPosX = clientX - left
    const windowPosY = clientY - top
    const ratioX = CANVAS_WIDTH / width
    const ratioY = CANVAS_HEIGHT / height
    const posX = windowPosX * ratioX
    const posY = windowPosY * ratioY
    setCanvasPosition({ x: posX, y: posY })
  }, [])

  return <div style={{ "--grid": grid } as CSSProperties} className="view">
    <div className="horizontal-axis">
      {
        x.map(o => <div key={`x_${o}`} className="coordinate">{o}</div>)
      }
    </div>
    <div className="vertical-axis">
      {
        y.map(o => <div key={`y_${o}`} className="coordinate">{o}</div>)
      }
    </div>
    <canvas
      onClick={handleClickCanvas}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      ref={canvas}></canvas>
  </div>
}

export default memo(View)