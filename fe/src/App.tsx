import { useEffect, useCallback } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import Routers from 'router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { storage } from 'utils';
import { useAppDispatch, useAppSelector, useSocketHandler } from 'hooks';
import { initDefault } from 'store';
import { userSlice } from 'store/slices/user';
import { selectCastle, selectToken } from 'store/selectors';
import { Queue, Upgrade } from 'components';
import { EVENT_SOCKET, ROUTERS } from 'const';
import { resourceSlice } from 'store/slices/resource';
import { buildingSlice } from 'store/slices/building';
import { globalSlice } from 'store/slices/global';
function App() {
  useSocketHandler({ action: resourceSlice.actions.setResource, event: EVENT_SOCKET.RESOURCE })
  useSocketHandler({ action: buildingSlice.actions.setBuilding, event: EVENT_SOCKET.BUILDING })

  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const token = useAppSelector(selectToken)
  const castle = useAppSelector(selectCastle)

  useEffect(() => {
    const storeToken = storage.getToken()
    if (storeToken) {
      dispatch(userSlice.actions.token(storeToken))
    }
  }, [dispatch])

  useEffect(() => {
    if (location.pathname !== ROUTERS.LOGIN && !token) {
      dispatch(globalSlice.actions.setState({ memoLocation: location.pathname }))
    }
    if (token && location.pathname !== ROUTERS.LOGIN) {
      if (!castle._id) {
        dispatch(initDefault())
      }
    } else {
      if (location.pathname !== ROUTERS.LOGIN) {
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
      <Routes>
        {
          handleRouter(Routers)
        }
      </Routes>
      <Queue />
    </div>
  );
}

export default App;
