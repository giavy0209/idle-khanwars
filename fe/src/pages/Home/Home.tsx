import { Button } from "components";
import { BUILDING, ROUTERS } from "const";
import { useAppDispatch, useAppSelector } from "hooks";
import { Main } from "layers";
import { FC, useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { selectBuildingByKey, selectCastle } from "store/selectors";
import { castleAction, userAction } from "store/slices";
import { storage } from "utils";
import Joyride from 'react-joyride';
const steps = [
  {
    target: '.home .resources',
    content: 'Here is your resouce, limit and how much your castle generate per hour.'
  },
  {
    target: '.home .resources .resource',
    content: 'Click on it to upgrade your mine, increase generate per hour'
  },
  {
    target: '.navigation',
    content: 'Click here to go to list building and list army'
  }
]
const Home: FC = () => {
  const dispatch = useAppDispatch()
  const dwelling = useAppSelector(selectBuildingByKey(BUILDING.DWELLINGS))
  const castle = useAppSelector(selectCastle)

  const [isShowTutorial, setIsShowTutorial] = useState(false)

  const handleLogout = useCallback(() => {
    storage.clearToken()
    dispatch(userAction.token(''))
    dispatch(castleAction.reset())
  }, [dispatch])

  return (
    <>
      <Joyride
        steps={steps}
        run={isShowTutorial}
        continuous
        showProgress
      />
      <div className="home">
        <Main>
          <div className="buttons">
            <div className="logout"><Button onClick={handleLogout} >Logout</Button></div>
            <div className="logout"><Button onClick={() => setIsShowTutorial(true)} >Tutorial</Button></div>
          </div>
          <div className="population">
            <div className="bar">
              <div className="value">Population: {castle.population} / {dwelling?.upgrade.current.generate}</div>
              <div className="process" style={{
                width: castle.population / (dwelling?.upgrade.current.generate || castle.population) * 100 + '%'
              }}></div>
            </div>
          </div>
          <div className="menu">
            <Link to={ROUTERS.MAP}>
              <div className="world">
                <span>World</span>
              </div>
            </Link>
            <Link to={ROUTERS.UNIT}>
              <div className="building">
                <span>
                  Building
                </span>
              </div>
            </Link>
            <Link to={ROUTERS.UNIT}>
              <div className="army">
                <span>
                  Army
                </span>
              </div>
            </Link>
          </div>
          <div className="navigation">
            <Link to={ROUTERS.BUILDING}>
              <div className="link">
                Buildings
              </div>
            </Link>
            <Link to={ROUTERS.ENHANCE}>
              <div className="link">
                Enhance
              </div>
            </Link>
          </div>
        </Main>
      </div>
    </>
  )
}

export default Home