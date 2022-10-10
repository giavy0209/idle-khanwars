import { useEffect ,useCallback} from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Routers from 'router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { storage } from 'utils';
import { useAppDispatch, useAppSelector } from 'hooks';
import { initDefault } from 'store';
import { userSlice } from 'store/slices/user';
import { selecToken } from 'store/selectors';
import { Button } from 'components';
function App() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const token = useAppSelector(selecToken)
  useEffect(() => {
    const storeToken = storage.getToken()
    if (storeToken) {
      dispatch(userSlice.actions.token(storeToken))
    }
  }, [])
  useEffect(() => {
    if(token) {
      dispatch(initDefault())
    }else {
      navigate('/')
    }
  },[token])
  const handleLogout = useCallback(() => {
    storage.clearToken()
    dispatch(userSlice.actions.token(''))
  },[dispatch])
  return (
    <div id="App">
      {
        token && <Button onClick={handleLogout} >Logout</Button>
      }
      <ToastContainer />
      <Routes>
        {
          Routers.map(o => <Route key={o.path} path={o.path} element={<o.element />} />)
        }
      </Routes>
    </div>
  );
}

export default App;
