import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DOMAIN } from "const";
import { useAppSelector } from "hooks";
import useCountDown from "hooks/useCountDown";
import { FC, memo, useState} from "react";
import { selectBuildingUpgradiing } from "store/selectors";
import renderDate from "utils/renderDate";

const Queue: FC = memo(() => {
  const [isClose, setIsClose] = useState(true)
  const buildingUpgrading = useAppSelector(selectBuildingUpgradiing)
  const cownDown = useCountDown(buildingUpgrading?.endAt || null)
  return (
    <>
      <div className={`queue ${isClose ? 'close' : ''}`}>
        <div className="top">
          <div className="title">Queue</div>
          <div onClick={() => setIsClose(!isClose)} className={`icon ${isClose ? 'close' : ''}`}>
            <FontAwesomeIcon icon={faChevronDown} />
          </div>
        </div>
        <div className="body">
          <div className="content">
            <div className="upgrading">
              <div className="title">Building Upgrading</div>
              {
                buildingUpgrading ?
                  <div className="info">
                    <div className="left">
                      <img src={`${DOMAIN}${buildingUpgrading.default.path}`} alt="" />
                    </div>
                    <div className="right">
                      <p>{buildingUpgrading.default.name}</p>
                      <p>
                        <span>Start at: </span>
                        <span>{renderDate({ date: buildingUpgrading.startAt })}</span>
                      </p>
                      <p>
                        <span>Finish at: </span>
                        <span>{renderDate({ date: buildingUpgrading.endAt })}</span>
                      </p>
                      <p>
                        <span>Timeleft: </span>
                        <span>{cownDown}</span>
                      </p>
                    </div>
                  </div>
                  :
                  <p>No building on upgrade</p>
              }
            </div>

          </div>
        </div>
      </div>
    </>
  )
})

export default Queue