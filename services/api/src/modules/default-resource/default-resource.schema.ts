/** @format */

import { Prop } from '@nestjs/mongoose';
import { AbstractSchema, NestSchema } from '@vypham0209/nestjs-common';
import { COLLECTION } from 'enum/collection.enum';

@NestSchema({ softDelete: true })
export class DefaultResource extends AbstractSchema {
  static collectionName = COLLECTION.default_resources;
  @Prop({ type: String })
  name: string;
  @Prop({ type: String })
  key: string;
  @Prop({ type: String })
  path: string;
  @Prop({ type: Number })
  order: number;
}
