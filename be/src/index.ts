import 'config'
import 'utils/connectDB'
import './socket'
import server from './server'

import { Worlds } from "models";
import fs from 'fs'
import path from 'path'
import { AbstractModel } from 'abstracts'
const models = fs.readdirSync(path.join(__dirname, 'models')).filter(o => (!o.includes('index') && !o.includes('map')))
new Worlds().getInstance().find()
  .then(async worlds => {
    worlds.forEach(({ tenant }) => {
      models.forEach(model => {
        const ModelClass = require(path.join(__dirname, 'models', model)) as new (tenant : string) => AbstractModel<any>
        new ModelClass(tenant).getInstance()
      })
    })
  })

export default server