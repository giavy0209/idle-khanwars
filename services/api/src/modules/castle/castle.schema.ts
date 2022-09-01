/** @format */

import { Prop } from '@nestjs/mongoose';
import { AbstractSchema, NestSchema } from '@vypham0209/nestjs-common';
import { COLLECTION } from 'enum/collection.enum';
import { Schema, Types } from 'mongoose';

@NestSchema({ softDelete: false, timestamps: false })
class Coordinate {
  @Prop({ type: Number })
  x: number;
  @Prop({ type: Number })
  y: number;
}

@NestSchema({ softDelete: true })
export class Castle extends AbstractSchema {
  static collectionName = COLLECTION.castles;
  static hook(schema: Schema<Castle>) {
    schema.virtual('resources', {
      localField: '_id',
      foreignField: 'castle',
      ref: COLLECTION.resources,
    });

    schema.virtual('buildings', {
      localField: '_id',
      foreignField: 'castle',
      ref: COLLECTION.buildings,
    });

    schema.virtual('units', {
      localField: '_id',
      foreignField: 'castle',
      ref: COLLECTION.units,
    });

    schema.virtual('trainings', {
      localField: '_id',
      foreignField: 'castle',
      ref: COLLECTION.trainings,
      options: {
        match: {
          deletedAt: { $exists: false },
        },
      },
    });
    schema.virtual('upgrades', {
      localField: '_id',
      foreignField: 'castle',
      ref: COLLECTION.upgrades,
      options: {
        match: {
          deletedAt: { $exists: false },
        },
      },
    });
  }

  @Prop({ type: Schema.Types.ObjectId, ref: COLLECTION.users })
  user: Types.ObjectId;

  @Prop({ type: Coordinate })
  coordinate: Coordinate;

  @Prop({ type: Boolean })
  isCapital: boolean;
}
