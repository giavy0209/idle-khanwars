import { Button } from "components";
import { ROUTERS } from "const";
import { useAppDispatch } from "hooks";
import { Main } from "layers";
import { FC, useCallback } from "react";
import { Link } from "react-router-dom";
import { userAction } from "store/slices";
import { storage } from "utils";
const Home: FC = () => {
  const dispatch = useAppDispatch()

  const handleLogout = useCallback(() => {
    storage.clearToken()
    dispatch(userAction.token(''))
  }, [dispatch])


  return (
    <>
      <div className="home">
        <Main>
          <div className="buttons">
            <div className="logout"><Button onClick={handleLogout} >Logout</Button></div>
          </div>
          <div className="navigation">
            <Link to={ROUTERS.BUILDING}>
              <div className="link">
                Buildings
              </div>
            </Link>
            <Link to={ROUTERS.UNIT}>
              <div className="link">
                Training
              </div>
            </Link>
          </div>
        </Main>
      </div>
    </>
  )
}

export default Home