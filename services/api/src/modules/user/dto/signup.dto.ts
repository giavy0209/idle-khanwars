import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, MaxLength, MinLength } from 'class-validator';

export class SignupDto {
  @ApiProperty({ default: 'username1' })
  @MinLength(4)
  @MaxLength(12)
  username: string;

  @MinLength(6)
  @MaxLength(12)
  password: string;

  @IsMongoId()
  world: string;
}
