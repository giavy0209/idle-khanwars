import callAPI from 'callAPI'
import { Button, ScrollBackground } from 'components'
import { ROUTERS } from 'const'
import { useAppDispatch, useAppSelector } from 'hooks'
import { ICastle } from 'interfaces'
import { FC, useState, useCallback, useEffect, memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { selectUser } from 'store/selectors'
import { fetchMapCastles } from 'store/slices'
import Actions from './Actions'
import Control from './Control'
import { ACTION } from 'interfaces'
// import Joiride from './Joyride'
import View from './View'



const actions = Object.values(ACTION) as ACTION[]

const Map: FC = () => {
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectUser)
  const navigate = useNavigate()
  const [grid, setGrid] = useState(10)
  const [selectedGrid, setSelectedGrid] = useState<{ x: number, y: number, castle?: ICastle } | null>(null)
  const [coordinate, setCoordinate] = useState({ start: { x: 0, y: 0 }, end: { x: 4, y: 4 } })
  const [isShowAction, setIsShowAction] = useState(false)
  const [currentAction, setCurrentAction] = useState<ACTION | null>(null)

  useEffect(() => {
    dispatch(fetchMapCastles(coordinate))
  }, [coordinate, dispatch])

  useEffect(() => {
    setCoordinate(coordinate => {
      return {
        start: coordinate.start,
        end: {
          x: coordinate.start.x + grid - 1,
          y: coordinate.start.y + grid - 1
        }
      }
    })
  }, [grid])

  const handleBuildCastle = useCallback(async () => {
    const data = await callAPI.post('/castles/place', { x: selectedGrid?.x, y: selectedGrid?.y }, { toastSuccess: true })
    if (data.code === 200) {
      dispatch(fetchMapCastles(coordinate))
    }
  }, [selectedGrid, dispatch, coordinate])

  const handleGoToCastle = useCallback(() => {
    if (user.isSelectStart) {
      navigate(ROUTERS.HOME)
    } else {
      toast('Please select the place to build your castle')
    }
  }, [navigate, user])
  return (
    <>
      <div className="map">
        <ScrollBackground
          setIsShow={setIsShowAction}
          isShow={isShowAction}>
          <div className="actions">
            {
              actions.map(o => <div onClick={() => setCurrentAction(o)} className="action">
                <div className={o}></div>
                <span className='title'>{o}</span>
              </div>)
            }
          </div>
        </ScrollBackground>

        <Actions selectedGrid={selectedGrid} currentAction={currentAction} setCurrentAction={setCurrentAction} />

        <div onClick={handleGoToCastle} className="castle"></div>
        {
          !user.isSelectStart && <div className="title">Please select location to place your castle</div>
        }
        <div className={`selected-grid ${selectedGrid ? 'show' : ''}`}>
          <p>{selectedGrid?.x} : {selectedGrid?.y}</p>
          {
            selectedGrid?.castle ?
              <>
                <div className="name">{selectedGrid.castle.user?.username}'s castle</div>
                <Button onClick={() => setIsShowAction(!isShowAction)}>Action</Button>
              </>
              :
              <p>Empty</p>
          }
          {!selectedGrid?.castle && !user.isSelectStart && <Button onClick={handleBuildCastle}>Build castle</Button>}
        </div>

        <View
          coordinate={coordinate}
          grid={grid}
          selectedGrid={selectedGrid}
          setSelectedGrid={setSelectedGrid}
        />
        <Control
          coordinate={coordinate}
          setCoordinate={setCoordinate}
          grid={grid}
          setGrid={setGrid}
        />
      </div>
    </>
  )
}


export default memo(Map)