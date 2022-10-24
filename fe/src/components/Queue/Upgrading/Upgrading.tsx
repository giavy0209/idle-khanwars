import { DOMAIN } from "const";
import useCountDown from "hooks/useCountDown";
import { IUpgrade } from "interfaces";
import { FC } from "react";
import renderDate from "utils/renderDate";

interface IUpgrading {
  upgrading: IUpgrade
}

const Upgrading: FC<IUpgrading> = ({ upgrading }) => {
  const cownDown = useCountDown(upgrading.endAt)
  return (
    <>
      <div className="info">
        <div className="left">
          <img src={`${DOMAIN}${upgrading.building.default.path}`} alt="" />
        </div>
        <div className="right">
          <p>{upgrading.building.default.name}</p>
          <p>
            <span>Start at: </span>
            <span>{renderDate({ date: upgrading.startAt })}</span>
          </p>
          <p>
            <span>Finish at: </span>
            <span>{renderDate({ date: upgrading.endAt })}</span>
          </p>
          <p>
            <span>Timeleft: </span>
            <span>{cownDown}</span>
          </p>
        </div>
      </div>
    </>
  )
}

export default Upgrading