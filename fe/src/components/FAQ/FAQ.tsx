import { FC, ReactNode, useState } from "react";
import { faQuestion } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ScrollBackground } from "components";

interface IFAQ {
  children: ReactNode
}
const FAQ: FC<IFAQ> = ({ children }) => {
  const [IsShowFAQ, setIsShowFAQ] = useState(false)
  return (
    <>
      <div className="faq">
        <div onClick={() => setIsShowFAQ(!IsShowFAQ)} className="icon">
          <FontAwesomeIcon icon={faQuestion} />
        </div>
        <ScrollBackground isShow={IsShowFAQ} setIsShow={setIsShowFAQ}>
          {children}
        </ScrollBackground>
      </div>
    </>
  )
}

export default FAQ