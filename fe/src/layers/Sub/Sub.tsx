import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
interface ISub {
  children: ReactNode
}
const Sub: FC<ISub> = ({ children }) => {
  return (
    <>
      <div  className="pre">
        <FontAwesomeIcon icon={faChevronLeft} />
      </div>
      {children}
    </>
  )
}

export default Sub