/** @format */

import { Prop } from '@nestjs/mongoose';
import { NestSchema } from '@vypham0209/nestjs-common';
import { COLLECTION } from 'enum/collection.enum';
import { DefaultUnitType } from 'modules/default-unit-type/default-unit-type.schema';
import { Schema, Types } from 'mongoose';

@NestSchema({ softDelete: false, timestamps: false })
export class Strength {
  @Prop({ type: Schema.Types.ObjectId, ref: COLLECTION.default_unit_types })
  type: Types.ObjectId;
  @Prop({ type: Number })
  value: number;
}

export interface StrengthPullPopulate {
  type: DefaultUnitType;
}
export type StrengthPopulate = MergePopulate<Strength, StrengthPullPopulate>;
