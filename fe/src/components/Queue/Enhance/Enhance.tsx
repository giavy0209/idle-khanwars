import { DOMAIN } from "const";
import useCountDown from "hooks/useCountDown";
import { IEnhance } from "interfaces";
import { FC } from "react";
import renderDate from "utils/renderDate";

const Enhance: FC<{ enhance: IEnhance }> = ({ enhance }) => {
  const cownDown = useCountDown(enhance.endAt)
  return (
    <>
      <div key={enhance._id} className="training">
        <div className="info">
          <div className="left">
            <img src={`${DOMAIN}${enhance.unit.default.path}`} alt="" />
          </div>
          <div className="right">
            <p>{enhance.unit.default.name}</p>
            <p>Enhance {enhance.type}</p>
            <p>
              <span>Finish at: </span>
              <span>{renderDate({ date: enhance.endAt })}</span>
            </p>
            <p>
              <span>Timeleft: </span>
              <span>{cownDown}</span>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Enhance