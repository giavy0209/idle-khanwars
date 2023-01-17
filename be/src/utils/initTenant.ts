import { IWorld } from "interfaces"
import workers from "workers"
import initDefault from "./initDefault"
import initModel from "./initModel"

export default async function initTenant(world: IWorld) {
  console.log(`\x1b[34m ${world.name} \x1b[0m`, 'Start init models');
  const startModel = Date.now()
  initModel(world)
  const endModel = Date.now()
  console.log(`\x1b[34m ${world.name} \x1b[0m`, `End init models, take : \x1b[32m${endModel - startModel}ms `,);

  console.log(`\x1b[34m ${world.name} \x1b[0m`, 'Start init default',);
  const startInit = Date.now()
  await initDefault(world)
  const endInit = Date.now()
  console.log(`\x1b[34m ${world.name} \x1b[0m`, `DONE INIT DEFAULT, take : \x1b[32m${endInit - startInit}ms`)

  workers(world)
}