import { DOMAIN, TRAINING_TYPE } from "const";
import { useAppDispatch, useAppSelector } from "hooks";
import { IUnit } from "interfaces";
import { Sub } from "layers";
import { FC } from "react";
import { unitAction } from "store/slices";

interface IList {
  type: keyof typeof TRAINING_TYPE
}

const List: FC<IList> = ({ type }) => {
  const dispatch = useAppDispatch()

  const handleTraining = (unit: IUnit) => {
    dispatch(unitAction.training(unit))
  }
  return (
    <>
      <Sub>
        <div className="building">
          <div className="list">
            {
            }
          </div>
        </div>
      </Sub>
    </>
  )
}

export default List