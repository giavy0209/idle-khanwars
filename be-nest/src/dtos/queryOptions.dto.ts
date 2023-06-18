import { ApiProperty } from '@nestjs/swagger'

export class QueryOptionDto {
  @ApiProperty({ example: 1 })
  page?: number
  @ApiProperty({ example: 10 })
  limit?: number
  @ApiProperty({ example: ['name:asc'] })
  'sort[]'?: string[]
}
