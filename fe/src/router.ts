import { ROUTERS } from "const"
import { Building, Enhance, Home, Map, Signup, Units } from "pages"

const Routers = [
  {
    path: ROUTERS.LOGIN,
    element: Signup
  },
  {
    path: ROUTERS.MAP,
    element: Map
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
  {
    path: ROUTERS.ENHANCE,
    element: Enhance,
    children: [
      {
        path: ROUTERS.ENHANCE_TYPE,
        element: Enhance
      }
    ]
  },
]
export default Routers