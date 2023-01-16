import { DOMAIN } from "const";
import { useAppSelector } from "hooks";
import { IDefaultResource } from "interfaces";
import { FC } from "react";
import { selectResource } from "store/selectors";
interface ICosts {
  resources?: {
    type: IDefaultResource
    value: number
    _id: string
  }[]
}
const Costs: FC<ICosts> = ({ resources }) => {
  const resource = useAppSelector(selectResource)
  if (resources) {
    return <>
      {
        resources.map(o => {
          const currentResouce = resource[o.type.key as keyof typeof resource]
          const resourceLeft = currentResouce - o.value
          return <div key={o._id} className="cost training">
            <div className="image">
              <img src={`${DOMAIN}${o.type.path}`} alt="" />
            </div>
            <div className="value">
              <span>{o.value}</span>
              <span className={`left ${resourceLeft >= 0 ? 'green' : 'red'}`}>{resourceLeft}</span>
            </div>
          </div>
        })
      }
    </>
  } else {
    return <></>
  }
}

export default Costs