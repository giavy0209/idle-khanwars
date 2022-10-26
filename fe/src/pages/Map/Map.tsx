import { faArrowCircleDown, faArrowCircleLeft, faArrowCircleRight, faArrowCircleUp, faSearchMinus, faSearchPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FC, useState, useMemo, useCallback, CSSProperties, useEffect } from 'react'
const Map: FC = () => {
  const [grid, setGrid] = useState(5)
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
  return (
    <>
      <div className="map">
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
              return x.map((_x) => <div key={`${_x}:${_y}`} className="block">
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
              <input value={coordinate.start.x} placeholder='x' type="text" />
              <input value={coordinate.start.y} placeholder='y' type="text" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}


export default Map