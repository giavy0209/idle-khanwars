import { BUILDING_TYPE, DOMAIN } from "const";
import { useAppSelector } from "hooks";
import { Sub } from "layers";
import { FC, useCallback } from "react";
import { useDispatch } from "react-redux";
import { selectBuildingByType } from "store/selectors";
import { buildingSlice, IBuilding } from "store/slices/building";

interface IList {
  type: keyof typeof BUILDING_TYPE
}

const List: FC<IList> = ({ type }) => {
  const dispatch = useDispatch()
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