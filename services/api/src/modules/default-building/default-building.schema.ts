/** @format */

import { Prop } from '@nestjs/mongoose';
import { AbstractSchema, NestSchema } from '@vypham0209/nestjs-common';
import { COLLECTION } from 'enum/collection.enum';
import { Schema, Types } from 'mongoose';
import { DEFAULT_BUILDING } from './default-building.enum';
@NestSchema({ softDelete: true })
export class DefaultBuilding extends AbstractSchema {
  static collectionName = COLLECTION.default_buildings;
  @Prop({ type: String })
  name: string;
  @Prop({ type: String })
  key: DEFAULT_BUILDING.KEY;
  @Prop({ type: String })
  description: string;
  @Prop({ type: String })
  type: DEFAULT_BUILDING.TYPE;
  @Prop({ type: String })
  path: string;
  @Prop({ type: String })
  generate: string;
  @Prop({ type: String })
  unit: string;
  @Prop({ type: Schema.Types.ObjectId, ref: COLLECTION.default_resources })
  resource: Types.ObjectId;
}
