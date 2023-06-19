import { PartialType } from "@nestjs/swagger"
import { QueryOptionDto } from "dtos"

export class queryWorldDto extends PartialType(QueryOptionDto) {
  search? : string
}
