import { PartialType } from '@nestjs/swagger'
import { QueryOptionDto } from 'dtos'

export class QueryUserDto extends PartialType(QueryOptionDto) {
  email?: string
}
