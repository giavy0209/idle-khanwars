import { IWorld } from "interfaces";
import initBuilding from "./initBuilding";
import initResource from "./initResource";
import initUnits from "./initUnits";
import initUnitType from "./initUnitType";

export default async function initDefault(world: IWorld) {
  await initResource(world)
  // console.log(`\x1b[34m ${world.name} \x1b[0m`, 'Init Resource');
  await initUnitType(world)
  // console.log(`\x1b[34m ${world.name} \x1b[0m`, 'Init Unit Type');
  await initBuilding(world)
  // console.log(`\x1b[34m ${world.name} \x1b[0m`, 'Init Building');
  await initUnits(world)
  // console.log(`\x1b[34m ${world.name} \x1b[0m`, 'Init Units');

}