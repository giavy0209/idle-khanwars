import { IWorld } from "interfaces";
import initBuilding from "./initBuilding";
import initResource from "./initResource";
import initUnits from "./initUnits";
import initUnitType from "./initUnitType";

export default async function initDefault(world: IWorld) {
  console.log('Start init world ' + world.name);
  await initResource(world)
  console.log('Init Resource');
  await initUnitType(world)
  console.log('Init Unit Type');
  await initBuilding(world)
  console.log('Init Building');
  await initUnits(world)
  console.log('Init Units');
  console.log('DONE INIT WORLD ' + world.name);
}