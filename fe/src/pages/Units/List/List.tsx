import { DOMAIN, TRAINING_TYPE } from "const";
import { useAppDispatch, useAppSelector } from "hooks";
import { IUnit } from "interfaces";
import { Sub } from "layers";
import { FC } from "react";
import { selectUnitByBuilding } from "store/selectors";
import { unitAction } from "store/slices";

interface IList {
  type: keyof typeof TRAINING_TYPE
}

const List: FC<IList> = ({ type }) => {
  const dispatch = useAppDispatch()

  const units = useAppSelector(selectUnitByBuilding(type))
  const handleTraining = (unit: IUnit) => {
    dispatch(unitAction.training(unit))
  }
  return (
    <>
      <Sub>
        <div className="building">
          <div className="list">
            {
              units.map(o => <div onClick={() => handleTraining(o)} key={o._id} className="item">
                <div className="contain">
                  <img src={`${DOMAIN}${o.default.path}`} alt="" />
                  <p>{o.default.name}</p>
                  <p>Defense : {o.total}</p>
                  <p>Intower : {o.inTower}</p>
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