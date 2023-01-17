import { Button } from "components";
import { BUILDING, DOMAIN } from "const";
import { useAppDispatch, useAppSelector } from "hooks";
import { IUnit } from "interfaces";
import { Sub } from "layers";
import { ChangeEvent, FC, memo, useCallback, useMemo, useState, useEffect } from "react";
import { selectBuildingGenerateByKey, selectUnits } from "store/selectors";
import { moveUnit } from "store/slices";

const Tower: FC = () => {
  const units = useAppSelector(selectUnits)
  const towerValue = useAppSelector(selectBuildingGenerateByKey(BUILDING.TOWER))
  const dispatch = useAppDispatch()
  const [unitsValue, setUnitsValue] = useState<(IUnit & { in: number, out: number })[]>([])
  const totalInTower = useMemo(() => {
    let total = 0
    units.map(unit => total += unit.inTower * unit.default.population)
    const barProgress = total / (towerValue || 1) + '%'
    return { total, barProgress }
  }, [units, towerValue])

  useEffect(() => {
    units.forEach(unit => {
      setUnitsValue(unitsValue => {
        let newData = [...unitsValue]
        let isHave = newData.find(o => o._id === unit._id)

        if (isHave) {
          isHave = {
            ...isHave,
            ...unit,
          }
        } else {
          newData.push({ ...unit, in: 0, out: 0 })
        }
        console.log(newData);
        return newData
      })
    })
  }, [units])

  const handleChangeValue = useCallback((
    e: ChangeEvent<HTMLInputElement>,
    maxValue: number,
    unit: IUnit,
    type: 'MOVE_IN' | 'MOVE_OUT'
  ) => {
    const unitValue = unitsValue.find(o => o._id === unit._id)

    if (!unitValue) return
    if (!towerValue) {
      unitValue.in = 0
      unitValue.out = 0
      setUnitsValue([...unitsValue])
      return
    }

    let value = Number(e.target.value)
    if (!value) value = 0
    if (value > maxValue) value = maxValue
    if (type === 'MOVE_IN') {
      if (value * unit.default.population + totalInTower.total > towerValue) {
        const posiblePopulation = towerValue - totalInTower.total
        value = Math.floor(posiblePopulation / unit.default.population)
      }
      unitValue.in = value
    }
    if (type === 'MOVE_OUT') {
      unitValue.out = value
    }
    setUnitsValue([...unitsValue])
  }, [towerValue, totalInTower.total, unitsValue])

  const handleMove = useCallback((unit: IUnit, type: "TO_DEFENSE" | "TO_TOWER") => {
    const unitValue = unitsValue.find(o => o._id === unit._id)
    if (!unitValue) return
    let value = 0
    switch (type) {
      case 'TO_DEFENSE':
        value = unitValue.out
        break;
      case 'TO_TOWER':
        value = unitValue.in
        break;
      default:
        break;
    }
    dispatch(moveUnit({ type, unit: unit._id, value }))
  }, [dispatch, unitsValue])

  return (
    <Sub>
      <div className="tower">
        <div className="capacity">
          <div className="value">{totalInTower.total}/{towerValue}</div>
          <div style={{ width: totalInTower.barProgress }} className="bar"></div>
        </div>
        {
          unitsValue.map(unit => <div key={unit._id} className="unit">
            <div className="top">

              <div className="image">
                <img src={DOMAIN + unit.default.path} alt="" />
              </div>
              <div className="info">
                <p className="name">{unit.default.name}</p>
                <p>
                  <span>Defense:</span>
                  <span>{unit.total}</span>
                </p>
                <p>
                  <span>Tower:</span>
                  <span>{unit.inTower}</span>
                </p>
                <p>
                  <span>Population:</span>
                  <span>{unit.default.population}</span>
                </p>
              </div>
              <div className="select">
                <div className="input">
                  <p>
                    <span>Move out</span>
                  </p>
                  <input
                    onChange={(e) => handleChangeValue(e, unit.inTower, unit, 'MOVE_OUT')}
                    type="number"
                    value={unit.out.toString()}
                  />
                </div>
                <div className="input">
                  <p>
                    <span>Move in</span>
                  </p>
                  <input
                    onChange={(e) => handleChangeValue(e, unit.total, unit, 'MOVE_IN')}
                    type="number"
                    value={unit.in.toString()}
                  />
                </div>
              </div>
            </div>
            <div className="action">
              <Button onClick={() => handleMove(unit, 'TO_TOWER')}>Move in</Button>
              <Button onClick={() => handleMove(unit, 'TO_DEFENSE')}>Move out</Button>
            </div>
          </div>)
        }
      </div>
    </Sub>
  )
}

export default memo(Tower)