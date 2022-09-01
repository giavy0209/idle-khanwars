/** @format */

import { Prop } from '@nestjs/mongoose';
import { AbstractSchema, NestSchema } from '@vypham0209/nestjs-common';
import { COLLECTION } from 'enum/collection.enum';
import { BuildingPopulate } from 'modules/building/building.schema';
import { DefaultResource } from 'modules/default-resource/default-resource.schema';
import { Schema, Types } from 'mongoose';

@NestSchema({ softDelete: true })
export class Resource extends AbstractSchema {
  static collectionName = COLLECTION.resources;

  @Prop({ type: Schema.Types.ObjectId, ref: COLLECTION.castles })
  castle: Types.ObjectId;
  @Prop({ type: Schema.Types.ObjectId, ref: COLLECTION.default_resources })
  default: Types.ObjectId;
  @Prop({ type: Schema.Types.ObjectId, ref: COLLECTION.buildings })
  building: Types.ObjectId;
  @Prop({ type: Number, default: 100 })
  value: number;
}

export interface ResourcePullPopulate {
  default: DefaultResource;
  building: BuildingPopulate;
}

export type ResourcePopulate = MergePopulate<Resource, ResourcePullPopulate>;
