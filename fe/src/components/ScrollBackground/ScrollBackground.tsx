import { Dispatch, FC, memo, ReactNode, useCallback } from "react";
import { Button } from "components";

interface IFAQ {
  isShow?: boolean
  setIsShow?: Dispatch<React.SetStateAction<boolean>>
  onClose?(): any
  children: ReactNode
}
const ScrollBackground: FC<IFAQ> = ({ children, isShow = false, setIsShow, onClose }) => {
  const handleClose = useCallback(() => {
    setIsShow?.(!isShow)
    onClose?.()
  }, [setIsShow, onClose, isShow])
  return (
    <>
      <div className="scroll-background">
        <div className={`content ${isShow ? 'show' : ''}`}>
          <div className="top">
            <Button type="button" onClick={handleClose} >Close</Button>
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

export default memo(ScrollBackground)