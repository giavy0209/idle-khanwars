import { Button, ScrollBackground } from "components";
import { DOMAIN } from "const";
import { useAppDispatch, useAppSelector } from "hooks";
import { MARCHING, ICastle, IUnit } from "interfaces";
import { FC, memo, Dispatch, useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import { selectAvailableUnit, selectCastle } from "store/selectors";
import { postMarching } from "store/slices";
import { secondToTime } from "utils";

interface IActions {
  selectedGrid: { x: number, y: number, castle?: ICastle } | null
  currentAction: MARCHING.ACTION | null
  setCurrentAction: Dispatch<MARCHING.ACTION | null>
}

const Actions: FC<IActions> = ({ selectedGrid, currentAction, setCurrentAction }) => {
  const dispatch = useAppDispatch()
  const units = useAppSelector(selectAvailableUnit)
  const castle = useAppSelector(selectCastle)
  const [selectedUnit, setSelectedUnit] = useState<(IUnit & { selected: number })[]>([])
  useEffect(() => {
    units.forEach(unit => {
      setSelectedUnit(unitsValue => {
        let newData = [...unitsValue]
        const index = newData.findIndex(o => o._id === unit._id)
        if (newData[index]) {
          newData[index] = {
            ...newData[index],
            ...unit,
            total: unit.total,
          }
        } else {
          newData.push({ ...unit, selected: 0 })
        }
        return newData
      })
    })
  }, [units])

  const handleSelectUnit = useCallback((unit: string, value: number | string) => {
    const index = selectedUnit.findIndex(o => o._id === unit)
    const findUnit = selectedUnit[index]

    if (typeof value === 'string') value = Number(value)

    if (!Number.isInteger(value) || value < 0) value = 0
    if (value > findUnit.total) value = findUnit.total

    findUnit.selected = value
    setSelectedUnit([...selectedUnit])
  }, [selectedUnit])

  const stat = useMemo(() => {
    let minSpeed = 0
    let population = 0
    selectedUnit.forEach(unit => {
      if (unit.default.speed > minSpeed && unit.selected > 0) minSpeed = unit.default.speed
      population += unit.default.population * unit.selected
    })
    let distance = 0
    if (selectedGrid) {
      distance = Math.sqrt(Math.pow(selectedGrid.x - castle.coordinate.x, 2) + Math.pow(selectedGrid.y - castle.coordinate.y, 2))
    }
    const time = minSpeed * distance * 60
    return { minSpeed, population, distance, time }
  }, [selectedUnit, selectedGrid, castle])
  const handleAction = useCallback(() => {
    const ishaveUnit = selectedUnit.find(unit => unit.selected > 0)
    if (!ishaveUnit) {
      return toast('You have to select atleast 1 unit')
    }

    switch (currentAction) {
      case MARCHING.ACTION.ATTACK:
      case MARCHING.ACTION.SPY:
        if (!selectedGrid?.castle) {
          return toast(`Cannot ${currentAction} this target `)
        }
        dispatch(postMarching({
          action: currentAction,
          to: selectedGrid.castle._id,
          units: selectedUnit
        }))
        break;
      case MARCHING.ACTION.CARAVAN:
      case MARCHING.ACTION.PATROL:
        if (!selectedGrid) {
          return toast('You are not selected coordinates')
        }
        dispatch(postMarching({
          action: currentAction,
          coordinates: {
            x: selectedGrid.x,
            y: selectedGrid.y,
          },
          units: selectedUnit
        }))
        break;

      default:
        break;
    }


  }, [currentAction, selectedUnit, selectedGrid, dispatch])
  return (
    <>
      <div className="action-handler">
        <ScrollBackground isShow={!!currentAction} onClose={() => setCurrentAction(null)}>
          <div className="units">
            <div className="marching-stat">
              <div className="stat"><span>Population:</span><span> {stat.population}</span></div>
              <div className="stat"><span>Minspeed:</span><span> {stat.minSpeed}</span></div>
              <div className="stat"><span>Distance:</span><span> {stat.distance.toFixed(2)}</span></div>
              <div className="stat"><span>Time:</span><span> {secondToTime(stat.time)}</span></div>
              <Button onClick={handleAction}>{currentAction}</Button>
            </div>
            {
              selectedUnit.map(o => <div key={o._id} className="unit">
                <div className="name">
                  <div className="img">
                    <img src={`${DOMAIN}${o.default.path}`} alt="" />
                  </div>
                  <span>{o.default.name}</span>
                </div>
                <div className="input">
                  <input value={o.selected} onChange={(e) => handleSelectUnit(o._id, e.target.value)} type="number" />
                  <span onClick={() => handleSelectUnit(o._id, 0)} className="max">Min: 0</span>
                  <span onClick={() => handleSelectUnit(o._id, o.total)} className="max">Max: {o.total}</span>
                </div>
              </div>)
            }
          </div>
        </ScrollBackground>
      </div>
    </>
  )
}

export default memo(Actions)