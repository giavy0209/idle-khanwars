/** @format */

import { Prop } from '@nestjs/mongoose';
import { AbstractSchema, NestSchema } from '@vypham0209/nestjs-common';
import { COLLECTION } from 'enum/collection.enum';
import { DEFAULT_ENHANCE } from 'enum/default-enhance.enum';
import { Schema, Types } from 'mongoose';
import {
  ResourceCost,
  ResourceCostPullPopulate,
} from 'shared/resource/resource-cost.schema';

@NestSchema({ softDelete: true })
export class DefaultEnhance extends AbstractSchema {
  static collectionName = COLLECTION.default_enhances;
  @Prop({ type: Number })
  level: number;
  @Prop({ type: Schema.Types.ObjectId, ref: COLLECTION.default_units })
  unit: Types.ObjectId;
  @Prop({ type: Number })
  value: number;
  @Prop({ type: Number })
  time: number;
  @Prop({ type: String, enum: DEFAULT_ENHANCE.TYPES })
  type: DEFAULT_ENHANCE.TYPE;
  @Prop([{ type: ResourceCost }])
  resources: ResourceCost[];
}

export interface DefaultEnhancePullPopulate {
  resources: MergePopulate<ResourceCost, ResourceCostPullPopulate>[];
}
