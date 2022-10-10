import { useEffect, useCallback } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import Routers from 'router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { storage } from 'utils';
import { useAppDispatch, useAppSelector } from 'hooks';
import { initDefault } from 'store';
import { userSlice } from 'store/slices/user';
import { selectToken } from 'store/selectors';
import { Upgrade } from 'components';
function App() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const token = useAppSelector(selectToken)
  useEffect(() => {
    const storeToken = storage.getToken()
    if (storeToken) {
      dispatch(userSlice.actions.token(storeToken))
    }
  }, [dispatch])
  useEffect(() => {
    if (token && location.pathname !== '/') {
      dispatch(initDefault())
    } else {
      if (location.pathname !== '/') {
        navigate('/')
      }
    }
  }, [token, dispatch, location,navigate])

  return (
    <div id="App">
      <ToastContainer />
      <Upgrade />
      <Routes>
        {
          Routers.map(o => <Route key={o.path} path={o.path} element={<o.element />} />)
        }
      </Routes>
    </div>
  );
}

export default App;
