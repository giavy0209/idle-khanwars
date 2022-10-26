import { faArrowCircleDown, faArrowCircleLeft, faArrowCircleRight, faArrowCircleUp, faSearchMinus, faSearchPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAppSelector } from 'hooks'
import { FC, useState, useMemo, useCallback, CSSProperties, useEffect, ChangeEvent } from 'react'
import { selectUser } from 'store/selectors'
const Map: FC = () => {
  const user = useAppSelector(selectUser)
  const [grid, setGrid] = useState(5)
  const [selectedGrid, setSelectedGrid] = useState<{ x: number, y: number } | null>(null)
  const [coordinate, setCoordinate] = useState({ start: { x: 0, y: 0 }, end: { x: 4, y: 4 } })
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
  useEffect(() => {
    setCoordinate(coordinate => {
      return {
        start: coordinate.start,
        end: {
          x: coordinate.start.x + grid - 1,
          y: coordinate.start.y + grid - 1
        }
      }
    })
  }, [grid])
  const moveTo = useCallback(({ x, y }: { x?: number, y?: number }) => {
    if (x?.toString()) {
      setCoordinate({
        start: {
          x: coordinate.start.x + x,
          y: coordinate.start.y
        },
        end: {
          x: coordinate.end.x + x,
          y: coordinate.end.y
        }
      })
    }
    if (y?.toString()) {
      setCoordinate({
        start: {
          x: coordinate.start.x,
          y: coordinate.start.y + y
        },
        end: {
          x: coordinate.end.x,
          y: coordinate.end.y + y
        }
      })
    }
  }, [coordinate])
  const changeGrid = useCallback((value: number) => {
    const newGrid = grid + value
    if (newGrid >= 3 && newGrid <= 10) {
      setGrid(newGrid)
    }
  }, [grid])

  const handleMoveTo = useCallback((e: ChangeEvent<HTMLInputElement>, input: 'x' | 'y') => {
    let value: number = Number(e.target.value)
    if (!value && value !== 0) {
      value = coordinate.start[input]
      return
    }
    setCoordinate({
      start: {
        ...coordinate.start,
        [input]: value
      },
      end: {
        ...coordinate.end,
        [input]: value + grid - 1
      }
    })
  }, [coordinate, grid])
  const selectGrid = useCallback((x: number, y: number) => {
    if (selectedGrid?.x === x && selectedGrid.y === y) {
      return setSelectedGrid(null)
    }
    setSelectedGrid({ x, y })
  }, [selectedGrid])
  return (
    <>
      <div className="map">
        {
          !user.isSelectStart && <div className="title">Please select location to place your castle</div>
        }
        <div className={`selected-grid ${selectedGrid ? 'show' : ''}`}>
          <p>Empty</p>
          <p>X : {selectedGrid?.x} Y : {selectedGrid?.y}</p>
        </div>
        <div style={{ "--grid": grid } as CSSProperties} className="view">
          <div className="horizontal-axis">
            {
              x.map(o => <div className="coordinate">{o}</div>)
            }
          </div>
          <div className="vertical-axis">
            {
              y.map(o => <div className="coordinate">{o}</div>)
            }
          </div>
          {
            y.map((_y) => {
              return x.map((_x) => <div
                onClick={() => selectGrid(_x, _y)}
                key={`${_x}:${_y}`}
                className={`block ${selectedGrid?.x === _x && selectedGrid.y === _y ? 'selected' : ''}`}>
                <span className="coordinate">
                </span>
              </div>)
            })
          }
        </div>
        <div className="control">
          <div onClick={() => moveTo({ x: -1 })} className="left">
            <FontAwesomeIcon icon={faArrowCircleLeft} />
          </div>
          <div onClick={() => moveTo({ x: 1 })} className="right">
            <FontAwesomeIcon icon={faArrowCircleRight} />
          </div>
          <div onClick={() => moveTo({ y: 1 })} className="down">
            <FontAwesomeIcon icon={faArrowCircleDown} />
          </div>
          <div onClick={() => moveTo({ y: -1 })} className="up">
            <FontAwesomeIcon icon={faArrowCircleUp} />
          </div>
          <div className="zoom">
            <div onClick={() => changeGrid(1)} className="out">
              <FontAwesomeIcon icon={faSearchMinus} />
            </div>
            <div onClick={() => changeGrid(-1)} className="in">
              <FontAwesomeIcon icon={faSearchPlus} />
            </div>
          </div>
          <div className="move-to">
            Move to
            <div className="coordinate">
              <input onChange={e => handleMoveTo(e, 'x')} value={coordinate.start.x} placeholder='x' type="text" />
              <input onChange={e => handleMoveTo(e, 'y')} value={coordinate.start.y} placeholder='y' type="text" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}


export default Map