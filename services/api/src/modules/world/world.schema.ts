/** @format */

import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import {
  AbstractSchema,
  NestSchema,
  TransformTrimString,
} from '@vypham0209/nestjs-common';
import { IsNotEmpty, IsPositive, IsString } from 'class-validator';

@NestSchema({ softDelete: true })
export class World extends AbstractSchema {
  static collectionName = 'worlds';
  static master = true;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @TransformTrimString
  @Prop({ type: String })
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Prop({ type: String })
  tenant: string;

  @ApiProperty()
  @IsPositive()
  @Prop({ type: Number, default: 1 })
  speed: number;
}
