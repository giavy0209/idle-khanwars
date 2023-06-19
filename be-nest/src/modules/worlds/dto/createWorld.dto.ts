import { OmitType } from "@nestjs/swagger"
import { World } from "../worlds.schema"

export class CreateWorldDto extends OmitType(World, ['status']) {}
