import { IsEnum } from 'class-validator';
import { CLAN } from '../clan.enum';

export class RequestApprovalDto {
  @IsEnum(CLAN.REQUEST.APPROVAL)
  status: CLAN.REQUEST.APPROVAL;
}
