/** @format */

import { Prop } from '@nestjs/mongoose';
import { AbstractSchema, NestSchema } from '@vypham0209/nestjs-common';
import { COLLECTION } from 'enum/collection.enum';
import { HydratedDocument, Schema, Types } from 'mongoose';

@NestSchema({ softDelete: true })
export class Training extends AbstractSchema {
  static collectionName = COLLECTION.trainings;
  @Prop({ type: Schema.Types.ObjectId, ref: COLLECTION.units })
  unit: Types.ObjectId;
  @Prop({ type: Schema.Types.ObjectId, ref: COLLECTION.castles })
  castle: Types.ObjectId;
  @Prop({ type: Number })
  total: number;
  @Prop({ type: Number })
  left: number;
  @Prop({ type: Date })
  nextAt: Date;
  @Prop({ type: Date })
  endAt: Date;
}

export type TrainingDocument = HydratedDocument<Training>;
