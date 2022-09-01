/** @format */

import { Prop } from '@nestjs/mongoose';
import { AbstractSchema, NestSchema } from '@vypham0209/nestjs-common';
import { COLLECTION } from 'enum/collection.enum';
import { HydratedDocument, Schema, Types } from 'mongoose';

@NestSchema({ softDelete: true })
export class Upgrade extends AbstractSchema {
  static collectionName = COLLECTION.upgrades;
  @Prop({ type: Schema.Types.ObjectId })
  castle: Types.ObjectId;

  @Prop({ type: Schema.Types.ObjectId, ref: COLLECTION.buildings })
  building: Types.ObjectId;

  @Prop({ type: Date })
  endAt: Date;
}

export type UpgradeDocument = HydratedDocument<Upgrade>;
