/** @format */

import { Prop } from '@nestjs/mongoose';
import { AbstractSchema, NestSchema } from '@vypham0209/nestjs-common';
import { COLLECTION } from 'enum/collection.enum';
import { DefaultBuilding } from 'modules/default-building/default-building.schema';
import {
  DefaultUpgrade,
  DefaultUpgradePopulate,
} from 'modules/default-upgrade/default-upgrade.schema';
import { Schema, Types } from 'mongoose';

@NestSchema({ softDelete: false, timestamps: false })
class Upgrade {
  @Prop({ type: Schema.Types.ObjectId, ref: COLLECTION.default_upgrades })
  current: Types.ObjectId;
  @Prop({ type: Schema.Types.ObjectId, ref: COLLECTION.default_upgrades })
  next: Types.ObjectId;
}

@NestSchema({ softDelete: true })
export class Building extends AbstractSchema {
  static collectionName = COLLECTION.buildings;
  @Prop({ type: Schema.Types.ObjectId, ref: COLLECTION.castles })
  castle: Types.ObjectId;
  @Prop({ type: Schema.Types.ObjectId, ref: COLLECTION.default_buildings })
  default: Types.ObjectId;
  @Prop({ type: Upgrade })
  upgrade: Upgrade;
}

export interface BuildingPullPopulate {
  default: DefaultBuilding;
  upgrade: {
    current: DefaultUpgradePopulate;
    next: DefaultUpgradePopulate;
  };
}

export type BuildingPopulate = MergePopulate<Building, BuildingPullPopulate>;

export interface BuildingLevelPullPopulate {
  upgrade: {
    current: DefaultUpgrade;
  };
}

export type BuildingLevelPopulate = MergePopulate<
  Building,
  BuildingLevelPullPopulate
>;

export interface BuildingUpgradePullPopulate {
  default: DefaultBuilding;
  upgrade: {
    next: DefaultUpgrade;
  };
}
