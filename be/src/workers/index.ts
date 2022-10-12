import { Worlds } from "models";
import ChangeResourceWorker from "./ChangeResourceWorker";
import GenerateResourceWorker from "./GenerateResourceWorker";
import HandleUpgradeWorker from "./HandleUpgradeWorker";

export default async function workers() {
  const worlds = await new Worlds().getInstance().find({})
  worlds.forEach(world => {
    new ChangeResourceWorker(world).startWorker()

    new GenerateResourceWorker(world).startWorker()
    
    new HandleUpgradeWorker(world).startWorker()
  })
}