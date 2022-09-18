import { Router } from 'express'
  //import abow
const Routers : any[] = [
  //add abow
]
const router = Router()

Routers.forEach(ClassRouter => {
  const construcRouter = new ClassRouter()
  construcRouter.regisRouter()
  router.use('/', construcRouter.router)
})

export default router