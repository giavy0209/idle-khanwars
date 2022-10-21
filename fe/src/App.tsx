import { useEffect, useCallback } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import Routers from 'router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { storage } from 'utils';
import { useAppDispatch, useAppSelector, useSocketHandler } from 'hooks';
import { initDefault } from 'store';
import { userAction, resourceAction, buildingAction, unitAction, globalAction, trainingAction } from 'store/slices';
import { selectCastle, selectToken } from 'store/selectors';
import { Queue, Training, Upgrade } from 'components';
import { EVENT_SOCKET, ROUTERS } from 'const';
function App() {
  useSocketHandler({ action: [resourceAction.setResource], event: EVENT_SOCKET.RESOURCE })
  useSocketHandler({ action: [buildingAction.setBuilding, unitAction.setUnitByBuilding], event: EVENT_SOCKET.BUILDING })
  useSocketHandler({ action: [unitAction.setUnit], event: EVENT_SOCKET.UNIT })
  useSocketHandler({ action: [trainingAction.setTraining], event: EVENT_SOCKET.TRAINING })
  useSocketHandler({ action: [trainingAction.removeTraining], event: EVENT_SOCKET.TRAINING_DONE })

  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const token = useAppSelector(selectToken)
  const castle = useAppSelector(selectCastle)

  useEffect(() => {
    const storeToken = storage.getToken()
    if (storeToken) {
      dispatch(userAction.token(storeToken))
    }
  }, [dispatch])

  useEffect(() => {
    if (location.pathname !== `/${ROUTERS.LOGIN}` && !token) {
      dispatch(globalAction.setState({ memoLocation: location.pathname }))
    }
    if (token && location.pathname !== `/${ROUTERS.LOGIN}`) {
      if (!castle._id) {
        dispatch(initDefault())
      }
    } else {
      if (location.pathname !== `/${ROUTERS.LOGIN}`) {
        navigate(ROUTERS.LOGIN)
      }
    }
  }, [token, dispatch, location, navigate, castle])

  const handleRouter = useCallback((routers: typeof Routers) => {
    return routers.map(o => {
      return <Route key={o.path} path={o.path} element={<o.element />} >
        {o.children ? handleRouter(o.children) : null}
      </Route>
    })
  }, [])

  return (
    <div id="App">
      <ToastContainer />
      <Upgrade />
      <Training />
      <Routes>
        {
          handleRouter(Routers)
        }
      </Routes>
      {token && <Queue />}
    </div>
  );
}

export default App;
