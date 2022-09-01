import { OmitType } from '@nestjs/swagger';
import { PostClanDto } from './post-clan.dto';

export class PatchClanDto extends OmitType(PostClanDto, ['name']) {}
