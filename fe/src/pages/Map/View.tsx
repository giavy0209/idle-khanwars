import { useAppSelector } from 'hooks'
import { ICastle } from 'interfaces'
import { FC, useMemo, CSSProperties, useCallback, Dispatch, SetStateAction } from 'react'
import { selectMapCastles } from 'store/selectors'
interface IView {
  coordinate: {
    start: { x: number, y: number },
    end: { x: number, y: number }
  }
  selectedGrid: { x: number, y: number, castle?: ICastle } | null
  setSelectedGrid: Dispatch<SetStateAction<IView['selectedGrid']>>
  grid: number
}
const View: FC<IView> = ({ coordinate, grid, selectedGrid, setSelectedGrid }) => {
  const mapCastles = useAppSelector(selectMapCastles)

  const { x, y } = useMemo(() => {
    const x: number[] = []
    const y: number[] = []
    for (let index = coordinate.start.x; index <= coordinate.end.x; index++) {
      x.push(index)
    }
    for (let index = coordinate.start.y; index <= coordinate.end.y; index++) {
      y.push(index)
    }
    return { x, y }
  }, [coordinate])

  const selectGrid = useCallback((x: number, y: number, castle?: ICastle) => {
    if (selectedGrid?.x === x && selectedGrid.y === y) {
      return setSelectedGrid(null)
    }
    setSelectedGrid({ x, y, castle })
  }, [selectedGrid])

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
    {
      y.map((_y) => {
        return x.map((_x) => {
          const castle = mapCastles.find(({ coordinate }) => (coordinate.x === _x && coordinate.y === _y))
          return <div
            onClick={() => selectGrid(_x, _y, castle)}
            key={`${_x}:${_y}`}
            className={`block ${selectedGrid?.x === _x && selectedGrid.y === _y ? 'selected' : ''}`}
          >
            {castle && <div className="has-castle"></div>}
          </div>
        })
      })
    }
  </div>
}

export default View