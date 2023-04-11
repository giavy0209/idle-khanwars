import { MODEL } from "constant";
import { Schema, SchemaDefinition } from "mongoose";

export const EnhanceDefination: SchemaDefinition = {
  hp: { type: Schema.Types.ObjectId, ref: MODEL.default_enhances },
  cargo: { type: Schema.Types.ObjectId, ref: MODEL.default_enhances },
  attack: { type: Schema.Types.ObjectId, ref: MODEL.default_enhances },
}