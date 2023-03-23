import { ScrollBackground } from "components"
import { useAppDispatch, useAppSelector } from "hooks"
import { FC, useCallback } from "react"
import { selectMarchingDetail } from "store/selectors"
import { marchingAction } from "store/slices"

const MarchingDetail: FC = function () {
  const dispatch = useAppDispatch()
  const detail = useAppSelector(selectMarchingDetail)
  const handleClose = useCallback(() => {
    dispatch(marchingAction.setMarchingDetail(undefined))
  }, [dispatch])
  return (
    <div className="marching-detail">
      <ScrollBackground isShow={!!detail} onClose={handleClose}>
        <div className="title"></div>
      </ScrollBackground>
    </div>
  )
}

export default MarchingDetail