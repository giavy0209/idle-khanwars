import { ApiProperty, OmitType } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import { User } from '../user.schema'
export class CreateUserDto extends OmitType(User, []) {
  @ApiProperty({ example: '_iac3p' })
  @IsString({ message: 'tenant must be provide' })
  tenant: string
}
