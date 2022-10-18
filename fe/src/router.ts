import { ROUTERS } from "const"
import { Building, Home, Signup, Units } from "pages"

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
    element: Building,
    children: [
      {
        path: ROUTERS.BUILDING_TYPE,
        element: Building
      }
    ]
  },
  {
    path: ROUTERS.UNIT,
    element: Units,
    children: [
      {
        path: ROUTERS.UNIT_TYPE,
        element: Units
      }
    ]
  },
]
export default Routers