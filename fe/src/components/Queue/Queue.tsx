import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAppSelector } from "hooks";
import { FC, memo, useState } from "react";
import { selectEnhance, selectTrainings, selectUpgrading } from "store/selectors";
import { selectMarching } from "store/selectors";
import Enhance from "./Enhance";
import Marching from "./Marching";
import Training from "./Training";
import Upgrading from "./Upgrading";

const Queue: FC = memo(() => {
  const [isClose, setIsClose] = useState(true)
  const unitTrainings = useAppSelector(selectTrainings)
  const buildingUpgradings = useAppSelector(selectUpgrading)
  const enhance = useAppSelector(selectEnhance)
  const marchings = useAppSelector(selectMarching)

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
            {buildingUpgradings.length > 0 && <div className="upgrading">
              <div className="title">Building Upgrading</div>
              {
                buildingUpgradings.map(o => <Upgrading key={o._id} upgrading={o} />)
              }
            </div>}
            {unitTrainings.length > 0 && <div className="trainings">
              <div className="title">Trainings</div>
              {
                unitTrainings.map(o => <Training key={o._id} training={o} />)
              }
            </div>}
            {enhance.length > 0 && <div className="trainings">
              <div className="title">Enhance</div>
              {
                enhance.map(o => <Enhance key={o._id} enhance={o} />)
              }
            </div>}
            {
              marchings.length > 0 && <div className="marchings">
                <div className="title">Marchings</div>
                {
                  marchings.map(o => <Marching key={o._id} marching={o} />)
                }
              </div>
            }
          </div>
        </div>
      </div>
    </>
  )
})

export default Queue