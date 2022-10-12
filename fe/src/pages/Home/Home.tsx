import { Button } from "components";
import { DOMAIN } from "const";
import { useAppDispatch, useAppSelector } from "hooks";
import { Main } from "layers";
import { FC, useCallback } from "react";
import { Link } from "react-router-dom";
import { selectResources } from "store/selectors";
import { buildingSlice } from "store/slices/building";
import { IResource } from "store/slices/resource";
import { userSlice } from "store/slices/user";
import { storage } from "utils";
const Home: FC = () => {
  const dispatch = useAppDispatch()

  const handleLogout = useCallback(() => {
    storage.clearToken()
    dispatch(userSlice.actions.token(''))
  }, [dispatch])


  return (
    <>
      <div className="home">
        <Main>
          <div className="buttons">
            <div className="logout"><Button onClick={handleLogout} >Logout</Button></div>
          </div>
          <div className="navigation">
            <Link to="/building/army">
              <div className="link">
                Army Building
              </div>
            </Link>
            <Link to="/building/other">
              <div className="link">
                Other Building
              </div>
            </Link>
          </div>
        </Main>
      </div>
    </>
  )
}

export default Home