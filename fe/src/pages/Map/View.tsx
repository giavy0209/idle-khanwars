import { useAppSelector } from 'hooks'
import { ICastle, MARCHING } from 'interfaces'
import { FC, useMemo, CSSProperties, useCallback, Dispatch, SetStateAction, memo, useRef, useEffect, MouseEvent, useState } from 'react'
import { selectCastles, selectMapCastles, selectMarchingsByCoordinates } from 'store/selectors'
import mapIcon from 'assets/images/icon/map.webp'
import secondsToTime from 'utils/secondToTime'
import useChangeState from 'hooks/useChangeState'
interface IView {
  coordinate: {
    start: { x: number, y: number },
    end: { x: number, y: number }
  }
  setSelectedGrid: Dispatch<SetStateAction<{ x: number, y: number, castle?: ICastle } | null>>
  grid: number
}

const CANVAS_WIDTH = 1000
const CANVAS_HEIGHT = 1000
const STROKE_WIDTH = 10
const icon = new Image()
icon.src = mapIcon
const View: FC<IView> = ({ coordinate, grid, setSelectedGrid }) => {
  const canvas = useRef<HTMLCanvasElement>(null)
  const mapCastles = useAppSelector(selectMapCastles)
  const castles = useAppSelector(selectCastles)
  const marchings = useAppSelector(selectMarchingsByCoordinates(coordinate))
  const [canvasPosition, setCanvasPosition] = useState<{ x: number, y: number } | null>(null)
  const forceChangeState = useChangeState(marchings.length > 0)
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
        if (isMy) {
          ctx.strokeStyle = '#00ff00'
          ctx.strokeRect(startX, startY, rectSizeX, rectSizeY)
        }

        ctx.closePath()
      })
    })

    marchings.forEach((marching) => {
      const {
        start: { x: startX, y: startY },
      } = coordinate
      const moveToX = (marching.from.coordinate.x - startX) * gridSizeX + (gridSizeX / 2)
      const moveToY = (marching.from.coordinate.y - startY) * gridSizeY + (gridSizeY / 2)
      const lineToX = (marching.coordinates.x - startX) * gridSizeX + (gridSizeX / 2)
      const lineToY = (marching.coordinates.y - startY) * gridSizeY + (gridSizeY / 2)
      ctx.beginPath()
      ctx.lineWidth = 150 / x.length
      ctx.strokeStyle = '#0000ff'
      ctx.moveTo(moveToX, moveToY)
      ctx.lineTo(lineToX, lineToY)
      ctx.stroke()
      ctx.closePath()

      ctx.beginPath()
      ctx.fillStyle = '#ff0000'
      let startAt: number;
      let arriveAt: number;
      let fromX: number;
      let fromY: number;
      let toX: number;
      let toY: number;
      if (marching.status === MARCHING.STATUS.TO_TARGET) {
        startAt = new Date(marching.startAt).getTime()
        arriveAt = new Date(marching.arriveAt).getTime()
        fromX = moveToX
        fromY = moveToY
        toX = lineToX
        toY = lineToY
      } else {
        startAt = new Date(marching.arriveAt).getTime()
        arriveAt = new Date(marching.homeAt).getTime()
        fromX = lineToX
        fromY = lineToY
        toX = moveToX
        toY = moveToY
      }
      const diffTime = arriveAt - startAt
      const now = Date.now() - startAt
      const percent = now / diffTime

      const currentX = fromX + (toX - fromX) * percent
      const currentY = fromY + (toY - fromY) * percent
      const leftTime = diffTime - now
      ctx.arc(
        currentX,
        currentY,
        150 / x.length,
        0,
        Math.PI * 2
      )
      ctx.fill()
      ctx.fillStyle = '#00ff00'
      ctx.font = `${300 / x.length}px Arial`
      ctx.textBaseline = 'middle'
      ctx.textAlign = 'center'
      ctx.fillText(secondsToTime(leftTime / 1000), currentX, currentY)
      ctx.closePath()
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
            ctx.beginPath()
            ctx.strokeStyle = '#ff0000'
            ctx.lineWidth = 10
            ctx.rect(
              fromX,
              fromY,
              gridSizeX,
              gridSizeY
            )
            ctx.stroke()
            ctx.closePath()
          }
        })
      })
    }

  }, [x, y, gridSizeX, gridSizeY, castles, coordinate, canvasPosition, marchings, forceChangeState, ishaveCastle])

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
    x.forEach((_x, indexX) => {
      y.forEach((_y, indexY) => {
        const fromX = indexX * gridSizeX
        const toX = (indexX + 1) * gridSizeX
        const fromY = indexY * gridSizeY
        const toY = (indexY + 1) * gridSizeY
        if (
          (posX > fromX &&
            posX < toX &&
            posY > fromY &&
            posY < toY)
        ) {
          const { castle } = ishaveCastle(_x, _y)
          setSelectedGrid({ x: _x, y: _y, castle })
        }
      })
    })
    setCanvasPosition({ x: posX, y: posY })
  }, [x, y, gridSizeX, gridSizeY, ishaveCastle, setSelectedGrid])

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