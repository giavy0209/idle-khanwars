import { Worlds } from "models";
import { connection } from "mongoose";
import initTenant from "./initTenant";

export default async function initServer() {
  DB[getDbName()] = connection.useDb(getDbName())
  const worlds = await new Worlds().getInstance().find()
  for (const world of worlds) {
    DB[getDbName(world.tenant)] = connection.useDb(getDbName(world.tenant))
    initTenant(world)
  }
}