import { IsNumber } from 'class-validator';

export class PlaceCastleDto {
  @IsNumber()
  x: number;
  @IsNumber()
  y: number;
}
