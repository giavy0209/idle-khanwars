import { faArrowCircleDown, faArrowCircleLeft, faArrowCircleRight, faArrowCircleUp, faSearchMinus, faSearchPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ChangeEvent, Dispatch, FC, memo, SetStateAction, useCallback, } from 'react'
interface IControl {
  coordinate: {
    start: { x: number, y: number },
    end: { x: number, y: number }
  }
  setCoordinate: Dispatch<SetStateAction<IControl['coordinate']>>
  grid: number
  setGrid: Dispatch<SetStateAction<IControl['grid']>>
}
const Control: FC<IControl> = ({ coordinate, grid, setCoordinate, setGrid }) => {
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
  }, [coordinate, setCoordinate])

  const changeGrid = useCallback((value: number) => {
    const newGrid = grid + value
    if (newGrid >= 3 && newGrid <= 20) {
      setGrid(newGrid)
    }
  }, [grid, setGrid])

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
  }, [coordinate, grid, setCoordinate])
  return <div className="control">
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
}

export default memo(Control)