import { BUILDING, DOMAIN } from "const";
import { useAppDispatch, useAppSelector } from "hooks";
import { IResource } from "interfaces";
import { FC, ReactNode, useCallback, memo } from "react";
import { selectBuildingByKey, selectResources } from "store/selectors";
import { buildingAction } from "store/slices";
interface IMain {
  children: ReactNode
}
const Main: FC<IMain> = memo(({ children }) => {
  const dispatch = useAppDispatch()
  const resources = useAppSelector(selectResources)
  const storage = useAppSelector(selectBuildingByKey(BUILDING.STORAGE))
  const handleUpgradeResource = useCallback((resource: IResource) => {
    dispatch(buildingAction.setUpgrade(resource.building))
  }, [dispatch])
  return (
    <>
      <div className="resources">
        {
          resources.map(o => <div onClick={() => handleUpgradeResource(o)} className="resource" key={o._id}>
            <img src={`${DOMAIN}${o.default.path}`} alt="" />
            <div className="name">{o.default.name}</div>
            <div className="value">{o.value} / {storage?.upgrade.current.generate}</div>
            <div className="value">{o.building.upgrade.current.generate}/h</div>
          </div>)
        }
      </div>
      {children}
    </>
  )
})

export default Main