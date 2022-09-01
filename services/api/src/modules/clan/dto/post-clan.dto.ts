import { PickType } from '@nestjs/swagger';
import { Clan } from '../clan.schema';

export class PostClanDto extends PickType(Clan, ['name', 'description']) {}
