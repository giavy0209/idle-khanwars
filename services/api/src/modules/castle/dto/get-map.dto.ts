import { IsNumber } from 'class-validator';

export class GetMapDto {
  @IsNumber()
  fromX: number;

  @IsNumber()
  toX: number;

  @IsNumber()
  fromY: number;

  @IsNumber()
  toY: number;
}
