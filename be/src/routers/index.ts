import { Router } from 'express'
import fs from 'fs'
import path from 'path'

const router = Router()

fs.readdirSync(__dirname)
  .filter(o => (!o.includes('index') && !o.includes('map')))
  .forEach(o => {
    const routes = require(path.join(__dirname, o)).default
    router.use(`/${o.toLowerCase()}`, routes)
  })

export default router