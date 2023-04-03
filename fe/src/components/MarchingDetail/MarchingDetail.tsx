import { Resources, ScrollBackground } from "components"
import { useAppDispatch, useAppSelector } from "hooks"
import { FC, useCallback, memo } from "react"
import { selectMarchingDetail } from "store/selectors"
import { marchingAction } from "store/slices"

const MarchingDetail: FC = function () {
  const dispatch = useAppDispatch()

  const marching = useAppSelector(selectMarchingDetail)
  console.log({ marching });

  const handleClose = useCallback(() => {
    dispatch(marchingAction.setMarchingDetail(undefined))
  }, [dispatch])

  return (
    <div className="marching-detail">
      <ScrollBackground isShow={!!marching} onClose={handleClose}>
        <div className="title">{marching?.action}</div>
        <Resources resources={marching?.cargo} />
      </ScrollBackground>
    </div>
  )
}

export default memo(MarchingDetail)