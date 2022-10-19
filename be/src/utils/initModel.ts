import { IWorld } from "interfaces";
import fs from 'fs'
import path from 'path'
import { AbstractModel } from "abstracts";

const models = fs.readdirSync(path.join(__dirname, '..', 'models')).filter(o => (!o.includes('index') && !o.includes('map')))

export default function initModel(world: IWorld) {
  console.log(`Init model for world ${world.tenant}`);

  models.forEach(model => {
    const ModelClass = require(path.join(__dirname, '..', 'models', model)).default as new (tenant: string) => AbstractModel<any>
    new ModelClass(world.tenant).getInstance()
  })
}