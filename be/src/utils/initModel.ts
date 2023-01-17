import { IWorld } from "interfaces";
import fs from 'fs'
import path from 'path'
import { AbstractModel } from "abstracts";

const models = fs.readdirSync(path.join(__dirname, '..', 'models')).filter(o => (!o.includes('index') && !o.includes('map')))

export default function initModel(world: IWorld) {
  console.log(`\x1b[34m ${world.name} \x1b[0m`, `Init model`);

  models.forEach(model => {
    const ModelClass = require(path.join(__dirname, '..', 'models', model)).default as new (tenant: string) => AbstractModel<any>
    new ModelClass(world.tenant).getInstance()
  })
}