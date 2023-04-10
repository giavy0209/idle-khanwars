import { useAppDispatch, useAppSelector } from 'hooks'
import useCountDown from 'hooks/useCountDown'
import { IMarching, MARCHING } from 'interfaces'
import { FC, useMemo, CSSProperties, useCallback } from 'react'
import { secondToTime } from 'utils'
import { selectUser } from 'store/selectors'
import renderDate from 'utils/renderDate'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfo } from '@fortawesome/free-solid-svg-icons'
import { marchingAction } from 'store/slices'
const Marching: FC<{ marching: IMarching }> = ({ marching }) => {
  const dispatch = useAppDispatch()
  const countDown = useCountDown(marching.status === MARCHING.STATUS.TO_TARGET ? marching.arriveAt : marching.homeAt, false)
  const user = useAppSelector(selectUser)
  const toCoordinates = useMemo(() => {
    if (marching.to) {
      return marching.to.coordinate
    }
    return marching.coordinates
  }, [marching])

  const percent = useMemo(() => {
    let startTime: number = 0
    let endTime: number = 0
    if (marching.status === MARCHING.STATUS.TO_TARGET) {
      startTime = new Date(marching.startAt).getTime()
      endTime = new Date(marching.arriveAt).getTime()
    } else {
      startTime = new Date(marching.arriveAt).getTime()
      endTime = new Date(marching.homeAt).getTime()
    }
    return (1 - countDown * 1000 / (endTime - startTime)) * 100
  }, [marching, countDown])

  const handleSetMarchingDetail = useCallback(() => {
    dispatch(marchingAction.setMarchingDetail(marching))
  }, [marching, dispatch])
  return (
    <>
      <div className="marching">
        <div onClick={handleSetMarchingDetail} className="open-detail">
          <FontAwesomeIcon icon={faInfo} />
        </div>
        <div className="stats">
          <div className="stat">
            <span>Start At:</span>
            <span>{renderDate({ date: marching.startAt })}</span>
          </div>
          <div className="stat">
            <span>Arrive At:</span>
            <span>{renderDate({ date: marching.arriveAt })}</span>
          </div>
          <div className="stat">
            <span>From:</span>
            <span>{marching.from.coordinate.x} : {marching.from.coordinate.y} {marching.from.name}</span>
          </div>

          <div className="stat">
            <span>To:</span>
            <span>{toCoordinates.x} : {toCoordinates.y}{marching.to?.name}</span>
          </div>
        </div>
        <div
          style={{ "--width": percent + '%' } as CSSProperties}
          className={`progress-bar ${marching.status === MARCHING.STATUS.TO_TARGET && marching.from.user?._id === user._id ? 'to-target' : 'go-home'}`}
        >
          <span className="progress"></span>
          <span className="time">{secondToTime(countDown)}</span>
        </div>
      </div>
    </>
  )
}

export default Marching