import { ScrollBackground, Button } from "components";
import { DOMAIN } from "const";
import { useAppDispatch, useAppSelector } from "hooks";
import { FC, memo, useCallback, useEffect, useState } from "react";
import { selectBuildingUpgrade, selectResource, selectUpgradeCost } from "store/selectors";
import { buildingSlice, fetchUpgrade, postUpgrade } from "store/slices/building";
import { secondToTime } from "utils";

const Upgrade: FC = memo(() => {
  const dispatch = useAppDispatch()
  const building = useAppSelector(selectBuildingUpgrade)
  const upgradeCost = useAppSelector(selectUpgradeCost)
  const resource = useAppSelector(selectResource)
  const [isEnoughResource, setIsEnoughResource] = useState(true)
  useEffect(() => {
    if (building) {
      dispatch(fetchUpgrade(building._id))
    }
  }, [building, dispatch])
  const onClose = useCallback(() => {
    dispatch(buildingSlice.actions.setUpgrade(undefined))
  }, [dispatch])

  const handleCosts = useCallback(() => {
    return upgradeCost?.resources.asArray.map(o => {
      const currentResouce = resource[o.type.key as keyof typeof resource]
      const resourceLeft = currentResouce - o.value
      if (resourceLeft < 0) setIsEnoughResource(false)
      return <div key={o._id} className="cost">
        <div className="image">
          <img src={`${DOMAIN}${o.type.path}`} alt="" />
        </div>
        <div className="value">
          <span>{o.value}</span> /
          <span>{currentResouce}</span>
          <span className={`left ${resourceLeft >= 0 ? 'green' : 'red'}`}>{resourceLeft}</span>
        </div>
      </div>
    })
  }, [upgradeCost,resource])

  const handleUpgrade = useCallback(() => {
    if(building) {
      dispatch(postUpgrade(building._id))
      dispatch(buildingSlice.actions.setUpgrade(undefined))
    }
  }, [dispatch, building])
  return (
    <>
      <div className="upgrade">
        <ScrollBackground isShow={!!building} onClose={onClose}>
          <div className="title">{building?.default.name}</div>
          <div className="describe">
            {building?.default.description}
          </div>
          <div className="title">Upgrade Costs</div>
          <div className="costs">
            {handleCosts()}
          </div>
          <div className="statistics">
            <div className="stat">
              <span>Time:</span>
              <span>{secondToTime(upgradeCost?.time || 0)}</span>
            </div>
            <div className="stat">
              <span>Next level:</span>
              <span>{upgradeCost?.level}</span>
            </div>
            <div className="stat">
              <span>{upgradeCost?.building.type === 'RESOURCE' ? 'Generate per hour' : 'Reduce training time'}:</span>
              <span>{upgradeCost?.generate}</span>
            </div>
          </div>
          {
            isEnoughResource ?
              <Button onClick={handleUpgrade}>Upgrade</Button> :
              <div className="title">Not enough resource</div>
          }
        </ScrollBackground>
      </div>
    </>
  )
})

export default Upgrade