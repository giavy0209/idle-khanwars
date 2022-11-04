import { ScrollBackground, Button } from 'components'
import { useAppDispatch, useAppSelector } from 'hooks'
import { FC, useCallback } from 'react'
import { selectUnitEnhance } from 'store/selectors'
import { unitAction } from 'store/slices'
import { secondToTime } from 'utils'

const Enhance: FC = () => {
  const unit = useAppSelector(selectUnitEnhance)

  const dispatch = useAppDispatch()
  const onClose = useCallback(() => {
    dispatch(unitAction.enhance(undefined))
  }, [dispatch])
  return <>
    <div className="enhance">
      <ScrollBackground isShow={!!unit} onClose={onClose}>
        <div className="title">{unit?.default.name}</div>
        <div className="describe">
          {unit?.default.description}
        </div>
        <div className="title">Attack</div>
        <div className="strength">
          {
            unit?.default.strength.asArray.map(o => <div key={o.type.key} className="stat">
              <span>{o.type.name}</span>
              <span>{o.value}</span>
            </div>)
          }
          <Button > Enhance Attack </Button>

          <div className="stat">
            <span>Cargo</span>
            <span>{unit?.default.cargo}</span>
          </div>
          <Button > Enhance Cargo </Button>
        </div>
        <div className="title">HP</div>
        <div className="strength">
          <div className="stat">
            <span>HP</span>
            <span>{unit?.default.life}</span>
          </div>
          <Button > Enhance HP </Button>
        </div>
      </ScrollBackground>
    </div>
  </>
}

export default Enhance