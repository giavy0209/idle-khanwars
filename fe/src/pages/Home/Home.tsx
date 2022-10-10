import { Button } from "components";
import { DOMAIN } from "const";
import { useAppDispatch, useAppSelector } from "hooks";
import { FC, useCallback } from "react";
import { selectResources } from "store/selectors";
import { buildingSlice } from "store/slices/building";
import { IResource } from "store/slices/resource";
import { userSlice } from "store/slices/user";
import { storage } from "utils";
const Home: FC = () => {
  const dispatch = useAppDispatch()
  const resources = useAppSelector(selectResources)

  const handleLogout = useCallback(() => {
    storage.clearToken()
    dispatch(userSlice.actions.token(''))
  }, [dispatch])

  const handleUpgradeResource = useCallback((resource : IResource) => {
    dispatch(buildingSlice.actions.setUpgrade(resource.building))
  }, [dispatch])
  return (
    <>
      <div className="home">
        <div className="resources">
          {
            resources.map(o => <div onClick={() => handleUpgradeResource(o)} className="resource" key={o._id}>
              <img src={`${DOMAIN}${o.default.path}`} alt="" />
              <div className="name">{o.default.name}</div>
              <div className="value">{o.value}</div>
            </div>)
          }
        </div>
        <div className="buttons">
          <div className="logout"><Button onClick={handleLogout} >Logout</Button></div>
        </div>
      </div>
    </>
  )
}

export default Home