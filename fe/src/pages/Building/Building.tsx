import { BUILDING_TYPE, ROUTERS } from "const";
import { Sub } from "layers";
import { FC, memo } from "react";
import { Link, useParams } from "react-router-dom";
import List from "./List";

const Building: FC = memo(() => {
  const { buildingType } = useParams()
  if (buildingType) {
    return <List type={buildingType as keyof typeof BUILDING_TYPE} />
  } else {
    return (
      <Sub>
        <div className="building">
          <div className="navigation">
            <Link to={ROUTERS.RESOURCE}>
              <div className="link">RESOURCE</div>
            </Link>
            <Link to={ROUTERS.ARMY}>
              <div className="link">ARMY</div>
            </Link>
            <Link to={ROUTERS.BUILDING_ARMY}>
              <div className="link">CASTLE</div>
            </Link>
            <Link to={ROUTERS.OTHER}>
              <div className="link">OTHER</div>
            </Link>
          </div>
        </div>
      </Sub>
    )
  }
})

export default Building