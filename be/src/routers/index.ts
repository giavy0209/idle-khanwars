import { Router } from 'express'
import UserRouter from './UserRouter'
  //import abow
const Routers = [
  UserRouter,
  //add abow
]
const router = Router()

Routers.forEach(ClassRouter => {
  const construcRouter = new ClassRouter()
  construcRouter.regisRouter()
  router.use('/', construcRouter.router)
})

export default router