import { Worlds } from "models";
import initTenant from "./initTenant";

export default async function initServer() {
  const worlds = await new Worlds().getInstance().find()
  for (const world of worlds) {
    initTenant(world)
  }
}