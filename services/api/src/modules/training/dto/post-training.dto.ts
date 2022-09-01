import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, Min } from 'class-validator';

export class PostTrainingDto {
  @ApiProperty()
  @IsMongoId()
  unit: string;
  @ApiProperty()
  @Min(1)
  total: number;
}
