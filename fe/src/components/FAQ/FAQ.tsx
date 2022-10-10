import { FC, ReactNode,useState } from "react";
import { faQuestion } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {Button} from "components";

interface IFAQ {
  children: ReactNode
}
const FAQ: FC<IFAQ> = ({ children }) => {
  const [IsShowFAQ , setIsShowFAQ] = useState(false)
  return (
    <>
      <div className="faq">
        <div onClick={() => setIsShowFAQ(!IsShowFAQ)} className="icon">
          <FontAwesomeIcon icon={faQuestion} />
        </div>
        <div className={`content ${IsShowFAQ ? 'show' : ''}`}>
          <div className="top">
            <Button type="button" onClick={() => setIsShowFAQ(!IsShowFAQ)} >Close</Button>
          </div>
          <div className="mid">
            <div className="text">
              {children}
            </div>
          </div>
          <div className="bottom"></div>
        </div>
      </div>
    </>
  )
}

export default FAQ