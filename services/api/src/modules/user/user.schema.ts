/** @format */

import { Prop } from '@nestjs/mongoose';
import { AbstractSchema, NestSchema } from '@vypham0209/nestjs-common';
import { COLLECTION } from 'enum/collection.enum';
import { Castle } from 'modules/castle/castle.schema';
import { Clan } from 'modules/clan/clan.schema';
import { Schema, Types } from 'mongoose';
@NestSchema({ softDelete: true })
export class User extends AbstractSchema {
  static collectionName = COLLECTION.users;
  static hook(schema: Schema<User>) {
    schema.clearIndexes();
    // schema.index({ username: 1, deletedAt: 1 }, { unique: true })
    schema.virtual('castles', {
      foreignField: 'user',
      localField: '_id',
      ref: COLLECTION.castles,
    });
  }
  @Prop({ type: String })
  email: string;

  @Prop({ type: String })
  username: string;

  @Prop()
  password: string;

  @Prop({ type: Schema.Types.ObjectId, ref: COLLECTION.clans })
  clan: Types.ObjectId;

  @Prop({ type: Boolean, default: false })
  isPlaceCastle: boolean;
}

export interface UserPullPopulateCastle {
  castles: Castle[];
}

export interface UserPullPopulate extends UserPullPopulateCastle {
  clan: Clan;
}

export type UserFullyPopulate = MergePopulate<User, UserPullPopulate>;
