import { BUILDING_TYPE, TRAINING_TYPE } from "const";
import { useAppSelector } from "hooks";
import { Sub } from "layers";
import { FC } from "react";
import { Link, useParams } from "react-router-dom";
import { selectBuildingByType } from "store/selectors";
import List from "./List";

const Enhance: FC = () => {
  const { enhanceType } = useParams()
  const armyBuildings = useAppSelector(selectBuildingByType(BUILDING_TYPE.army))

  if (enhanceType) {
    return <List type={enhanceType as TRAINING_TYPE} />
  } else {
    return (
      <>
        <Sub>
          <div className="unit">
            <div className="navigation">
              {
                armyBuildings.map(o =>
                  <Link key={o._id} to={o.default.key}>
                    <div className="link">{o.default.name}</div>
                  </Link>
                )
              }
            </div>
          </div>
        </Sub>
      </>
    )
  }
}

export default Enhance