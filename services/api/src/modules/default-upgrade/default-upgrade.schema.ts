/** @format */

import { Prop } from '@nestjs/mongoose';
import { AbstractSchema, NestSchema } from '@vypham0209/nestjs-common';
import { COLLECTION } from 'enum/collection.enum';
import { Schema, Types } from 'mongoose';
import {
  ResourceCost,
  ResourceCostPopulate,
} from 'shared/resource/resource-cost.schema';

@NestSchema({ softDelete: true })
export class DefaultUpgrade extends AbstractSchema {
  static collectionName = COLLECTION.default_upgrades;
  @Prop({ type: Schema.Types.ObjectId, ref: COLLECTION.default_buildings })
  building: Types.ObjectId;
  @Prop({ type: Number, default: 0 })
  level: number;
  @Prop({ type: Number, default: 0 })
  generate: number;
  @Prop({ type: Number, default: 1 })
  time: number;

  @Prop([{ type: ResourceCost }])
  resources: ResourceCost[];
}

export interface DefaultUpgradePullPopulate {
  resources: ResourceCostPopulate;
}

export type DefaultUpgradePopulate = MergePopulate<
  DefaultUpgrade,
  DefaultUpgradePullPopulate
>;
