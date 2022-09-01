/** @format */

import { Prop } from '@nestjs/mongoose';
import { NestSchema } from '@vypham0209/nestjs-common';
import { COLLECTION } from 'enum/collection.enum';
import { DefaultResource } from 'modules/default-resource/default-resource.schema';
import { Schema, Types } from 'mongoose';

@NestSchema({ softDelete: false, timestamps: false })
export class ResourceCost {
  @Prop({ type: Schema.Types.ObjectId, ref: COLLECTION.default_resources })
  type: Types.ObjectId;
  @Prop({ type: Number })
  value: number;
}

export interface ResourceCostPullPopulate {
  type: DefaultResource;
}

export type ResourceCostPopulate = MergePopulate<
  ResourceCost,
  ResourceCostPullPopulate
>;
