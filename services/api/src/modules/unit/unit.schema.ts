/** @format */

import { Prop } from '@nestjs/mongoose';
import { AbstractSchema, NestSchema } from '@vypham0209/nestjs-common';
import { COLLECTION } from 'enum/collection.enum';
import { BuildingLevelPopulate } from 'modules/building/building.schema';
import {
  DefaultUnit,
  DefaultUnitPopulate,
} from 'modules/default-unit/default-unit.schema';
import { Schema, Types } from 'mongoose';

@NestSchema({ softDelete: false, timestamps: false })
class EnhanceDetail {
  @Prop({ type: Schema.Types.ObjectId, ref: COLLECTION.default_enhances })
  attack: Types.ObjectId;

  @Prop({ type: Schema.Types.ObjectId, ref: COLLECTION.default_enhances })
  hp: Types.ObjectId;

  @Prop({ type: Schema.Types.ObjectId, ref: COLLECTION.default_enhances })
  cargo: Types.ObjectId;
}

@NestSchema({ softDelete: false, timestamps: false })
class Enhance {
  @Prop({ type: EnhanceDetail, default: {} })
  current: EnhanceDetail;
  @Prop({ type: EnhanceDetail, default: {} })
  next: EnhanceDetail;
}

@NestSchema({ softDelete: true })
export class Unit extends AbstractSchema {
  static collectionName = COLLECTION.units;
  @Prop({ type: Schema.Types.ObjectId, ref: COLLECTION.castles })
  castle: Types.ObjectId;
  @Prop({ type: Schema.Types.ObjectId, ref: COLLECTION.buildings })
  building: Types.ObjectId;
  @Prop({ type: Schema.Types.ObjectId, ref: COLLECTION.default_units })
  default: Types.ObjectId;
  @Prop({ type: Number, default: 0 })
  total: number;
  @Prop({ type: Number, default: 0 })
  inTower: number;

  @Prop({ type: Enhance, default: {} })
  enhance: Enhance;
}

export interface UnitSimplePullPopulate {
  default: DefaultUnit;
  building: BuildingLevelPopulate;
}
export interface UnitPullPopulate {
  default: DefaultUnitPopulate;
}

export type UnitPopulate = MergePopulate<Unit, UnitPullPopulate>;
