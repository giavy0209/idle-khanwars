import { DOMAIN } from "const";
import useCountDown from "hooks/useCountDown";
import { ITraining } from "interfaces";
import { FC } from "react";
import renderDate from "utils/renderDate";

const Training: FC<{ training: ITraining }> = ({ training }) => {
  const cownDown = useCountDown(training.endAt)
  const nextAt = useCountDown(training.nextAt)
  return (
    <>
      <div key={training._id} className="training">
        <div className="info">
          <div className="left">
            <img src={`${DOMAIN}${training.unit.default.path}`} alt="" />
          </div>
          <div className="right">
            <p>{training.unit.default.name}</p>
            <p>
              <span>Total: </span>
              <span>{training.trained}/{training.total}</span>
            </p>
            <p>
              <span>Finish at: </span>
              <span>{renderDate({ date: training.endAt })}</span>
            </p>
            <p>
              <span>Next: </span>
              <span>{nextAt}</span>
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

export default Training