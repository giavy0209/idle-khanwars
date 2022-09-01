/** @format */

import { Prop } from '@nestjs/mongoose';
import { AbstractSchema, NestSchema } from '@vypham0209/nestjs-common';
import { IsOptional, IsString, Length } from 'class-validator';
import { COLLECTION } from 'enum/collection.enum';
import { Schema, Types } from 'mongoose';
import { CLAN } from './clan.enum';

@NestSchema({ softDelete: true })
export class Clan extends AbstractSchema {
  static collectionName = COLLECTION.clans;
  static hook(schema: Schema<Clan>) {
    schema.virtual('isRequest', {
      localField: '_id',
      foreignField: 'clan',
      justOne: true,
      ref: COLLECTION.clan_requests,
      count: true,
      options: {
        match: {
          deletedAt: { $exists: false },
          status: CLAN.REQUEST.APPROVAL.PENDING,
        },
      },
    });
  }

  @Prop({ type: Schema.Types.ObjectId, ref: COLLECTION.users })
  owner: Types.ObjectId;

  @IsString()
  @Length(3, 12)
  @Prop({ type: String, required: [true, 'Name is required'] })
  name: string;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  @Prop({ type: String })
  description: string;
}
