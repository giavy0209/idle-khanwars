import { ScrollBackground, Button } from 'components'
import { Costs } from 'components'
import { BUILDING, ENHANCE, ENHANCE_TYPE } from 'const'
import { useAppDispatch, useAppSelector } from 'hooks'
import { FC, useCallback } from 'react'
import { selectBuildingGenerateByKey, selectUnitEnhance } from 'store/selectors'
import { postEnhance, unitAction } from 'store/slices'
import { secondToTime } from 'utils'

const Enhance: FC = () => {
  const unit = useAppSelector(selectUnitEnhance)
  const blacksmith = useAppSelector(selectBuildingGenerateByKey(BUILDING.BLACKSMITH))
  const dispatch = useAppDispatch()
  const onClose = useCallback(() => {
    dispatch(unitAction.enhance(undefined))
  }, [dispatch])

  const handleValue = useCallback((value: number, type: ENHANCE_TYPE) => {
    if (unit) {
      return `${value + value * unit.enhance.current[type].value / 100} -> ${value + value * unit.enhance.next[type].value / 100}`
    }
    return 0
  }, [unit])

  const handleEnhance = useCallback((type: ENHANCE) => {
    if (unit) {
      dispatch(postEnhance({ type, unit: unit?._id }))
      dispatch(unitAction.enhance(undefined))
    }
  }, [unit, dispatch])

  const handleMaxLevel = useCallback((type: ENHANCE_TYPE) => {
    if (unit) {
      const current = unit.enhance.current[type]
      const next = unit.enhance.next[type]
      if (current.level === next.level) return <span>{type} enhance at max level</span>
      return <Button onClick={() => handleEnhance(type.toUpperCase() as ENHANCE)}> Enhance {type} </Button>
    }
    return ''
  }, [unit, handleEnhance])
  return <>
    <div className="enhance">
      <ScrollBackground isShow={!!unit} onClose={onClose}>
        <div className="title">{unit?.default.name}</div>
        <div className="describe">
          {unit?.default.description}
          <p>Each enhance level increase stats 10%</p>
        </div>
        <div className="title">Attack ({unit?.enhance.current.attack.level})</div>
        <div className="strength">
          {
            unit?.default.strength.asArray.map(o => <div key={o.type.key} className="stat">
              <span>{o.type.name}</span>
              <span>{handleValue(o.value, ENHANCE_TYPE.attack)}</span>
            </div>)
          }
          <div className="costs">
            {<Costs resources={unit?.enhance.next.attack.resources.asArray} />}
            Time : {secondToTime(unit?.enhance.next.attack.time || 0, blacksmith)}
          </div>
          {handleMaxLevel(ENHANCE_TYPE.attack)}
        </div>
        <div className="title">Cargo ({unit?.enhance.current.cargo.level})</div>
        <div className="strength">
          <div className="stat">
            <span>Cargo</span>
            <span>{handleValue(unit?.default.cargo || 0, ENHANCE_TYPE.cargo)}</span>
          </div>
          <div className="costs">
            {<Costs resources={unit?.enhance.next.cargo.resources.asArray} />}
            Time : {secondToTime(unit?.enhance.next.cargo.time || 0, blacksmith)}
          </div>
          {handleMaxLevel(ENHANCE_TYPE.cargo)}
        </div>
        <div className="title">HP ({unit?.enhance.current.hp.level})</div>
        <div className="strength">
          <div className="stat">
            <span>HP</span>
            <span>{handleValue(unit?.default.life || 0, ENHANCE_TYPE.cargo)}</span>
          </div>
          <div className="costs">
            {<Costs resources={unit?.enhance.next.hp.resources.asArray} />}
            Time : {secondToTime(unit?.enhance.next.hp.time || 0, blacksmith)}
          </div>
          {handleMaxLevel(ENHANCE_TYPE.hp)}
        </div>
      </ScrollBackground>
    </div>
  </>
}

export default Enhance