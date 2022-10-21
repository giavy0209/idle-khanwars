import { BUILDING_TYPE, DOMAIN } from "const";
import { useAppDispatch, useAppSelector } from "hooks";
import { IBuilding } from "interfaces";
import { Sub } from "layers";
import { FC, useCallback } from "react";
import { selectBuildingByType } from "store/selectors";
import { buildingSlice } from "store/slices";

interface IList {
  type: keyof typeof BUILDING_TYPE
}

const List: FC<IList> = ({ type }) => {
  const dispatch = useAppDispatch()
  const buildings = useAppSelector(selectBuildingByType(BUILDING_TYPE[type]))
  const handleUpgrade = useCallback((building: IBuilding) => {
    dispatch(buildingSlice.actions.setUpgrade(building))
  }, [dispatch])



  return (
    <>
      <Sub>
        <div className="building">
          <div className="list">
            {
              buildings.map(o => <div onClick={() => handleUpgrade(o)} key={o._id} className="item">
                <div className="contain">
                  <img src={`${DOMAIN}${o.default.path}`} alt="" />
                  <p>{o.default.name}</p>
                  <p>Level: {o.upgrade.current.level}</p>
                </div>
              </div>)
            }
          </div>
        </div>
      </Sub>
    </>
  )
}

export default List