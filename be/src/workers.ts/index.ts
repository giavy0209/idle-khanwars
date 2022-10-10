import { Worlds } from "models";
import ResourceWorker from "./ResourceWorker";

export default async function work() {
  const worlds = await new Worlds().getInstance().find({})

  
}