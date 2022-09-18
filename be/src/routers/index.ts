import { Router } from 'express'
import fs from 'fs'
import path from 'path'

const router = Router()

fs.readdirSync(__dirname)
  .filter(o => (!o.includes('index') && !o.includes('map')))
  .forEach(o => {
    const ClassRouter = require(path.join(__dirname, o))
    const construcRouter = new ClassRouter()
    construcRouter.regisRouter()
    router.use(`/${o.toLowerCase()}`, construcRouter.router)
  })

export default router