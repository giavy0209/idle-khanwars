import { useEffect, useCallback } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import Routers from 'router';
import { ToastContainer } from 'react-toastify';
import { storage } from 'utils';
import { useAppDispatch, useAppSelector } from 'hooks';
import { initDefault } from 'store';
import { userAction, globalAction } from 'store/slices';
import { selectCastle, selectToken } from 'store/selectors';
import { Queue, Training, Upgrade } from 'components';
import { ROUTERS } from 'const';
import useSocketHandlers from 'useSocketHandlers';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  useSocketHandlers()

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
    console.log(location.pathname);

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
