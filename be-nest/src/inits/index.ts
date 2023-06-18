import { WorldSchema } from "modules/worlds/worlds.schema"
import { COLLECTION } from "enums"
import { Connection } from "mongoose"

export default async function init(connection : Connection) {
  const db = connection.useDb(global.Config.MONGODB_NAME)
  const Worlds = db.model(COLLECTION.worlds, WorldSchema)
  const worlds = await Worlds.find({})
  console.log(global.Config.MONGODB_NAME,connection.models);
  
  console.log(worlds)
}