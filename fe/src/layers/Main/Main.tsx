import { DOMAIN } from "const";
import { useAppDispatch, useAppSelector } from "hooks";
import { FC, ReactNode, useCallback } from "react";
import { selectResources } from "store/selectors";
import { buildingSlice } from "store/slices/building";
import { IResource } from "store/slices/resource";
interface IMain {
  children: ReactNode
}
const Main: FC<IMain> = ({ children }) => {
  const dispatch = useAppDispatch()
  const resources = useAppSelector(selectResources)
  const handleUpgradeResource = useCallback((resource: IResource) => {
    dispatch(buildingSlice.actions.setUpgrade(resource.building))
  }, [dispatch])
  return (
    <>
      <div className="resources">
        {
          resources.map(o => <div onClick={() => handleUpgradeResource(o)} className="resource" key={o._id}>
            <img src={`${DOMAIN}${o.default.path}`} alt="" />
            <div className="name">{o.default.name}</div>
            <div className="value">{o.value}</div>
          </div>)
        }
      </div>
      {children}

    </>
  )
}

export default Main