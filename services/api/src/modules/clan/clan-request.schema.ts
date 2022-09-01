/** @format */

import { Prop } from '@nestjs/mongoose';
import { AbstractSchema, NestSchema } from '@vypham0209/nestjs-common';
import { COLLECTION } from 'enum/collection.enum';
import { Schema, Types } from 'mongoose';
import { CLAN } from './clan.enum';

@NestSchema({
  softDelete: false,
})
export class ClanRequest extends AbstractSchema {
  static collectionName = COLLECTION.clan_requests;
  @Prop({ type: Schema.Types.ObjectId, index: true, ref: COLLECTION.users })
  user: Types.ObjectId;
  @Prop({ type: Schema.Types.ObjectId, index: true })
  clan: Types.ObjectId;
  @Prop({
    type: String,
    enum: CLAN.REQUEST.APPROVALS,
    default: CLAN.REQUEST.APPROVAL.PENDING,
    index: true,
  })
  status: CLAN.REQUEST.APPROVAL;
}
