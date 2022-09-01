/** @format */

import { Prop } from '@nestjs/mongoose';
import { AbstractSchema, NestSchema } from '@vypham0209/nestjs-common';
import { COLLECTION } from 'enum/collection.enum';
import { DefaultUnitType } from 'modules/default-unit-type/default-unit-type.schema';
import { Schema, Types } from 'mongoose';
import {
  ResourceCost,
  ResourceCostPopulate,
} from 'shared/resource/resource-cost.schema';
import { Strength, StrengthPopulate } from 'shared/strength/strength.schema';

@NestSchema({ softDelete: true })
export class DefaultUnit extends AbstractSchema {
  static collectionName = COLLECTION.default_units;
  @Prop({ type: String })
  name: string;
  @Prop({ type: String })
  key: string;
  @Prop({ type: Number })
  order: number;
  @Prop({ type: String })
  description: string;
  @Prop({ type: String })
  path: string;
  @Prop({ type: Schema.Types.ObjectId, ref: COLLECTION.default_unit_types })
  type: Types.ObjectId;
  @Prop({ type: Schema.Types.ObjectId, ref: COLLECTION.default_buildings })
  building: Types.ObjectId;
  @Prop({ type: Number, default: 1 })
  time: number;
  @Prop({ type: Number })
  speed: number;
  @Prop({ type: Number })
  cargo: number;
  @Prop({ type: Number })
  life: number;
  @Prop({ type: Number })
  range: number;
  @Prop({ type: Number })
  population: number;
  @Prop([{ type: ResourceCost }])
  resources: ResourceCost[];

  @Prop([{ type: Strength }])
  strength: Strength[];
}

export interface DefaultUnitPullPopulate {
  type: DefaultUnitType;
  resources: ResourceCostPopulate[];
  strength: StrengthPopulate[];
}

export type DefaultUnitPopulate = MergePopulate<
  DefaultUnit,
  DefaultUnitPullPopulate
>;
