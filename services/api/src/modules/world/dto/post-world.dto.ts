import { OmitType } from '@nestjs/swagger';
import { World } from '../world.schema';

export class PostWorldDto extends OmitType(World, [
  '_id',
  'createdAt',
  'deletedAt',
  'updatedAt',
]) {}
