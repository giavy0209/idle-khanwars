import { Button } from "components";
import { BUILDING, ROUTERS } from "const";
import { useAppDispatch, useAppSelector } from "hooks";
import { Main } from "layers";
import { FC, useCallback } from "react";
import { Link } from "react-router-dom";
import { selectBuildingByKey, selectCastle } from "store/selectors";
import { castleAction, userAction } from "store/slices";
import { storage } from "utils";
const Home: FC = () => {
  const dispatch = useAppDispatch()
  const dwelling = useAppSelector(selectBuildingByKey(BUILDING.DWELLINGS))
  const castle = useAppSelector(selectCastle)
  const handleLogout = useCallback(() => {
    storage.clearToken()
    dispatch(userAction.token(''))
    dispatch(castleAction.reset())
  }, [dispatch])
  return (
    <>
      <div className="home">
        <Main>
          <div className="buttons">
            <div className="logout"><Button onClick={handleLogout} >Logout</Button></div>
          </div>
          <div className="population">
            <div className="bar">
              <div className="value">Population: {castle.population} / {dwelling?.upgrade.current.generate}</div>
              <div className="process" style={{
                width: castle.population / (dwelling?.upgrade.current.generate || castle.population) * 100 + '%'
              }}></div>
            </div>
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