import { IWorld } from "interfaces";
import ChangeResourceWorker from "./ChangeResourceWorker";
import ChangeUnitWorker from "./ChangeUnitWorker";
import GenerateResourceWorker from "./GenerateResourceWorker";
import HnadleEnhanceWorker from "./HandleEnhanceWorker";
import HandleMarchingWorker from "./HandleMarchingWorker";
import HandleTrainingWorker from "./HandleTrainingWorker";
import HandleUpgradeWorker from "./HandleUpgradeWorker";

export default async function workers(world: IWorld) {
  console.log(`\x1b[34m ${world.name} \x1b[0m`, `Init worker`);
  new ChangeResourceWorker(world).startWorker()
  new GenerateResourceWorker(world).startWorker()
  new HandleUpgradeWorker(world).startWorker()
  new HandleTrainingWorker(world).startWorker()
  new ChangeUnitWorker(world).startWorker()
  new HnadleEnhanceWorker(world).startWorker()
  new HandleMarchingWorker(world).startWorker()
}