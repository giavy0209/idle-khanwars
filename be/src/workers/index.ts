import { IWorld } from "interfaces";
import ChangeResourceWorker from "./ChangeResourceWorker";
import ChangeUnitWorker from "./ChangeUnitWorker";
import GenerateResourceWorker from "./GenerateResourceWorker";
import HnadleEnhanceWorker from "./HandleEnhanceWorker";
import HandleTrainingWorker from "./HandleTrainingWorker";
import HandleUpgradeWorker from "./HandleUpgradeWorker";

export default async function workers(world: IWorld) {
  console.log(`Init worker for world ${world.tenant}`);

  new ChangeResourceWorker(world).startWorker()
  new GenerateResourceWorker(world).startWorker()
  new HandleUpgradeWorker(world).startWorker()
  new HandleTrainingWorker(world).startWorker()
  new ChangeUnitWorker(world).startWorker()
  new HnadleEnhanceWorker(world).startWorker()
}