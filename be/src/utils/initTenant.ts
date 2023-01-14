import { IWorld } from "interfaces"
import workers from "workers"
import initDefault from "./initDefault"
import initModel from "./initModel"

export default async function initTenant(world: IWorld) {
  console.log('Start init models');

  initModel(world)
  await initDefault(world)
  workers(world)
}