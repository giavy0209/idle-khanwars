import { Button } from "components";
import { DOMAIN } from "const";
import { useAppSelector } from "hooks";
import { Sub } from "layers";
import { FC, memo } from "react";
import { selectUnits } from "store/selectors";

const Tower: FC = () => {
  const units = useAppSelector(selectUnits)
  console.log(units);

  return (
    <Sub>
      <div className="tower">
        {
          units.map(unit => <div className="unit">
            <div className="top">

              <div className="image">
                <img src={DOMAIN + unit.default.path} alt="" />
              </div>
              <div className="info">
                <p className="name">{unit.default.name}</p>
                <p>
                  <span>Defense:</span>
                  <span>{unit.total}</span>
                </p>
                <p>
                  <span>Tower:</span>
                  <span>{unit.inTower}</span>
                </p>
                <p>
                  <span>Population:</span>
                  <span>{unit.default.population}</span>
                </p>
              </div>
              <div className="select">
                <div className="input">
                  <p>
                    <span>Move out</span>
                    <span className="max">Max</span>
                  </p>
                  <input type="number" value={0} />
                </div>
                <div className="input">
                  <p>
                    <span>Move out</span>
                    <span className="max">Max</span>
                  </p>
                  <input type="number" value={0} />
                </div>

              </div>
            </div>
            <div className="action">
              <Button>Move</Button>
            </div>
          </div>)
        }
      </div>
    </Sub>
  )
}

export default memo(Tower)