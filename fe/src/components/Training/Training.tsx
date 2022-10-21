import { ScrollBackground, Button } from 'components'
import { DOMAIN } from 'const'
import { useAppDispatch, useAppSelector } from 'hooks'
import { FC, useCallback, useState, useMemo, ChangeEvent } from 'react'
import { selectResource, selectUnitTraining } from 'store/selectors'
import { postTraining } from 'store/slices/trainingSlice'
import { unitSlice } from 'store/slices'
import { secondToTime } from 'utils'

const Training: FC = () => {
  const [total, setTotal] = useState('0')
  const unit = useAppSelector(selectUnitTraining)

  const resource = useAppSelector(selectResource)
  const dispatch = useAppDispatch()
  const onClose = useCallback(() => {
    dispatch(unitSlice.actions.training(undefined))
  }, [dispatch])

  const handleCosts = useCallback((total: number, showLeft: boolean) => {
    return unit?.default.resources.asArray.map(o => {
      const currentResouce = resource[o.type.key as keyof typeof resource]
      const resourceLeft = currentResouce - o.value * total
      return <div key={o._id} className="cost training">
        <div className="image">
          <img src={`${DOMAIN}${o.type.path}`} alt="" />
        </div>
        <div className="value">
          <span>{o.value * total}</span>
          {showLeft && <span className={`left ${resourceLeft >= 0 ? 'green' : 'red'}`}>{resourceLeft}</span>}
        </div>
      </div>
    })
  }, [unit, resource])

  const max = useMemo(() => {
    let max = Infinity
    if (!unit) return 0
    unit.default.resources.asArray.forEach(({ type, value }) => {
      const resourceType = resource[type.key as keyof typeof resource]
      const total = Math.floor(resourceType / value)
      if (max > total) max = total
    })

    return max
  }, [resource, unit])

  const handleTotal = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value
    let value = Number(v)
    if (!value) setTotal('0')
    if (!value)
      console.log(value);
    if (value > max) {
      setTotal(max.toString())
    } else {
      setTotal(value.toString())
    }
  }, [max])

  const handleTraining = useCallback(() => {
    if (!unit) return
    dispatch(postTraining({ total: Number(total), unit: unit._id }))
  }, [total, unit, dispatch])
  return <>
    <div className="training">
      <ScrollBackground isShow={!!unit} onClose={onClose}>
        <div className="title">{unit?.default.name}</div>
        <div className="describe">
          {unit?.default.description}
        </div>
        <div className="title">Strength</div>
        <div className="strength">
          {
            unit?.default.strength.asArray.map(o => <div key={o.type.key} className="stat">
              <span>{o.type.name}</span>
              <span>{o.value}</span>
            </div>)
          }
          <div className="stat">
            <span>HP</span>
            <span>{unit?.default.life}</span>
          </div>
          <div className="stat">
            <span>Range</span>
            <span>{unit?.default.range}</span>
          </div>
          <div className="stat">
            <span>Cargo</span>
            <span>{unit?.default.cargo}</span>
          </div>
          <div className="stat">
            <span>Speed</span>
            <span>{unit?.default.speed}</span>
          </div>
          <div className="stat">
            <span>Population</span>
            <span>{unit?.default.population}</span>
          </div>
          <div className="stat">
            <span>Training time</span>
            <span>{secondToTime(unit?.default.time || 0)}</span>
          </div>
        </div>
        <div className="title">Training Costs</div>
        <div className="costs">
          {handleCosts(1, false)}
        </div>
        <div className="title">Training Costs For {total}</div>
        <div className="costs">
          {handleCosts(Number(total), true)}
        </div>

        <div className="statistics">
          <div className="stat">
            <span>Time :</span>
            <span>{secondToTime(
              unit?.default.time ?
                (unit.default.time * (1 - unit.building.upgrade.current.generate / 100)) * Number(total)
                :
                0
            )}</span>
          </div>
        </div>
        <div className="title">Total</div>
        <div className="total">
          <input value={total} onChange={handleTotal} type="number" />
          <div onClick={() => setTotal(max.toString())} className="max">Max : {max}</div>
        </div>
        {
          <Button onClick={handleTraining}>Train</Button>
        }
      </ScrollBackground>
    </div>
  </>
}

export default Training