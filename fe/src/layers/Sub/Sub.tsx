import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC, memo, ReactNode, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
interface ISub {
  children: ReactNode
}
const Sub: FC<ISub> = memo(({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const goBack = useCallback(() => {
    let currentPath = location.pathname
    const index = currentPath.lastIndexOf('/')

    if (index + 1 === currentPath.length) {
      currentPath = currentPath.substring(0, index)
      const nextIndex = currentPath.lastIndexOf('/')
      navigate(currentPath.substring(0, nextIndex + 1))
    } else {
      navigate(currentPath.substring(0, index + 1))
    }
  }, [location, navigate])
  return (
    <>
      <div onClick={goBack} className="pre">
        <FontAwesomeIcon icon={faChevronLeft} />
      </div>
      <div className="sub-layout">
        {children}
      </div>
    </>
  )
})

export default Sub