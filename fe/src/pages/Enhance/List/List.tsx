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
  const handleEnhance = (unit: IUnit) => {
    dispatch(unitAction.training(unit))
  }
  return (
    <>
      <Sub>
        <div className="building">
          <div className="list">
            {
              units.map(o => <div onClick={() => handleEnhance(o)} key={o._id} className="item">
                <div className="contain">
                  <img src={`${DOMAIN}${o.default.path}`} alt="" />
                  <p>{o.default.name}</p>
                  <span>Enhance HP : {o.enhance.current.hp.level}</span>
                  <span>Enhance Attack : {o.enhance.current.attack.level}</span>
                  <span>Enhance Cargo : {o.enhance.current.cargo.level}</span>
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