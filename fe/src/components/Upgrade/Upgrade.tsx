import { ScrollBackground, Button } from "components";
import { BUILDING, DOMAIN, ROUTERS } from "const";
import { useAppDispatch, useAppSelector } from "hooks";
import { FC, memo, useCallback, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { selectBuildingUpgrade, selectResource, selectUpgradeCost } from "store/selectors";
import { buildingAction, postUpgrade, upgradeAction } from "store/slices";
import { secondToTime } from "utils";

const Upgrade: FC = memo(() => {
  const dispatch = useAppDispatch()
  const building = useAppSelector(selectBuildingUpgrade)
  const upgradeCost = useAppSelector(selectUpgradeCost)
  const resource = useAppSelector(selectResource)
  useEffect(() => {
    if (building) {
      dispatch(upgradeAction.setUpgradeCost(building.upgrade.next))
    }
  }, [building, dispatch])
  const onClose = useCallback(() => {
    dispatch(buildingAction.setUpgrade(undefined))
  }, [dispatch])

  const isEnoughResource = useMemo(() => {
    if (upgradeCost) {
      for (const item of upgradeCost.resources.asArray) {
        const currentResouce = resource[item.type.key as keyof typeof resource]
        const resourceLeft = currentResouce - item.value
        if (resourceLeft < 0) {
          return false
        }
      }
      return true
    }
    return false
  }, [upgradeCost, resource])

  const text = useMemo(() => {
    if (!upgradeCost) return {}
    let stat = ''
    let value = ''
    switch (upgradeCost.building.key) {
      case BUILDING.GOLD_MIME:
      case BUILDING.IRON_MINE:
      case BUILDING.FARMS:
      case BUILDING.LUMBERJACKS:
        stat = 'Generate per hour'
        value = `${upgradeCost.generate}/h`
        break;
      case BUILDING.BARRACKS:
      case BUILDING.ARCHERY_RANGE:
      case BUILDING.STABLES:
      case BUILDING.WORKSHOP:
      case BUILDING.ORDER:
        stat = 'Reduce training time'
        value = `${upgradeCost.generate}%`
        break;
      case BUILDING.STORAGE:
      case BUILDING.SHELTER:
      case BUILDING.TOWER:
      case BUILDING.MARKET:
      case BUILDING.DWELLINGS:
      case BUILDING.INFIRMARY:
        stat = 'Increase storage'
        value = `${upgradeCost.generate}`
        break;
      case BUILDING.BLACKSMITH:
        stat = 'Reduce upgrade time'
        value = `${upgradeCost.generate}%`
        break;
      default:
        break;
    }
    return {
      stat, value
    }
  }, [upgradeCost])

  const buildingURL = useMemo(() => {
    if (!upgradeCost) return null
    switch (upgradeCost.building.key) {
      case BUILDING.BARRACKS:
        return `${ROUTERS.UNIT}/${BUILDING.BARRACKS}`
      case BUILDING.ARCHERY_RANGE:
        return `${ROUTERS.UNIT}/${BUILDING.ARCHERY_RANGE}`
      case BUILDING.STABLES:
        return `${ROUTERS.UNIT}/${BUILDING.STABLES}`
      case BUILDING.WORKSHOP:
        return `${ROUTERS.UNIT}/${BUILDING.WORKSHOP}`
      case BUILDING.ORDER:
        return `${ROUTERS.UNIT}/${BUILDING.ORDER}`
      case BUILDING.BLACKSMITH:
        return `${ROUTERS.ENHANCE}`
      default:
        return null
    }

  }, [upgradeCost])

  const handleCosts = useCallback(() => {
    return upgradeCost?.resources.asArray.map(o => {
      const currentResouce = resource[o.type.key as keyof typeof resource]
      const resourceLeft = currentResouce - o.value
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
  }, [upgradeCost, resource])

  const handleUpgrade = useCallback(() => {
    if (building) {
      dispatch(postUpgrade(building._id))
      dispatch(buildingAction.setUpgrade(undefined))
    }
  }, [dispatch, building])

  const handleEnterBuilding = useCallback(() => {
    dispatch(buildingAction.setUpgrade(undefined))
  }, [dispatch])
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
              <span>{text.stat}</span>
              <span>{text.value}</span>
            </div>
          </div>
          {
            isEnoughResource ? <Button onClick={handleUpgrade}>Upgrade</Button> : <div className="title">Not enough resource</div>
          }
          {buildingURL && <Button onClick={handleEnterBuilding} type="button"> <Link to={buildingURL}><span>Enter building</span></Link> </Button>}
        </ScrollBackground>
      </div>
    </>
  )
})

export default Upgrade