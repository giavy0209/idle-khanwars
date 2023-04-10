import { Button, ScrollBackground } from "components"
import { DOMAIN } from "const"
import { useAppDispatch, useAppSelector } from "hooks"
import { MARCHING } from "interfaces"
import { FC, useCallback, memo } from "react"
import { selectMarchingDetail } from "store/selectors"
import { marchingAction, patchMarching } from "store/slices"

const MarchingDetail: FC = function () {
  const dispatch = useAppDispatch()

  const marching = useAppSelector(selectMarchingDetail)
  const handleClose = useCallback(() => {
    dispatch(marchingAction.setMarchingDetail(undefined))
  }, [dispatch])

  const handleReturn = useCallback(() => {
    if (!marching) return
    dispatch(patchMarching(marching._id))
    dispatch(marchingAction.setMarchingDetail(undefined))
  }, [marching])

  return (
    <div className="marching-detail">
      <ScrollBackground isShow={!!marching} onClose={handleClose}>
        <div className="title">{marching?.action}</div>
        <div className="title">Unit</div>
        <div className="units">
          {
            marching?.units.map(unit => <div key={unit._id} className="unit">
              <div className="image">
                <img src={DOMAIN + unit.type.default.path} alt="" />
              </div>
              <div className="info">
                <div className="name">{unit.type.default.name}</div>
                <div className="value">Total: {unit.total}</div>
              </div>
            </div>)
          }
        </div>
        {
          marching?.status === MARCHING.STATUS.TO_TARGET ?
            <Button onClick={handleReturn}> Return </Button> :
            <div className="status">Your army is coming home</div>
        }
      </ScrollBackground>
    </div>
  )
}

export default memo(MarchingDetail)