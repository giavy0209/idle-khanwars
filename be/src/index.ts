import 'config'
import 'utils/connectDB'
import init from 'utils/initDefault'
import './socket'
import server from './server'
import fs from 'fs'
import path from 'path'
import { Worlds } from "models";
import { AbstractModel } from 'abstracts'
init()
const models = fs.readdirSync(path.join(__dirname, 'models')).filter(o => (!o.includes('index') && !o.includes('map')))

new Worlds().getInstance().find().lean()
  .then(async worlds => {
    worlds.forEach((world) => {
      models.forEach(model => {
        const ModelClass = require(path.join(__dirname, 'models', model)).default as new (tenant : string) => AbstractModel<any>
        new ModelClass(world.tenant).getInstance()
      })
    })
  })

export default server