import { useAppSelector } from 'hooks'
import useCountDown from 'hooks/useCountDown'
import { IMarching, MARCHING } from 'interfaces'
import { FC, useMemo, CSSProperties } from 'react'
import { secondToTime } from 'utils'
import { selectUser } from 'store/selectors'
import renderDate from 'utils/renderDate'
const Marching: FC<{ marching: IMarching }> = ({ marching }) => {
  const countDown = useCountDown(marching.status === MARCHING.STATUS.TO_TARGET ? marching.arriveAt : marching.homeAt, false)
  const user = useAppSelector(selectUser)
  const toCoordinates = useMemo(() => {
    if (marching.to) {
      return marching.to.coordinate
    }
    return marching.coordinate
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
  return (
    <>
      <tr>
        <td>{renderDate({ date: marching.startAt, wrap: true })}</td>
        <td>{marching.from.coordinate.x} : {marching.from.coordinate.y}</td>
        <td>{toCoordinates.x} : {toCoordinates.y}</td>
        <td>{renderDate({ date: marching.arriveAt, wrap: true })}</td>
      </tr>
      <tr className='progress-bar'>
        <td
          style={{ "--width": percent + '%' } as CSSProperties}
          className={`progress-bar ${marching.status === MARCHING.STATUS.TO_TARGET && marching.from.user?._id === user._id ? 'to-target' : 'go-home'}`}
          colSpan={4}>
          <span className="progress"></span>
          <span className="time">{secondToTime(countDown)}</span>
        </td>
      </tr>
    </>
  )
}

export default Marching