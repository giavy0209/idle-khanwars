import { useEffect, useCallback } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import Routers from 'router';
import { ToastContainer } from 'react-toastify';
import { storage } from 'utils';
import { useAppDispatch, useAppSelector } from 'hooks';
import { initDefault } from 'store';
import { userAction, globalAction } from 'store/slices';
import { selectCastle, selectToken, selectUser } from 'store/selectors';
import { Enhance, Queue, Training, Upgrade } from 'components';
import { ROUTERS } from 'const';
import useSocketHandlers from 'useSocketHandlers';
import 'react-toastify/dist/ReactToastify.css';
import useWindowSize from 'hooks/useWindowSize';
function App() {
  useSocketHandlers()
  const size = useWindowSize()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const token = useAppSelector(selectToken)
  const user = useAppSelector(selectUser)
  const castle = useAppSelector(selectCastle)

  useEffect(() => {
    const storeToken = storage.getToken()
    if (storeToken) {
      dispatch(userAction.token(storeToken))
    }
  }, [dispatch])

  useEffect(() => {
    if (location.pathname !== `${ROUTERS.LOGIN}` && !token) {
      dispatch(globalAction.setState({ memoLocation: location.pathname }))
    }
    if (token && location.pathname !== `${ROUTERS.LOGIN}`) {
      if (!castle._id) {
        dispatch(initDefault())
      }
    } else {
      if (location.pathname !== `${ROUTERS.LOGIN}`) {
        navigate(ROUTERS.LOGIN)
      }
    }
  }, [token, dispatch, location, navigate, castle])

  useEffect(() => {
    if (token && !user.isSelectStart) {
      navigate(ROUTERS.MAP)
    }
  }, [user, token, navigate])

  const handleRouter = useCallback((routers: typeof Routers) => {
    return routers.map(o => {
      return <Route key={o.path} path={o.path} element={<o.element />} >
        {o.children ? handleRouter(o.children) : null}
      </Route>
    })
  }, [])

  return (
    <div id="App">
      <ToastContainer position='bottom-center' autoClose={1000} />
      <Upgrade />
      <Training />
      <Enhance />
      <Enhance />
      <Routes>
        {
          handleRouter(Routers)
        }
      </Routes>
      {token && user.isSelectStart && <Queue />}
    </div>
  );
}

export default App;
