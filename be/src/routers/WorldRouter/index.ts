import fs from 'fs'
import path from 'path'
import Router from 'express-promise-router'
const router = Router()

fs.readdirSync(path.join(__dirname))
  .filter(o => (!o.includes('index') && !o.includes('map')))
  .forEach(o => {
    const ClassRouter = require(path.join(__dirname, o)).default
    const route = new ClassRouter().router
    router.use(`/`, route)
  })

export default router