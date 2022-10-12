import { ROUTERS } from "const"
import { Building, Home, Signup } from "pages"

const Routers = [
  {
    path: ROUTERS.LOGIN,
    element: Signup
  },
  {
    path: ROUTERS.HOME,
    element: Home
  },
  {
    path: ROUTERS.BUILDING,
    element : Building
  },
]
export default Routers